function inlineFormatting(text, keyPrefix) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={key}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function blocksFromText(content) {
  const blocks = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: 'list', items: list });
    list = [];
  };

  String(content || '').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); return; }
    const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
    const item = trimmed.match(/^(?:[-*•])\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      blocks.push({ type: 'heading', text: heading[1] });
    } else if (item) {
      flushParagraph(); list.push(item[1]);
    } else {
      flushList(); paragraph.push(trimmed);
    }
  });
  flushParagraph(); flushList();
  return blocks;
}

export function AssistantFormattedText({ content }) {
  const blocks = blocksFromText(content);
  return <div className="assistant-formatted-text">
    {blocks.map((block, index) => block.type === 'list'
      ? <ul key={`list-${index}`}>{block.items.map((item, itemIndex) => <li key={`item-${itemIndex}`}>{inlineFormatting(item, `list-${index}-${itemIndex}`)}</li>)}</ul>
      : block.type === 'heading'
        ? <h4 key={`heading-${index}`}>{inlineFormatting(block.text, `heading-${index}`)}</h4>
        : <p key={`paragraph-${index}`}>{inlineFormatting(block.text, `paragraph-${index}`)}</p>)}
  </div>;
}
