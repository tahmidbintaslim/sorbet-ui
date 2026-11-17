'use client';
// @example {"title":"Basic","description":"Pass items as data. The last item is the current page and is not a link."}
import { Breadcrumbs } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Breadcrumbs
      items={[
        { id: 'home', label: 'Home', href: '/' },
        { id: 'docs', label: 'Docs', href: '/docs' },
        { id: 'components', label: 'Components', href: '/docs/components' },
        { id: 'breadcrumbs', label: 'Breadcrumbs' },
      ]}
    />
  );
}
