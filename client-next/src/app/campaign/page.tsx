'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Campaign from '@/components/screens/Campaign';
import MobileCampaign from '@/components/mobile/screens/MobileCampaign';

export default function CampaignPage() {
  return (
    <DeviceSwitch
      mobile={() => <MobileCampaign />}
      desktop={() => <Campaign />}
    />
  );
}
