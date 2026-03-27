import type { Metadata } from 'next';
import PrijavaForm from './PrijavaForm';

export const metadata: Metadata = {
  title: 'Prijava — Pop Beauty',
  description: 'Prijava na nalog Pop Beauty.',
};

export default function PrijavaPage() {
  return <PrijavaForm />;
}
