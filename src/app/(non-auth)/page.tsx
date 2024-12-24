import BlogList from '../../components/BlogList/BlogList';
import Error from '../../components/Error/Error';
import styles from './page.module.scss';

export default async function HomePage() {
  const blogsResponse = await fetch(`${process.env.BACKEND_API}/blogs/public`);

  const blogsResponseData = await blogsResponse.json();

  if (!blogsResponseData.success) {
    return <Error title={`Oh no! ${blogsResponseData.status}!`} message={blogsResponseData.message} />;
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.title}>Welcome to Blogger!!</h2>
      <p className={styles.subtitle}>Browse blogs written by our trusted authors, enjoy a variety of topics and discussions, or create an account and start writing your own blogs</p>
      <BlogList blogs={blogsResponseData.blogs} />
    </div>
  );
}
