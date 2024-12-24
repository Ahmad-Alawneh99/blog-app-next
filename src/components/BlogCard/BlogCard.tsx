import Link from 'next/link';
import { Blog } from '../../shared/interfaces';
import DateView from '../DateView/DateView';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
  blog: Blog;
  hideAuthor?: boolean;
}

export default function BlogCard({ blog, hideAuthor = false }: BlogCardProps) {
  return (
    <div className={styles.cardContainer}>
      <p className={styles.title}>{blog.title}</p>
      <p className={styles.summary}>{blog.content}</p>
      {!hideAuthor && <p className={styles.author}>By {blog.owner.name}</p>}
      <DateView text="Published on " dateString={blog.createdAt} />
      <DateView text="Updated on " dateString={blog.updatedAt} />
      <Link className={styles.readBlogLink} href={`/blog/${blog._id}`}>Read Full Blog</Link>
    </div>
  );
}
