import {
  CallToAction,
  Compare,
  FAQSection,
  Hero,
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
      <QuickStart />
      <PricingSection />
      <FAQSection />
      <CallToAction />
    </>
  );
}
