'use server'
import { cookies } from "next/headers";
import { Blog, User } from "../shared/interfaces"

export async function registerUser(userData: Partial<User>) {
  const registerResponse = await fetch(`${process.env.BACKEND_API}/users/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    }),
  });

  const registerResponseData = await registerResponse.json();

  if (registerResponseData.token) {
    const cookieStore = await cookies();

    cookieStore.set('blog_app_token', registerResponseData.token);
  }

  return registerResponseData;
}

export async function signIn(userData: Partial<User>) {
  const signInResponse = await fetch(`${process.env.BACKEND_API}/users/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
  });

  const signInResponseData = await signInResponse.json();

  if (signInResponseData.token) {
    const cookieStore = await cookies();

    cookieStore.set('blog_app_token', signInResponseData.token);
  }

  return signInResponseData;
}

export async function createBlog(blogData: Partial<Blog>) {
  const cookieStore = await cookies();
  const createBlogResponse = await fetch(`${process.env.BACKEND_API}/blogs`, {
    method: 'POST',
    headers: {
      Cookie: cookieStore.toString(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: blogData.title,
      content: blogData.content,
    }),
  });

  return createBlogResponse.json();
}

export async function updateBlog(blogData: Partial<Blog>) {
  const cookieStore = await cookies();
  const updateBlogResponse = await fetch(`${process.env.BACKEND_API}/blogs/${blogData._id}`, {
    method: 'PUT',
    headers: {
      Cookie: cookieStore.toString(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: blogData.title,
      content: blogData.content,
    }),
  });

  return updateBlogResponse.json();
}

export async function deleteBlog(blogId: string) {
  const cookieStore = await cookies();
  const updateBlogResponse = await fetch(`${process.env.BACKEND_API}/blogs/${blogId}`, {
    method: 'DELETE',
    headers: {
      Cookie: cookieStore.toString(),
      'Content-Type': 'application/json',
    },
  });

  return updateBlogResponse.json();
}
