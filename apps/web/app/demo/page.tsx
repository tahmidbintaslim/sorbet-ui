import type { Metadata } from 'next';
import DemoApp from '@/components/demo/DemoApp';

export const metadata: Metadata = {
  title: 'Demo',
  description: 'Acme Admin: a working dashboard built with Sorbet UI. Sample data.',
};

export default function DemoPage() {
  return (
    <>
      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Acme Admin demo</h1>
      <DemoApp />
    </>
  );
}
