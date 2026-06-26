import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-lg tracking-tight">사역보고서</span>
        </Link>
        <div className="flex-1" />
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            대시보드
          </Link>
          <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            관리자(설정)
          </Link>
        </nav>
      </div>
    </header>
  );
}
