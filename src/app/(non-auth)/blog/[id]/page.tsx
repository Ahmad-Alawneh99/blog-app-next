import BlogView from "../../../../components/BlogView/BlogView";
import Error from "../../../../components/Error/Error";
import styles from './page.module.scss';

interface ViewBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewBlogPage({ params }: ViewBlogPageProps) {
  const preparedParams = await params;

  const blogResponse = await fetch(`${process.env.BACKEND_API}/blogs/public/${preparedParams.id}`);

  const blogResponseData = await blogResponse.json();

  if (!blogResponseData.success) {
    return <Error title={`Oh no! ${blogResponseData.status}!`} message={blogResponseData.message}/>
  }

  return (
    <div className={styles.pageContainer}>
      <BlogView blog={blogResponseData.blog} />
    </div>
  )
}
