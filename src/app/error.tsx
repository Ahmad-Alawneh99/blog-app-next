'use client';
import Error from '../components/Error/Error';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main>
      <Error title="Oh no! Error" message={`Something went wrong on the server: ${error.message}`} />
    </main>
  );
}
