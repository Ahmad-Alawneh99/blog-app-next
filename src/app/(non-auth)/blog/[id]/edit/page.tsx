import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Error from '../../../../../components/Error/Error';
import BlogForm from '../../../../../components/BlogForm/BlogForm';

interface EditBlogPage {
  params: Promise<{ id: string }>,
}

export default async function EditBlogPage({ params }: EditBlogPage) {
  const preparedParams = await params;
  const cookieStore = await cookies();
  const blogResponse = await fetch(`${process.env.BACKEND_API}/blogs/${preparedParams.id}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  const blogResponseData = await blogResponse.json();

  if (blogResponseData.status === 401) {
    return redirect('/sign-in');
  }

  if (!blogResponseData.success) {
    return <Error title={`Oh no! ${blogResponseData.status}!`} message={blogResponseData.message} />;
  }

  return <BlogForm blogToUpdate={blogResponseData.blog} />;
}
