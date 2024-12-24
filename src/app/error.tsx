'use client';
import Error from '../components/Error/Error';

export default function ErrorPage() {
  return (
    <main>
      <Error title="Oh no! Error!" message="Something went wrong on the server, please try again later" />
    </main>
  );
}
