import BlogForm from "../../../../components/BlogForm/BlogForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateBlogPage() {
  const cookieStore = await cookies();

  // if user is not logged in, redirect to sign in
  if (!cookieStore.get('blog_app_token')?.value.trim()) {
    redirect('/sign-in');
  }

  return <BlogForm />
};
