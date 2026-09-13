"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { aboutPage, posts, type BlogPost } from "./content.generated";
import { site } from "./site.config";

type View = "home" | "archives" | "categories" | "tags" | "about" | "post";
const labels = { home: "首页", archives: "项目与笔记", categories: "分类", tags: "标签", about: "关于我", post: "项目记录" };
const nav = [["项目", "/#projects"], ["经历", "/#experience"], ["笔记", "/archives/"], ["关于", "/about/"]];
function subscribeLocation(callback: () => void) { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); }
function getQuery() { return window.location.search; }
function serverQuery() { return ""; }
function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener("theme-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("theme-change", callback); };
}
function getTheme() { try { return localStorage.getItem("tingying-theme") === "dark"; } catch { return document.documentElement.dataset.theme === "dark"; } }
function serverTheme() { return false; }

export function BlogShell({ view = "home", slug }: { view?: View; slug?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dark = useSyncExternalStore(subscribeTheme, getTheme, serverTheme);
  const searchPanel = useRef<HTMLDivElement>(null);
  const locationQuery = useSyncExternalStore(subscribeLocation, getQuery, serverQuery);
  const filter = new URLSearchParams(locationQuery).get("name") || "";
  const current = posts.find((post) => post.slug === slug);
  const results = posts.filter((post) => post.searchText.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!searchOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchPanel.current?.querySelector("input")?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [searchOpen]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  function toggleTheme() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("tingying-theme", next); } catch { /* Theme still works when storage is unavailable. */ }
    window.dispatchEvent(new Event("theme-change"));
  }
  return <div className="site-shell">
    <a className="skip-link" href="#main">跳到正文</a>
    <header className="site-header"><div className="nav-wrap">
      <Link href="/" className="brand" aria-label="吴廷颖 首页"><span className="brand-mark">W.</span><span>{site.name}<small>TINGYING WU</small></span></Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="主导航">{nav.map(([title, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{title}</a>)}</nav>
      <div className="nav-tools"><button className="icon-button" aria-label="搜索笔记" onClick={() => setSearchOpen(true)}><Icon /></button><button className="icon-button" aria-label={dark ? "切换浅色模式" : "切换深色模式"} onClick={toggleTheme}>{dark ? "☀" : "◐"}</button><a className="nav-contact" href={`mailto:${site.email}`}>联系我 ↗</a><button className="icon-button menu-button" aria-label="切换导航菜单" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button></div>
    </div></header>
    <main id="main">{view === "home" ? <Home /> : <div className="page-container">
      <div className="page-heading"><Link href="/" className="back-link">← 返回首页</Link><p className="eyebrow">{view === "post" ? "PROJECT NOTES" : "PERSONAL KNOWLEDGE"}</p><h1>{view === "post" ? current?.title || "文章未找到" : labels[view]}</h1></div>
      {view === "post" ? current ? <Article post={current} /> : <div className="empty">这篇文章暂时找不到。<Link href="/archives/">浏览全部笔记 →</Link></div>
      : view === "about" ? <div className="about-layout"><div className="markdown-body about-body" dangerouslySetInnerHTML={{ __html: aboutPage.html }} /><div className="about-contact"><div className="monogram">WT</div><h2>{site.name}</h2><p>{site.role}</p><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
      : <><div className="collection-nav"><Link href="/archives/">全部笔记</Link><Link href="/categories/">按分类</Link><Link href="/tags/">按标签</Link></div>
        {(view === "categories" || view === "tags") && <div className="filter-tags">{Array.from(new Set(posts.flatMap(p => view === "tags" ? p.tags : p.categories))).map(name => <a className={filter === name ? "selected" : ""} href={`/${view}/?name=${encodeURIComponent(name)}`} key={name}>{name}</a>)}</div>}
        <NoteList items={posts.filter(p => !filter || (view === "tags" ? p.tags : p.categories).includes(filter))} /></>}
    </div>}</main>
    <footer className="site-footer"><div><Link className="footer-name" href="/">{site.name}<span> / Tingying Wu</span></Link><p>记录项目，也记录解决问题的过程。</p></div><div className="footer-links"><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${site.email}`}>Email ↗</a><small>© {new Date().getFullYear()} {site.name}</small></div></footer>
    {searchOpen && <div className="search-layer" onMouseDown={event => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className="search-panel" ref={searchPanel} role="dialog" aria-modal="true" aria-label="搜索笔记" onKeyDown={event => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input, button, a[href]'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}><div className="search-head"><Icon /><input aria-label="搜索关键词" placeholder="搜索项目、技术或关键词…" value={query} onChange={event => setQuery(event.target.value)} /><button onClick={() => setSearchOpen(false)} aria-label="关闭搜索">Esc</button></div><p className="search-count" aria-live="polite">{results.length} 篇相关记录</p><div className="search-results">{results.map(post => <Link href={`/post/${post.slug}/`} key={post.slug} onClick={() => setSearchOpen(false)}><span>{post.category}</span><strong>{post.title}</strong><small>{post.excerpt}</small></Link>)}{results.length === 0 && <p className="empty">暂时没有匹配的笔记，试试其他关键词。</p>}</div></div></div>}
  </div>;
}
function Icon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>; }
function Home() {
  return <>
    <section className="hero section-wrap">
      <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> HELLO, I’M TINGYING</p><h1>你好，我是<span>{site.name}<i>。</i></span></h1><p className="hero-role">{site.role}</p><p className="hero-description">厦门大学控制工程硕士在读。<br />关注大模型如何接入真实业务，也研究复杂调度问题如何得到更好的解。</p><div className="hero-actions"><a className="button primary" href="#projects">探索我的项目 ↗</a><a className="button secondary" href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a></div><div className="hero-caption"><span>XIAMEN UNIVERSITY</span><span>2027 届硕士 · 大模型工程师方向</span></div></div>
      <div className="hero-art" aria-label="模型、工具与优化组成的工程工作图"><div className="art-grid" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-label">IDEAS INTO SYSTEMS</div><div className="core-node"><span className="node-spark">✳</span><strong>Think. Build.<br />Optimize.</strong><small>从问题出发，让系统运行。</small></div><div className="floating-node node-model"><span>01 / INTELLIGENCE</span><strong>LLM & Agents</strong><div className="node-bars"><i /><i /><i /><i /><i /></div></div><div className="floating-node node-tool"><span>02 / ENGINEERING</span><strong>Tools → Runtime</strong><code>observe · act · iterate</code></div><div className="floating-node node-opt"><span>03 / RESEARCH</span><strong>Optimization</strong><div className="mini-route"><i /><b /><i /><b /><i /></div></div><div className="art-bottom"><span className="status-dot" /> LEARNING BY BUILDING<span>WT / 01</span></div></div>
    </section>
    <div className="focus-band"><div className="section-wrap"><span>我的关注</span><p>让模型理解业务</p><i>✳</i><p>让工具形成闭环</p><i>✳</i><p>让调度更有效率</p></div></div>
    <section id="projects" className="section-wrap content-section"><SectionTitle kicker="SELECTED WORK" title="在实践中，把想法做出来。" subtitle="智能体工程与优化研究，是我目前投入最多的两个方向。" />
      <div className="project-grid">{site.projects.map(project => <article className="project-card" key={project.id}><Link href={project.href} className={`project-visual ${project.visual}`} aria-label={`查看${project.title}`}><span className="visual-index">PROJECT / {project.number}</span>{project.visual === "agent" ? <div className="runtime-diagram"><div className="diagram-input">User request</div><div className="diagram-flow">↓</div><div className="diagram-model">✳ Agent Runtime</div><div className="diagram-branches"><span>Model</span><i>⇄</i><span>Tools</span></div><div className="trace-line">● Trace　 ● Sessions　 ● Safety</div></div> : <div className="route-diagram"><svg viewBox="0 0 400 170" aria-hidden="true"><path d="M30 120 100 100 175 125 255 65 370 100" className="vehicle-path" /><path d="M100 100 150 30 255 65M175 125 290 155 370 100" className="uav-path" />{[[30,120],[100,100],[175,125],[255,65],[370,100],[150,30],[290,155]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i>4 ? 6 : 8} />)}<text x="22" y="153">DEPOT</text><text x="138" y="16">UAV 01</text><text x="280" y="140">UAV 02</text></svg><div className="route-legend"><span>━ 车辆路径</span><span>┄ 无人机任务</span><span>◉ 补能与同步</span></div></div>}<span className="visual-arrow">↗</span></Link><div className="project-content"><p className="eyebrow">{project.category}<span>{project.period}</span></p><h3><Link href={project.href}>{project.title}</Link></h3><p className="project-subtitle">{project.subtitle}</p><p className="project-description">{project.description}</p><div className="tech-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links"><Link href={project.href}>查看项目记录 →</Link>{project.github && <a href={project.github} target="_blank" rel="noreferrer">源代码 ↗</a>}</div></div></article>)}</div>
    </section>
    <section id="experience" className="experience-section"><div className="section-wrap experience-layout"><div className="experience-intro"><p className="eyebrow">EXPERIENCE</p><h2>走进业务，<br />完成交付。</h2><p>从金融知识检索到销售智能助手，在真实场景中连接模型、数据与工程。</p><Link className="text-link" href="/about/">更多关于我 ↗</Link></div><div className="timeline">{site.experience.map(job => <article className="experience-item" key={job.company}><div className="timeline-dot" /><p className="experience-period">{job.period}</p><h3>{job.company}</h3><p className="job-role">{job.role} <span> / {job.domain}</span></p><ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul><div className="tech-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div></div></section>
    <section className="section-wrap content-section"><SectionTitle kicker="BACKGROUND & TOOLKIT" title="用工程能力，连接研究与应用。" /><div className="background-grid"><div className="education-list">{site.education.map(edu => <article key={edu.school}><span className="education-icon">↗</span><div><p>{edu.period}</p><h3>{edu.school}<span>{edu.degree}</span></h3><small>{edu.detail}</small></div></article>)}</div><div className="skill-list">{site.skills.map((skill,i) => <div key={skill.title}><span>0{i+1}</span><div><h3>{skill.title}</h3><p>{skill.items}</p></div></div>)}</div></div></section>
    <section className="notes-section section-wrap content-section"><SectionTitle kicker="FIELD NOTES" title="项目之外，留下思考。" subtitle="记录问题定义、实现选择与工程细节。" link="/archives/" /><NoteList items={posts.slice(0,3)} /></section>
    <section className="contact-section section-wrap"><div><p className="eyebrow">LET’S CONNECT</p><h2>聊聊 AI、工程，<br />或下一个有意思的问题。</h2><p>欢迎交流项目实践、研究想法与工作机会。</p></div><a className="contact-link" href={`mailto:${site.email}`}><span>{site.email}</span><span>↗</span></a></section>
  </>;
}
function SectionTitle({ kicker, title, subtitle, link }: { kicker: string; title: string; subtitle?: string; link?: string }) { return <div className="section-heading"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2>{subtitle && <p className="section-subtitle">{subtitle}</p>}</div>{link && <Link className="text-link" href={link}>全部记录 ↗</Link>}</div>; }
function NoteList({ items }: { items: BlogPost[] }) { return <div className="note-list">{items.map((post,i) => <Link className="note-row" href={`/post/${post.slug}/`} key={post.slug}><span className="note-number">{String(i+1).padStart(2,"0")}</span><div><p>{post.category}<span> / {post.read}</span></p><h3>{post.title}</h3><small>{post.excerpt}</small></div><span className="note-arrow">↗</span></Link>)}{!items.length && <p className="empty">这个主题下还没有笔记。</p>}</div>; }
function Article({ post }: { post: BlogPost }) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const blocks = Array.from(body.current?.querySelectorAll("pre") || []);
    const cleanups = blocks.map(block => {
      const button = document.createElement("button"); button.className = "copy-code"; button.type = "button"; button.textContent = "复制";
      const click = async () => { try { await navigator.clipboard.writeText(block.querySelector("code")?.textContent || ""); button.textContent = "已复制"; } catch { button.textContent = "请手动复制"; } };
      button.addEventListener("click", click); block.appendChild(button);
      return () => { button.removeEventListener("click", click); button.remove(); };
    });
    return () => cleanups.forEach(fn => fn());
  }, [post.slug]);
  return <div className="article-layout"><article><div className="article-meta">{post.date} · {post.category} · {post.read}</div><p className="article-lead">{post.excerpt}</p><div className="markdown-body" ref={body} dangerouslySetInnerHTML={{ __html: post.html }} /><div className="tech-tags article-tags">{post.tags.map(tag => <a key={tag} href={`/tags/?name=${encodeURIComponent(tag)}`}>{tag}</a>)}</div><Link className="text-link" href="/archives/">← 所有项目与笔记</Link></article><aside className="article-toc"><p className="eyebrow">ON THIS PAGE</p><h2>目录</h2><nav aria-label="文章目录">{post.toc.map(item => <a key={item.id} style={{ paddingLeft: Math.max(0,item.level-2)*12 }} href={`#${item.id}`}>{item.title}</a>)}</nav></aside></div>;
}
