'use client';
import {
  ChangeEvent,
  useCallback,
  useState,
  useTransition,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import formStyles from '../sharedStyles/form.module.scss';
import { signIn } from '../../app/actions';

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState({ isError: false, message: '' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleFieldChange = useCallback((
    event: ChangeEvent<HTMLInputElement>,
    fieldName: string) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      if (Object.values(formData).some((value) => !value)) {
        setError({
          isError: true,
          message: 'Email and password are required.',
        });

        return;
      }

      try {
        const signInResponse = await signIn(formData);

        if (signInResponse.success) {
          router.back();
          router.refresh();

        } else {
          setError({
            isError: true,
            message: signInResponse.message,
          });
        }
      } catch (error) {
        setError({
          isError: true,
          message: (error as Error).message,
        });
      }
    });
  }, [router, formData]);

  return (
    <div>
      <form className={formStyles.formContainer}>
        <p className={formStyles.formTitle}>Sign in</p>
        <input
          className={formStyles.simpleInput}
          type="email"
          title="Email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleFieldChange(e, 'email')}
        />
        <input
          className={formStyles.simpleInput}
          type="password"
          title="Password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleFieldChange(e, 'password')}
        />
        <button
          type="button"
          className={formStyles.formSubmitButton}
          disabled={isPending}
          onClick={handleSubmit}
        >Sign in</button>
        {error.isError && !isPending && <p className={formStyles.formError}>{error.message}</p>}
      </form>
      <p className={formStyles.cta}>New here? <Link href="/sign-up">Create an account</Link></p>
    </div>
  );
}
