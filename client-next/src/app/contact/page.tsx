import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ContactPageSwitch } from '@/components/mobile/ContactPageSwitch';

export const metadata = {
  title: 'INTU∞ | Contact',
  description: 'Contact us.',
};

export default function ContactPage() {
  return (
    <ContactPageSwitch>
      <div className="min-h-screen bg-white text-black font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Contact Us</h1>
          <p className="text-sm text-zinc-600 mb-8">
            We&apos;d love to hear from you. Please reach out to us via email or phone.
          </p>
          <div className="space-y-2 text-sm">
            <p>Email: intuoo@gmail.com</p>
            <p>Phone: 093120222</p>
          </div>
        </main>
        <Footer />
      </div>
    </ContactPageSwitch>
  );
}
