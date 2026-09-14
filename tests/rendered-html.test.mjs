import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';

const root = new URL('../', import.meta.url);
const output = new URL('../dist/client/', import.meta.url);
async function html(route = '') { return readFile(new URL(`${route}index.html`, output), 'utf8'); }
async function publishedPosts() {
  const files = await readdir(new URL('content/posts/', root));
  const entries = await Promise.all(files.filter(f => f.endsWith('.md')).map(async file => {
    const parsed = matter(await readFile(new URL(`content/posts/${file}`, root), 'utf8'));
    return { ...parsed.data, slug: parsed.data.slug || path.basename(file, '.md') };
  }));
  return entries.filter(p => p.draft !== true);
}
test('static homepage contains personal identity, projects and contact', async () => {
  const page = await html();
  for (const value of ['吴廷颖', '厦门大学', 'Minimal Agent Runtime', '车机协同', 'wutingying129@gmail.com', 'honesty0119']) assert.ok(page.includes(value), value);
  assert.doesNotMatch(page, /达的学习笔记|lizhengda0525-sudo|href="tel:/);
  assert.match(page, /id="projects"/);
  assert.match(page, /id="experience"/);
});
test('public pages and every published article have independent static HTML', async () => {
  for (const section of ['about', 'archives', 'categories', 'tags']) {
    const page = await html(`${section}/`);
    assert.ok(page.includes('吴廷颖'), section);
    assert.doesNotMatch(page, /达的学习笔记/);
  }
  for (const post of await publishedPosts()) {
    const page = await html(`post/${post.slug}/`);
    assert.ok(page.includes(post.title), post.slug);
    assert.ok(page.includes(`https://honesty0119.github.io/post/${post.slug}/`));
    assert.ok(page.includes('name="description"'));
    assert.doesNotMatch(page, /文章未找到|这篇文章暂时找不到/);
    const anchors = [...page.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
    for (const id of anchors) assert.ok(page.includes(`id="${id}"`), `missing anchor ${id}`);
  }
});
test('local homepage assets and social preview exist', async () => {
  const page = await html();
  const assets = [...page.matchAll(/(?:src|href)="(\/(?:assets\/[^"?#]+|images\/[^"?#]+|favicon\.svg|og\.png))[^" ]*"/g)].map(m => m[1]);
  assert.ok(assets.length > 0);
  for (const asset of new Set(assets)) await access(new URL(asset.slice(1), output));
  await access(new URL('og.png', output));
  const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
  for (const post of await publishedPosts()) assert.ok(sitemap.includes(`/post/${post.slug}/`));
  assert.doesNotMatch(sitemap, /lizhengda0525/);
});

test('experience cards lead to complete static STAR pages with working anchors', async () => {
  const homepage = await html();
  const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
  for (const slug of ['quanju-dtp', 'jinmen-finance']) {
    const route = `/experience/${slug}/`;
    assert.ok(homepage.includes(`href="${route}"`));
    assert.ok(sitemap.includes(route));
    const page = await html(route.slice(1));
    assert.ok(page.includes(`https://honesty0119.github.io${route}`));
    for (const section of ['S｜业务背景', 'T｜承担任务', 'A｜关键行动', 'R｜交付成果']) assert.ok(page.includes(section), `${slug}: ${section}`);
    for (const [, id] of page.matchAll(/href="#([^"]+)"/g)) assert.ok(page.includes(`id="${id}"`), id);
    assert.ok(page.includes('href="/#experience"'));
  }
  const dtp = await html('experience/quanju-dtp/');
  assert.ok(dtp.includes('26 项专项测试通过'));
  assert.ok(dtp.includes('交付范围为代码与测试能力'));
  assert.doesNotMatch(dtp, /TimothCurious|SQL生成准确率达到90%/);
});
