import { Suspense } from 'react';
import SettingsClient from './components/SettingsClient';
import Spinner from '@/components/spinner/Spinner';

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={80} color="var(--neon-green)" />
      </div>
    }>
      <SettingsClient />
    </Suspense>
  );
} 