import Link from 'next/link';
import { DateTime } from 'luxon';
import { Blog } from '../../shared/interfaces';
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
      <p className={styles.date}>Published on {DateTime.fromISO(blog.createdAt).toFormat('dd/MM/yyyy hh:mm a')}</p>
      <p className={styles.date}>Updated on {DateTime.fromISO(blog.updatedAt).toFormat('dd/MM/yyyy hh:mm a')}</p>
      <Link className={styles.readBlogLink} href={`/blog/${blog._id}`}>Read Full Blog</Link>
    </div>
  );
}
