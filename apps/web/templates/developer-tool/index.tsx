'use client';
// Developer tool: a page for an API or SDK, assembled from seven Sorbet blocks:
// code-first hero, feature grid, plan comparison, changelog and a simple footer.
// Each block is a self-contained file (see the other tabs). Sample content.
import NavbarSimple from '@/blocks/navbar/NavbarSimple';
import HeroCode from '@/blocks/hero/HeroCode';
import FeatureGrid from '@/blocks/features/FeatureGrid';
import PricingCompare from '@/blocks/pricing/PricingCompare';
import Changelog from '@/blocks/onboarding/Changelog';
import CtaSplit from '@/blocks/cta/CtaSplit';
import FooterSimple from '@/blocks/footer/FooterSimple';

export default function DeveloperTool() {
  return (
    <>
      <NavbarSimple />
      <HeroCode />
      <FeatureGrid />
      <PricingCompare />
      <Changelog />
      <CtaSplit />
      <FooterSimple />
    </>
  );
}
