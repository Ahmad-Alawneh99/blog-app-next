'use client';
import {
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Blog } from '../../shared/interfaces';
import { UserContext } from '../../shared/UserContext';
import { deleteBlog } from '../../app/actions';
import DateView from '../DateView/DateView';
import styles from './BlogView.module.scss';

interface BlowViewProps {
  blog: Blog;
}

export default function BlogView({ blog }: BlowViewProps) {
  const user = useContext(UserContext);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDeleteBlog = useCallback(() => {
    startTransition(async () => {
      try {
        const deleteResponse = await deleteBlog(blog._id);

        if (deleteResponse.success) {
          router.push('/profile');
          router.refresh();
        } else {
          setError(deleteResponse.message);
        }

      } catch (error) {
        setError((error as Error).message);
      }
    });
  }, [blog._id, router]);

  return (
    <div className={styles.container}>
      { user?._id && user._id === blog.owner._id &&
        <div className={styles.ownerActions}>
          <p>Owner actions: </p>
          <Link className={styles.editLink} href={`./${blog._id}/edit`}>Edit blog</Link>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDeleteBlog}
            disabled={isPending}
          >Delete blog</button>
        </div>
      }
      { error && !isPending && <p className={styles.error}>{error}</p>}
      <p className={styles.title}>{blog.title}</p>
      <p className={styles.authorByline}>By {blog.owner.name}</p>
      <DateView text="Published on " dateString={blog.createdAt} />
      { blog.createdAt !== blog.updatedAt && <DateView text="Updated on " dateString={blog.updatedAt} /> }
      <p className={styles.content}>{blog.content}</p>
    </div>
  );
}
