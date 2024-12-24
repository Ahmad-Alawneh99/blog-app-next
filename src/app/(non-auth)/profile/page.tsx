import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from '../page.module.scss';
import Error from '../../../components/Error/Error';
import BlogList from '../../../components/BlogList/BlogList';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userBlogsResponse = await fetch(`${process.env.BACKEND_API}/blogs`, {
    headers: { Cookie: cookieStore.toString() },
  });

  const userBlogsResponseData = await userBlogsResponse.json();

  if (userBlogsResponseData.status === 401) {
    return redirect('/sign-in');
  }

  if (!userBlogsResponseData.success) {
    return <Error title={`Oh no! ${userBlogsResponseData.status}!`} message={userBlogsResponseData.message} />;
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.title}>Your blogs</h2>
      <p className={styles.subtitle}>Manage, edit and delete your blogs, or create new blogs, published blogs will appear on the home page publicly.</p>
      <Link href="/blog/create" className={styles.createBlogLink}>Create new blog</Link>
      <BlogList blogs={userBlogsResponseData.blogs} hideAuthor />
    </div>
  );
}
