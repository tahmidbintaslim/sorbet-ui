// Server module mapping template slugs to their pages. Each template's index.tsx is
// its own 'use client' boundary, so a page ships only the template it renders.
// Import from server components only.
import type { ComponentType } from 'react';
import AnalyticsDashboard from '@/templates/analytics-dashboard';
import Inbox from '@/templates/inbox';
import Kanban from '@/templates/kanban';
import Storefront from '@/templates/storefront';

export const TEMPLATE_COMPONENTS: Record<string, ComponentType> = {
  'analytics-dashboard': AnalyticsDashboard,
  inbox: Inbox,
  kanban: Kanban,
  storefront: Storefront,
};
