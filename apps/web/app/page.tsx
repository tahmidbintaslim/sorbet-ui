import {
  CallToAction,
  Compare,
  FAQSection,
  Hero,
  Library,
  Marquee,
  Matrix,
  Playground,
  PricingSection,
  QuickStart,
  Showcase,
} from '@/components/Landing';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Compare />
      <Playground />
      <Matrix />
      <Showcase />
      <Library />
      <QuickStart />
      <PricingSection />
      <FAQSection />
      <CallToAction />
    </>
  );
}
