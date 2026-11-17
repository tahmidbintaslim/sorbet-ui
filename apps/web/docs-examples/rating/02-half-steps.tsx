'use client';
// @example {"title":"Half steps","description":"precision={0.5} allows half stars."}
import { Rating } from '@sorbet-ui/react';

export default function HalfSteps() {
  return <Rating aria-label="Rating with half stars" defaultValue={3.5} precision={0.5} color="warning" />;
}
