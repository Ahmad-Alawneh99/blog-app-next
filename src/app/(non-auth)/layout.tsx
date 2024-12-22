import { cookies } from "next/headers";
import GlobalHeader from "../../components/GlobalHeader/GlobalHeader";

export default async function Layout({ children }: { children: React.ReactNode}) {
  const cookieStore = await cookies();

  const userResponse = await fetch(`${process.env.BACKEND_API}/users`, {
    headers: { Cookie: cookieStore.toString() }
  });

  const userResponseData = await userResponse.json();

  return (
    <>
      <GlobalHeader user={userResponseData.user}/>
      {children}
    </>
  );
}
