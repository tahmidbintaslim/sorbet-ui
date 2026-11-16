import { BuiltWith, CallToAction, Compare, ComponentMarquee, Facts, Hero, HowItWorks, Playground } from '@/components/Landing';

export default function Home() {
  return (
    <>
      <Hero />
      <ComponentMarquee />
      <Facts />
      <BuiltWith />
      <HowItWorks />
      <Compare />
      <Playground />
      <CallToAction />
    </>
  );
}
