'use client';
// @example {"title":"Collapsed","description":"Past maxItems the middle collapses into a button that opens the hidden items in a menu."}
import { Breadcrumbs } from '@sorbet-ui/react';

export default function Collapsed() {
  return (
    <Breadcrumbs
      aria-label="Deep path"
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      items={[
        { id: 'home', label: 'Home', href: '/' },
        { id: 'docs', label: 'Docs', href: '/docs' },
        { id: 'components', label: 'Components', href: '/docs/components' },
        { id: 'navigation', label: 'Navigation', href: '/docs/components' },
        { id: 'breadcrumbs', label: 'Breadcrumbs', href: '/docs/components/breadcrumbs' },
        { id: 'examples', label: 'Examples' },
      ]}
    />
  );
}
