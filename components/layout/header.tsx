import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AI Flow Builder
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard" passHref>
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </li>
            <li>
              <Link href="/pipeline-editor" passHref>
                <Button variant="ghost">Pipeline Editor</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}