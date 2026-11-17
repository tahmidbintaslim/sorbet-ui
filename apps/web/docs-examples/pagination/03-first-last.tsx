'use client';
// @example {"title":"First and last buttons","description":"showFirstButton and showLastButton add jumps to both ends."}
import { Pagination } from '@sorbet-ui/react';

export default function FirstLast() {
  return <Pagination count={20} defaultPage={10} showFirstButton showLastButton color="secondary" aria-label="Pagination with first and last" />;
}
