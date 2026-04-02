import type { Metadata } from 'next';
import '../(main)/globals.css'; // Import the main layout specific globals.css

export const metadata: Metadata = {
  title: 'Eye Rest Timer App',
  description: 'An application to help you follow the 20-20-20 eye rest rule.',
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
