import { cookies } from "next/headers";
import GlobalHeader from "../../components/GlobalHeader/GlobalHeader";
import UserContextProvider from "../../shared/UserContextProvider";

export default async function Layout({ children }: { children: React.ReactNode}) {
  const cookieStore = await cookies();

  const userResponse = await fetch(`${process.env.BACKEND_API}/users`, {
    headers: { Cookie: cookieStore.toString() }
  });

  const userResponseData = await userResponse.json();

  return (
    <>
      <UserContextProvider user={userResponseData.user}>
        <GlobalHeader />
        {children}
      </UserContextProvider>
    </>
  );
}
