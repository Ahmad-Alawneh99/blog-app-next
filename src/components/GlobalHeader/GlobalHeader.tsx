'use client'
import Link from 'next/link';
import style from './GlobalHeader.module.scss';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '../../shared/UserContext';

export default function GlobalHeader() {
  const user = useContext(UserContext);
  const router = useRouter();

  async function handleSignOut() {
    document.cookie = 'blog_app_token=;path=/';
    router.refresh();
  }

  function LoggedInNavigationLinks() {
    return (
      <div className={style.linksContainer}>
        <Link className={style.navLink} href="/profile">My blogs</Link>
        <span> / </span>
        <button className={style.signOutButton} type="button" onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }

  function LoggedOutNavigationLinks() {
    return (
      <div className={style.linksContainer}>
        <Link className={style.navLink} href="/sign-in">Sign in</Link>
        <span> / </span>
        <Link className={style.navLink} href="/sign-up">Sign up</Link>
      </div>
    )
  }
  return (
    <div className={style.headerContainer}>
      <p className={style.greetings}>{ user ? `Welcome back, ${user.name}` : 'Hello, Anonymous'}</p>
      <Link className={style.navLink} href="/"><h1 className={style.title}>Blogger</h1></Link>
      { user ? <LoggedInNavigationLinks /> : <LoggedOutNavigationLinks /> }
    </div>
  )
}
