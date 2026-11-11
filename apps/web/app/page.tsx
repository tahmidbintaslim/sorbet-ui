import { CallToAction, Compare, ComponentMarquee, Facts, Hero, HowItWorks, Playground } from '@/components/Landing';

export default function Home() {
  return (
    <>
      <Hero />
      <ComponentMarquee />
      <Facts />
      <HowItWorks />
      <Compare />
      <Playground />
      <CallToAction />
    </>
  );
}
