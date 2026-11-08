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
  WhoFor,
} from '@/components/Landing';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Compare />
      <WhoFor />
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
