export function buildNavBlocks({ parents, friends, children }) {
    const formatItem = (item) => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `🔑 ${item.id} - ${item.title || '(no title)'}`,
              link: { url: `https://www.notion.so/${item.id.replace(/-/g, '')}` },
            },
          },
        ],
      },
    });
  
    const createToggle = (label, items) => ({
      object: 'block',
      type: 'toggle',
      toggle: {
        rich_text: [
          {
            type: 'text',
            text: { content: `${label} (${items.length.toString().padStart(2, '0')})` },
          },
        ],
        children: items.map(formatItem),
      },
    });
  
    return [
      createToggle('📂 Parent Pages', parents),
      createToggle('❄️ Friend Pages', friends),
      createToggle('👶 Children Pages', children),
    ];
  }