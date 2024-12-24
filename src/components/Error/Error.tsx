import Link from 'next/link';
import styles from './Error.module.scss';

interface ErrorProps {
  title: string;
  message: string;
}

export default function Error({ title, message }: ErrorProps) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      <Link href="/" className={styles.link}>Back to home page</Link>
    </div>
  );
}
