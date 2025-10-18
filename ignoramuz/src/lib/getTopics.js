// src/lib/getTopics.js
// Node / Vite style module used by MDX/ASTRO at build time.
// Uses import.meta.glob to eagerly import all .md/.mdx files under src/content/docs/*

/**
 * 返回值：Array<{
 *   topic: { name: string, link?: string },
 *   articles: Array<{ id, title, summary, link, date, tags, cover }>
 * }>
 */

const RAW_GLOB = import.meta.glob('/src/content/docs/*/*.{md,mdx}', { eager: true });

function normalizePathToUrl(path) {
  // path example: '/src/content/docs/language/chaos-evolution.mdx'
  // target: '/language/chaos-evolution'
  let p = path.replace(/^\/?src\/content\/docs/, '');
  p = p.replace(/index\.(md|mdx)$/, ''); // if file is index.mdx inside topic folder -> topic root
  p = p.replace(/\.(md|mdx)$/, '');
  p = p.replace(/\/+$/, ''); // remove trailing slash
  if (!p.startsWith('/')) p = '/' + p;
  return p || '/';
}

function toSafeDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

const DirTopicMap = {
  'language': "语言",
  'reading': "读书",
  'guides': "指南",
  'reference': "参考",
};

export const topicsData = (() => {
  const topicsMap = new Map();

  for (const fullPath in RAW_GLOB) {
    const mod = RAW_GLOB[fullPath];
    // MDX modules usually export `frontmatter` or `metadata` depending on setup
    const fm = (mod && (mod.frontmatter || mod.metadata || {})) || {};
    const fileName = fullPath.split('/').pop();
    // Extract topic folder name: '/src/content/docs/<topic>/<file>'
    const match = fullPath.match(/\/src\/content\/docs\/([^/]+)\/([^/]+)$/);
    if (!match) continue;
    const dirName = decodeURIComponent(match[1]);
    const topicName = DirTopicMap[dirName] || dirName;
    const slugBase = match[2].replace(/\.(md|mdx)$/, '');

    const title = fm.title || fm.name || slugBase;
    const summary = fm.description || fm.summary || fm.excerpt || '';
    const date = fm.pubDate || fm.date || fm.date_published || null;
    const dateObj = date ? toSafeDate(date) : null;
    const tags = fm.tags || fm.tag || [];
    const cover = fm.cover || fm.image || null;

    const link = normalizePathToUrl(fullPath);

    const article = {
      id: `${dirName}/${slugBase}`,
      title,
      summary,
      link,
      date: dateObj ? dateObj.toISOString() : null,
      tags,
      cover,
    };

    if (!topicsMap.has(topicName)) topicsMap.set(topicName, []);
    topicsMap.get(topicName).push(article);
  }

  // Convert to array, sort each topic's articles by date desc, keep top N
  const TOP_N_PER_TOPIC = 6;

  const topicsArray = Array.from(topicsMap.entries()).map(([name, articles]) => {
    // sort by date desc; articles without date go last
    articles.sort((a, b) => {
      if (a.date && b.date) return new Date(b.date) - new Date(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });

    return {
      topic: { name, link: `/${encodeURIComponent(name)}` },
      articles: articles.slice(0, TOP_N_PER_TOPIC),
    };
  });

  // Optional: sort topics by number of articles desc or alphabetically
  topicsArray.sort((a, b) => b.articles.length - a.articles.length || a.topic.name.localeCompare(b.topic.name));

  return topicsArray;
})();
