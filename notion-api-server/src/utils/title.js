export function getTitleFromProperties(page) {
    const propKeys = Object.keys(page.properties || {});
  
    for (const key of propKeys) {
      const prop = page.properties[key];
  
      if (prop?.type === 'title' && Array.isArray(prop.title)) {
        return prop.title.map(t => t.plain_text).join('');
      }
    }
  
    return '(Untitled)';
  }
  export function getTitleFromDatabase(db) {
    return db.title?.map(t => t.plain_text).join('') || '(Untitled Database)';
  }
  export function getTitle(obj) {
    if (!obj) return '(Untitled)';
  
    // 👉 Nếu là database
    if (obj.object === 'database') {
      return obj.title?.map(t => t.plain_text).join('') || '(Untitled Database)';
    }
  
    // 👉 Nếu là page
    if (obj.object === 'page') {
      const propKeys = Object.keys(obj.properties || {});
      for (const key of propKeys) {
        const prop = obj.properties[key];
        if (prop?.type === 'title' && Array.isArray(prop.title)) {
          return prop.title.map(t => t.plain_text).join('');
        }
      }
      return '(Untitled Page)';
    }
  
    // 👉 Nếu không xác định
    return '(Untitled)';
  }