import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

export default async function SignUpPage() {
	const cookieStore = await cookies();

	// if user is already logged in, redirect to dashboard
	if (cookieStore.get('blog_app_token')?.value.trim()) {
		redirect('../');
	}

	return (
		<SignUpForm/>
	);
}
