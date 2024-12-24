'use client';
import { DateTime } from 'luxon';
import styles from './DateView.module.scss';

interface DateViewProps {
  text: string;
  dateString: string;
}

export default function DateView({ text, dateString }: DateViewProps) {
  return (
    <p className={styles.date}>{`${text}${DateTime.fromISO(dateString).toFormat('dd/MM/yyyy hh:mm a')}`}</p>
  );
}
