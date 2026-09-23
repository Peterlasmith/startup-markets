import { defineConfig } from 'astro/config';

function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if (node?.type !== 'element' || node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
    });
  };
}

function rehypeWrapTables() {
  return (tree) => {
    wrap(tree);
  };

  function wrap(node) {
    if (!node?.children) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child?.type === 'element' && child.tagName === 'table') {
        node.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [child],
        };
      } else {
        wrap(child);
      }
    }
  }
}

function visit(node, fn) {
  fn(node);
  if (!node?.children) return;
  for (const child of node.children) visit(child, fn);
}

const rawBase = process.env.BASE_PATH ?? '/';
const base = !rawBase || rawBase === '/' ? '/' : `/${rawBase.replace(/^\/|\/$/g, '')}`;

export default defineConfig({
  site: process.env.SITE_URL || 'https://peterlasmith.github.io',
  base,
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [rehypeExternalLinks, rehypeWrapTables],
  },
});
