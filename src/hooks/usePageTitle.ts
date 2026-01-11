import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const usePageTitle = (title: string) => {
  const setPageTitle = useAppStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle(title);
    document.title = `${title} | E-Komplektasiya`;

    return () => {
      setPageTitle('');
      document.title = 'E-Komplektasiya';
    };
  }, [title, setPageTitle]);
};
