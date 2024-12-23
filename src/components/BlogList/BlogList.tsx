import { Blog } from "../../shared/interfaces";
import BlogCard from "../BlogCard/BlogCard";
import styles from './BlogList.module.scss';

interface BlogListProps {
  blogs: Blog[];
  hideAuthor?: boolean;
}

export default function BlogList({ blogs, hideAuthor = false }: BlogListProps) {
  return (
    <div className={styles.container}>
      { blogs.length ? blogs.map((blog) => (
          <BlogCard blog={blog} hideAuthor={hideAuthor} key={blog._id} />
        )) : <h2 className={styles.noBlogs}>No blogs found!</h2>
      }
    </div>
  )
}
