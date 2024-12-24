import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignInForm from '../../components/SignInForm/SignInForm';

export default async function SignInPage() {
  const cookieStore = await cookies();

  // if user is already logged in, redirect to dashboard
  if (cookieStore.get('blog_app_token')?.value.trim()) {
    redirect('../');
  }

  return <SignInForm />;
}
