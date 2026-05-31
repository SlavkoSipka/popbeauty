import ScrollToTop from '@/components/layout/ScrollToTop';

export default function ProizvodiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
}
