import { createPageMetadata } from '@/lib/site';
import SpinGame from './SpinGame';

export const metadata = createPageMetadata({ title: 'Spin & Win', description: 'Take a spin at Tech Forge and win a prize.', path: '/game' });
export default function GamePage() { return <SpinGame />; }
