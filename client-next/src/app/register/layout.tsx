import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account – Join INTU∞',
  description: 'Sign up for an INTU∞ account to shop premium Vietnamese streetwear, track your orders, and get early access to new collections.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
