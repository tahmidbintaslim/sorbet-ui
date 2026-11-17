// Props table for one component or data type. Rows come from lib/docs-api.ts, which
// scripts/gen-docs.mjs reads out of packages/react/src, so the table cannot drift
// from the code. On narrow screens the table scrolls inside its own container.
import { Box, Link, Typography } from '@mui/material';
import type { ApiTable as ApiTableData } from '@/lib/docs-api';

const MONO = 'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const code = {
  fontFamily: MONO,
  fontSize: 12.5,
  lineHeight: 1.6,
  px: 0.75,
  py: 0.25,
  borderRadius: '6px',
  bgcolor: 'action.hover',
  overflowWrap: 'anywhere',
} as const;

const cell = { px: 2, py: 1.5, textAlign: 'left', verticalAlign: 'top', borderBottom: 1, borderColor: 'divider' } as const;

export default function ApiTable({ table }: { table: ApiTableData }) {
  const note = table.mui && (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
      {table.props.length > 0 ? 'Also accepts' : 'Accepts'} the{' '}
      <Link href={table.mui.href} rel="noopener" sx={{ fontWeight: 600 }}>
        MUI {table.mui.name} props
      </Link>
      {table.props.length > 0 ? ', except the ones redefined above.' : '. Sorbet re-exports it unchanged.'}
    </Typography>
  );

  if (table.props.length === 0) return note;

  return (
    <>
      <Box
        role="region"
        aria-label={`${table.name} ${table.kind === 'type' ? 'fields' : 'props'}`}
        tabIndex={0}
        data-testid={`api-${table.name}`}
        sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
      >
        <Box component="table" sx={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontSize: 14 }}>
          <Box component="thead" sx={{ bgcolor: 'action.hover' }}>
            <tr>
              {[table.kind === 'type' ? 'Field' : 'Prop', 'Type', 'Default', 'Description'].map((h) => (
                <Box component="th" scope="col" key={h} sx={{ ...cell, py: 1.25, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {h}
                </Box>
              ))}
            </tr>
          </Box>
          <tbody>
            {table.props.map((p, i) => (
              <Box component="tr" key={p.name} sx={i === table.props.length - 1 ? { '& > *': { borderBottom: 0 } } : undefined}>
                <Box component="th" scope="row" sx={{ ...cell, fontWeight: 400, whiteSpace: 'nowrap' }}>
                  <Box component="code" sx={{ ...code, fontWeight: 700 }}>
                    {p.name}
                  </Box>
                  {p.required && (
                    <Typography component="span" sx={{ ml: 1, fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
                      required
                    </Typography>
                  )}
                </Box>
                <Box component="td" sx={{ ...cell, maxWidth: 300 }}>
                  <Box component="code" sx={{ ...code, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
                    {p.type}
                  </Box>
                </Box>
                <Box component="td" sx={{ ...cell, maxWidth: 200 }}>
                  {p.default ? (
                    <Box component="code" sx={code}>
                      {p.default}
                    </Box>
                  ) : (
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      <span aria-hidden>–</span>
                      <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                        none
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box component="td" sx={{ ...cell, color: 'text.secondary', minWidth: 200 }}>
                  {p.description}
                </Box>
              </Box>
            ))}
          </tbody>
        </Box>
      </Box>
      {note}
    </>
  );
}
