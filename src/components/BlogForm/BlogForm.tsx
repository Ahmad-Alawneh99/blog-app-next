'use client';
import { ChangeEvent, useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import formStyles from '../sharedStyles/form.module.scss';
import { Blog } from '../../shared/interfaces';
import { createBlog, updateBlog } from '../../app/actions';

interface BlogFormProps {
  blogToUpdate?: Blog;
}

export default function BlogForm({ blogToUpdate }: BlogFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState({ isError: false, message: '' });
  const [formData, setFormData] = useState({
    title: blogToUpdate?.title || '',
    content: blogToUpdate?.content || '',
  });
  const router = useRouter();

  const handleFieldChange = useCallback((
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string) => {
      setFormData((currentFormData) => ({
        ...currentFormData,
        [fieldName]: event.target.value,
      }));
  }, []);

  const isCreationValid = useCallback(() => {
    return !Object.values(formData).some((value) => !value);
  }, [formData]);

  const isUpdatingValid = useCallback(() => {
    return blogToUpdate ? (blogToUpdate.title !== formData.title || blogToUpdate.content !== formData.content) : true;
  }, [blogToUpdate, formData]);

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      if (!isCreationValid()) {
        setError({
          isError: true,
          message: 'Title and content are required',
        });

        return;
      }

      if (!isUpdatingValid()) {
        setError({
          isError: true,
          message: 'Nothing to update',
        });

        return;
      }

      try {
        let response;

        if (blogToUpdate) {
          response = await updateBlog({...formData, _id: blogToUpdate._id});
        } else {
          response = await createBlog(formData);
        }

        if (response.success) {
          if (blogToUpdate) {
            router.back();
          } else {
            router.push('/profile');
          }
          router.refresh();
        } else {
          setError({
            isError: true,
            message: response.message,
          });
        }
      } catch (error) {
        setError({
          isError: true,
          message: (error as Error).message,
        });
      }
    });
  }, [router, formData, blogToUpdate, isCreationValid, isUpdatingValid]);

  return (
    <form className={`${formStyles.formContainer} ${formStyles.expandedForm}`}>
      <p className={formStyles.formTitle}>{blogToUpdate ? 'Update blog' : 'Create a blog'}</p>
      <input
        className={formStyles.simpleInput}
        type="text"
        title="title"
        placeholder="Blog title"
        value={formData.title}
        onChange={(e) => handleFieldChange(e, 'title')}
      />
      <textarea
        className={formStyles.textareaInput}
        title="content"
        placeholder="Blog content"
        value={formData.content}
        onChange={(e) => handleFieldChange(e, 'content')}
      />
      <button
        type="button"
        className={formStyles.formSubmitButton}
        disabled={isPending}
        onClick={handleSubmit}
      >{blogToUpdate ? 'Save' : 'Create'}</button>
      {error.isError && !isPending && <p className={formStyles.formError}>{error.message}</p>}
    </form>
  );
};
