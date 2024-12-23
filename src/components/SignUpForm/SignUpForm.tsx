'use client';
import { ChangeEvent, useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import formStyles from '../sharedStyles/form.module.scss';
import { registerUser } from '../../app/actions';

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState({ isError: false, message: '' });
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  })
  const router = useRouter();

  const handleFieldChange = useCallback((
    event: ChangeEvent<HTMLInputElement>,
    fieldName: string) => {
      setFormData((currentFormData) => ({
        ...currentFormData,
        [fieldName]: event.target.value
      }));
  }, []);

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      if (Object.values(formData).some((value) => !value)) {
        setError({
          isError: true,
          message: 'Name, email and password are required',
        });

        return;
      }

      try {
        const registerResponse = await registerUser(formData);

        if (registerResponse.success) {
          router.back();
          router.refresh();
        } else {
          setError({
            isError: true,
            message: registerResponse.message,
          });
        }
      } catch (error) {
        setError({
          isError: true,
          message: (error as Error)?.message,
        });
      }
    });
  }, [router, formData]);

  return (
    <div>
      <form className={formStyles.formContainer}>
        <p className={formStyles.formTitle}>Sign up</p>
        <input
          className={formStyles.simpleInput}
          type="text"
          title="Name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleFieldChange(e, 'name')}
        />
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
        >Sign up</button>
        {error.isError && !isPending && <p className={formStyles.formError}>{error.message}</p>}
      </form>
      <p className={formStyles.cta}>Have an account? <Link href="/sign-in">Sign in here</Link></p>
    </div>
  );
};
