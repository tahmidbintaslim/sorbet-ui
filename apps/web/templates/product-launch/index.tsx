'use client';
// Product launch: a waitlist page assembled from seven Sorbet blocks, top to bottom.
// Each block is a self-contained file (see the other tabs), so you can swap any
// section for another block from /blocks. The copy is sample content.
import NavbarCentered from '@/blocks/navbar/NavbarCentered';
import HeroMinimal from '@/blocks/hero/HeroMinimal';
import FeatureSteps from '@/blocks/features/FeatureSteps';
import FeatureList from '@/blocks/features/FeatureList';
import TestimonialFeatured from '@/blocks/testimonials/TestimonialFeatured';
import CtaNewsletter from '@/blocks/cta/CtaNewsletter';
import FooterNewsletter from '@/blocks/footer/FooterNewsletter';

export default function ProductLaunch() {
  return (
    <>
      <NavbarCentered />
      <HeroMinimal />
      <FeatureSteps />
      <FeatureList />
      <TestimonialFeatured />
      <CtaNewsletter />
      <FooterNewsletter />
    </>
  );
}
