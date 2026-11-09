// Server component: renders a template's blocks top to bottom, as the full page would.
// Only these blocks' client code ships to the page.
import { BLOCK_COMPONENTS } from './blocks-registry';

export default function TemplatePreview({ blocks }: { blocks: string[] }) {
  return (
    <div data-testid="template-preview">
      {blocks.map((id) => {
        const Block = BLOCK_COMPONENTS[id];
        return <Block key={id} />;
      })}
    </div>
  );
}
