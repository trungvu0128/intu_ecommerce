import type { Metadata } from 'next';
import Campaign from '@/components/screens/Campaign';

export const metadata: Metadata = {
  title: 'Campaigns – Latest Drops & Lookbooks',
  description: 'Explore INTU∞ seasonal campaigns, latest drops, and lookbook collections. Discover the newest styles in premium Vietnamese streetwear.',
  openGraph: {
    title: 'INTU∞ Campaigns – Latest Drops & Lookbooks',
    description: 'Explore seasonal campaigns and discover the newest styles from INTU∞.',
    type: 'website',
  },
  alternates: {
    canonical: '/campaign',
  },
};

export default function CampaignPage() {
  return <Campaign />;
}
