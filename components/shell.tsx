import type { ReactNode } from "react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { BOOK_CALL_URL, SALO_HOME, SALO_PRIVACY, WHO_WE_ARE } from "@/lib/site";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="logo-link" href={SALO_HOME}>
            <Logo />
            <span className="sr-only">Salo</span>
          </a>
          <Button href={BOOK_CALL_URL}>Book a call</Button>
        </div>
      </header>
      <main id="content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <p>{WHO_WE_ARE}</p>
          <nav className="footer-links" aria-label="Salo">
            <a href={SALO_HOME}>salo.uk</a>
            <a href={SALO_PRIVACY}>Privacy notice</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
