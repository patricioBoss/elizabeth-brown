import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname();

  const checkPath = path.startsWith('#');

  const normalActive = !checkPath && pathname === path;

  const deepActive = !checkPath && (pathname === path || pathname?.startsWith(`${path}/`)) || false;

  return deep ? deepActive : normalActive;
}
