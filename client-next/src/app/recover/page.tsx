import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Recover Password',
  description: 'Reset your INTU∞ account password. Enter your email to receive a recovery link.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecoverPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Recover Password</h1>
        <p className="text-sm text-zinc-600 mb-8">
          This feature is currently under development.
        </p>
      </main>
      <Footer />
    </div>
  );
}
