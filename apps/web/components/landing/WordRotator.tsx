'use client';
// Cycles through words with a vertical slide. Screen readers get the first
// word only (the parent heading carries the full static label).
import * as React from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE } from '../motion';

export default function WordRotator({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const reduce = useReducedMotion();
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, words.length, interval]);

  return (
    <Box component="span" aria-hidden sx={{ position: 'relative', display: 'inline-grid', verticalAlign: 'bottom' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: '0.6em', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-0.6em', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ gridArea: '1 / 1', whiteSpace: 'nowrap' }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </Box>
  );
}
