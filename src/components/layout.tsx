import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-lg">똥차 퀴즈</Link>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/" className="hover:text-primary/90 transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary/90 transition-colors">
                  관리자
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 똥차 퀴즈. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
