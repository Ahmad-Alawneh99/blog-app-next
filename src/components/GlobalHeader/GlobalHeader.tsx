'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { UserContext } from '../../shared/UserContext';
import style from './GlobalHeader.module.scss';

export default function GlobalHeader() {
  const user = useContext(UserContext);
  const router = useRouter();

  const handleSignOut = useCallback(() => {
    document.cookie = 'blog_app_token=;path=/';
    router.refresh();
  }, [router]);

  function LoggedInNavigationLinks() {
    return (
      <div className={style.linksContainer}>
        <Link className={style.navLink} href="/profile">My blogs</Link>
        <span> / </span>
        <button className={style.signOutButton} type="button" onClick={handleSignOut}>Sign out</button>
      </div>
    );
  }

  function LoggedOutNavigationLinks() {
    return (
      <div className={style.linksContainer}>
        <Link className={style.navLink} href="/sign-in">Sign in</Link>
        <span> / </span>
        <Link className={style.navLink} href="/sign-up">Sign up</Link>
      </div>
    );
  }

  return (
    <div className={style.headerContainer}>
      <p className={style.greetings}>{ user ? `Welcome back, ${user.name}` : 'Hello, Anonymous'}</p>
      <Link className={style.navLink} href="/"><h1 className={style.title}>Blogger</h1></Link>
      { user ? <LoggedInNavigationLinks /> : <LoggedOutNavigationLinks /> }
    </div>
  );
}
