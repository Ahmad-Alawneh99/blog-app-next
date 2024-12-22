import BlogForm from "../../../../../components/BlogForm/BlogForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  // @PENDING: redirect to login if logged out, display an error if 403
  if (!blogResponseData.success) {
    return redirect('/sign-in');
  }

  return <BlogForm blogToUpdate={blogResponseData.blog} />
};
