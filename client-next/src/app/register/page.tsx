import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Register from '@/components/screens/Register';
import MobileRegister from '@/components/mobile/screens/MobileRegister';

export const metadata = {
  title: 'INTU∞ | Register',
  description: 'Create an account to shop with INTU∞.',
};

export default function RegisterPage() {
  return (
    <DeviceSwitch
      mobile={() => <MobileRegister />}
      desktop={() => <Register />}
    />
  );
}
