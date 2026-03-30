import About from '@/components/screens/About';
import { AboutPageSwitch } from '@/components/mobile/AboutPageSwitch';

export const metadata = {
  title: 'INTU∞ | About Us',
  description: 'Learn about the story and mission of INTU∞.',
};

export default function AboutPage() {
  return (
    <AboutPageSwitch>
      <About />
    </AboutPageSwitch>
  );
}
