import { CallToAction, Compare, ComponentMarquee, Facts, Hero, Playground } from '@/components/Landing';

export default function Home() {
  return (
    <>
      <Hero />
      <ComponentMarquee />
      <Facts />
      <Compare />
      <Playground />
      <CallToAction />
    </>
  );
}
