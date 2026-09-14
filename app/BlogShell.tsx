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
    <header className={`site-header ${view === "home" ? "home-header" : ""}`} ><div className="nav-wrap">
      <Link href="/" className="brand" aria-label="吴廷颖 首页"><span className="brand-mark">W.</span><span>{site.name}<small>TINGYING WU</small></span></Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="主导航">{nav.map(([title, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{title}</a>)}</nav>
      <div className="nav-tools"><button className="icon-button" aria-label="搜索笔记" onClick={() => setSearchOpen(true)}><Icon /></button><button className="icon-button" aria-label={dark ? "切换浅色模式" : "切换深色模式"} onClick={toggleTheme}><Icon kind={dark ? "sun" : "moon"} /></button><a className="nav-contact" href={`mailto:${site.email}`}>联系我 ↗</a><button className="icon-button menu-button" aria-label="切换导航菜单" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon kind={menuOpen ? "close" : "menu"} /></button></div>
    </div></header>
    <main id="main">{view === "home" ? <Home /> : <div className="page-container">
      <div className="page-heading"><Link href="/" className="back-link">← 返回首页</Link><p className="eyebrow">{view === "post" ? "PROJECT NOTES" : "PERSONAL KNOWLEDGE"}</p><h1>{view === "post" ? current?.title || "文章未找到" : labels[view]}</h1></div>
      {view === "post" ? current ? <Article post={current} /> : <div className="empty">这篇文章暂时找不到。<Link href="/archives/">浏览全部笔记 →</Link></div>
      : view === "about" ? <div className="about-layout"><div className="markdown-body about-body" dangerouslySetInnerHTML={{ __html: aboutPage.html }} /><div className="about-contact"><div className="monogram">WT</div><h2>{site.name}</h2><p>{site.role}</p><a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
      : <><div className="collection-nav"><Link aria-current={view === "archives" ? "page" : undefined} href="/archives/">全部笔记</Link><Link aria-current={view === "categories" ? "page" : undefined} href="/categories/">按分类</Link><Link aria-current={view === "tags" ? "page" : undefined} href="/tags/">按标签</Link></div>
        {(view === "categories" || view === "tags") && <div className="filter-tags">{Array.from(new Set(posts.flatMap(p => view === "tags" ? p.tags : p.categories))).map(name => <a className={filter === name ? "selected" : ""} href={`/${view}/?name=${encodeURIComponent(name)}`} key={name}>{name}</a>)}</div>}
        <div className="journal-layout"><NoteList items={posts.filter(p => !filter || (view === "tags" ? p.tags : p.categories).includes(filter))} /><ProfileCard /></div></>}
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
function Icon({ kind = "search" }: { kind?: "search" | "sun" | "moon" | "menu" | "close" | "arrow" | "down" }) {
  const paths = { search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>, sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>, moon: <path d="M20.3 14A8.5 8.5 0 0 1 10 3.7 8.5 8.5 0 1 0 20.3 14Z" />, menu: <path d="M4 7h16M4 12h16M4 17h16" />, close: <path d="m6 6 12 12M6 18 18 6" />, arrow: <path d="M5 19 19 5M5 5h14v14" />, down: <path d="M12 4v16m-6-6 6 6 6-6" /> };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}
function Home() {
  return <>
    <section className="hero">
      <div className="hero-backdrop" aria-hidden="true"><picture><img className="hero-photo" src="/images/alpine-dawn.webp" alt="" fetchPriority="high" /></picture><div className="hero-shade" /></div>
      <div className="hero-layout section-wrap">
        <div className="hero-copy">
          <p className="eyebrow">AI ENGINEERING × OPTIMIZATION</p>
          <h1>构建 AI 应用，<span>求解复杂决策。</span></h1>
          <p className="hero-description">从 Agent 工具调用到车机协同调度，<br />用代码连接模型、数据与真实问题。</p>
          <p className="hero-credential"><span className="status-dot" /> 厦门大学 · 控制工程硕士在读<span className="credential-divider" />2027 届</p>
          <div className="hero-actions"><a className="button primary" href="#projects">查看精选项目 <span>↗</span></a><a className="button secondary" href="#experience">了解实习经历 <span>↓</span></a></div>
          <a className="hero-source" href={site.github} target="_blank" rel="noreferrer">在 GitHub 查看我的代码 <Icon kind="arrow" /></a>
        </div>
        <div className="hero-work" aria-label="代表项目预览">
          <div className="hero-work-heading"><span>SELECTED WORK</span><span>工程 / 研究</span></div>
          <Link href={site.projects[0].href} className="spotlight-card spotlight-agent">
            <div className="spotlight-meta"><span>01 / AGENT ENGINEERING</span><span className="spotlight-type">独立开发</span></div>
            <h2>Minimal Agent Runtime</h2>
            <p>模型之外，把执行过程做扎实。</p>
            <div className="spotlight-flow" aria-hidden="true"><span><small>01</small>模型决策</span><i>→</i><span><small>02</small>工具执行</span><i>→</i><span><small>03</small>结果回填</span></div>
            <div className="spotlight-bottom"><span>流式响应 · 会话隔离 · Trace 追踪</span><span className="spotlight-arrow"><Icon kind="arrow" /></span></div>
          </Link>
          <Link href={site.projects[1].href} className="spotlight-card spotlight-research">
            <div className="spotlight-meta"><span>02 / OPTIMIZATION</span><span className="spotlight-type">研究项目</span></div>
            <div className="spotlight-research-body"><div><h2>车机协同巡检与能源调度</h2><p>MILP 建模 · 能源感知启发式</p></div><svg className="spotlight-route" viewBox="0 0 100 70" fill="none" aria-hidden="true"><path d="M8 53 35 43 63 53 91 27" /><path d="m35 43 12-31 44 15" strokeDasharray="3 4" />{[[8,53],[35,43],[63,53],[91,27],[47,12]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="3" />)}</svg></div>
            <div className="spotlight-bottom"><span>联合考虑路径、时序与补能约束</span><span className="spotlight-arrow"><Icon kind="arrow" /></span></div>
          </Link>
        </div>
      </div>
      <div className="hero-bottom section-wrap"><span>模型应用 / 系统实现 / 优化建模</span><a href="#projects" className="scroll-cue">继续探索 <Icon kind="down" /></a></div>
    </section>
    <div className="intro-dock section-wrap"><Link href="/about/" className="dock-identity"><span className="monogram">WT</span><div><strong>{site.name}</strong><small>2027 年 6 月预计毕业</small></div></Link><div className="dock-item"><small>近期实习</small><strong>AI Coding / FDE <span>· 圈巨网络</span></strong></div><div className="dock-item"><small>业务实践</small><strong>RAG / Text2SQL <span>· 智能问答</span></strong></div><div className="dock-item"><small>研究方向</small><strong>组合优化 <span>与机器学习</span></strong></div><Link href="/about/" className="dock-more" aria-label="了解更多关于吴廷颖"><Icon kind="arrow" /></Link></div>
    <section id="projects" className="section-wrap content-section"><SectionTitle kicker="SELECTED WORK" title="精选项目。把想法变成现实。" subtitle="智能体工程与优化研究，是我目前投入最多的两个方向。" />
      <div className="project-grid">{site.projects.map(project => <article className="project-card" key={project.id}><Link href={project.href} className={`project-visual ${project.visual}`} aria-label={`查看${project.title}`}><span className="visual-index">PROJECT / {project.number}</span>{project.visual === "agent" ? <div className="runtime-diagram"><div className="diagram-input">User request</div><div className="diagram-flow">↓</div><div className="diagram-model">✳ Agent Runtime</div><div className="diagram-branches"><span>Model</span><i>⇄</i><span>Tools</span></div><div className="trace-line">● Trace　 ● Sessions　 ● Safety</div></div> : <div className="route-diagram"><svg viewBox="0 0 400 170" aria-hidden="true"><path d="M30 120 100 100 175 125 255 65 370 100" className="vehicle-path" /><path d="M100 100 150 30 255 65M175 125 290 155 370 100" className="uav-path" />{[[30,120],[100,100],[175,125],[255,65],[370,100],[150,30],[290,155]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i>4 ? 6 : 8} />)}<text x="22" y="153">DEPOT</text><text x="138" y="16">UAV 01</text><text x="280" y="140">UAV 02</text></svg><div className="route-legend"><span>━ 车辆路径</span><span>┄ 无人机任务</span><span>◉ 补能与同步</span></div></div>}<span className="visual-arrow">↗</span></Link><div className="project-content"><p className="eyebrow">{project.category}<span>{project.period}</span></p><h3><Link href={project.href}>{project.title}</Link></h3><p className="project-subtitle">{project.subtitle}</p><p className="project-description">{project.description}</p><div className="tech-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links"><Link href={project.href}>查看项目记录 →</Link>{project.github && <a href={project.github} target="_blank" rel="noreferrer">源代码 ↗</a>}</div></div></article>)}</div>
    </section>
    <section id="experience" className="experience-section"><div className="section-wrap experience-layout"><div className="experience-intro"><p className="eyebrow">EXPERIENCE</p><h2>走进业务，<br />完成交付。</h2><p>从金融知识检索到销售智能助手，在真实场景中连接模型、数据与工程。</p><Link className="text-link" href="/about/">更多关于我 ↗</Link></div><div className="timeline">{site.experience.map(job => <article className="experience-item" key={job.company}><div className="timeline-dot" /><p className="experience-period">{job.period}</p><h3>{job.company}</h3><p className="job-role">{job.role} <span> / {job.domain}</span></p><ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul><div className="tech-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div></div></section>
    <section className="section-wrap content-section"><SectionTitle kicker="BACKGROUND & TOOLKIT" title="积累，让探索走得更远。" /><div className="background-grid"><div className="education-list">{site.education.map(edu => <article key={edu.school}><span className="education-icon">↗</span><div><p>{edu.period}</p><h3>{edu.school}<span>{edu.degree}</span></h3><small>{edu.detail}</small></div></article>)}</div><div className="skill-list">{site.skills.map((skill,i) => <div key={skill.title}><span>0{i+1}</span><div><h3>{skill.title}</h3><p>{skill.items}</p></div></div>)}</div></div></section>
    <section className="notes-section section-wrap content-section"><SectionTitle kicker="FIELD NOTES" title="每一次实践，都值得记录。" subtitle="关于智能体、工程与优化的项目笔记。" link="/archives/" /><div className="journal-layout"><NoteList items={posts.slice(0,3)} /><ProfileCard /></div></section>
    <section className="contact-section section-wrap"><div><p className="eyebrow">LET’S CONNECT</p><h2>聊聊 AI、工程，<br />或下一个有意思的问题。</h2><p>欢迎交流项目实践、研究想法与工作机会。</p></div><a className="contact-link" href={`mailto:${site.email}`}><span>{site.email}</span><span>↗</span></a></section>
  </>;
}
function SectionTitle({ kicker, title, subtitle, link }: { kicker: string; title: string; subtitle?: string; link?: string }) { return <div className="section-heading"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2>{subtitle && <p className="section-subtitle">{subtitle}</p>}</div>{link && <Link className="text-link" href={link}>全部记录 ↗</Link>}</div>; }
function ProfileCard() {
  const categoryCount = new Set(posts.flatMap(post => post.categories)).size;
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
  return <aside className="profile-card"><div className="profile-cover" /><div className="profile-content"><div className="monogram">WT</div><h3>{site.name}</h3><p>控制工程硕士在读。<br />在模型、代码与优化问题之间探索。</p><div className="profile-stats"><Link href="/archives/"><strong>{posts.length}</strong><span>笔记</span></Link><Link href="/categories/"><strong>{categoryCount}</strong><span>分类</span></Link><Link href="/tags/"><strong>{tags.length}</strong><span>标签</span></Link></div><a className="profile-follow" href={site.github} target="_blank" rel="noreferrer">在 GitHub 上关注我 <Icon kind="arrow" /></a><div className="profile-topics"><small>持续关注</small><div>{tags.slice(0,5).map(tag => <a href={`/tags/?name=${encodeURIComponent(tag)}`} key={tag}>{tag}</a>)}</div></div></div></aside>;
}
function NoteList({ items }: { items: BlogPost[] }) {
  return <div className="note-list">{items.map((post,i) => <Link className="note-row" href={`/post/${post.slug}/`} key={post.slug}>
    <div className={`note-cover ${post.categories.includes("优化研究") ? "cover-optimization" : "cover-agent"}`} aria-hidden="true"><span>{String(i+1).padStart(2,"0")}</span><div className="cover-glyph">{post.categories.includes("优化研究") ? <svg viewBox="0 0 160 130"><path d="m20 88 38-53 34 60 47-67M20 88l72 7 47-67M58 35l81-7" />{[[20,88],[58,35],[92,95],[139,28]].map(([x,y])=><circle key={x} cx={x} cy={y} r="7" />)}</svg> : <svg viewBox="0 0 160 130"><rect x="52" y="36" width="56" height="56" rx="17" /><path d="M66 56 56 64l10 8m28-16 10 8-10 8M85 52 75 78M80 14v22m0 56v24M28 64h24m56 0h24" /><circle cx="80" cy="12" r="4" /><circle cx="80" cy="119" r="4" /><circle cx="24" cy="64" r="4" /><circle cx="136" cy="64" r="4" /></svg>}</div><small>{post.categories.includes("优化研究") ? "OPTIMIZATION" : "AGENT ENGINEERING"}</small></div>
    <div className="note-content"><p className="note-meta">{post.category}<span>{post.date} · {post.read}</span></p><h3>{post.title}</h3><p className="note-excerpt">{post.excerpt}</p><span className="note-read">阅读笔记 <span>↗</span></span></div>
  </Link>)}{!items.length && <p className="empty">这个主题下还没有笔记。</p>}</div>;
}
function Article({ post }: { post: BlogPost }) {
  const body = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(post.toc[0]?.id || "");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const content = body.current;
      if (!content) return;
      const top = content.getBoundingClientRect().top + window.scrollY;
      const total = Math.max(1, content.offsetHeight - window.innerHeight + 160);
      const progress = Math.min(1, Math.max(0, (window.scrollY - top + 120) / total));
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      const current = post.toc.reduce((id, item) => {
        const heading = document.getElementById(item.id);
        return heading && heading.getBoundingClientRect().top <= 160 ? item.id : id;
      }, post.toc[0]?.id || "");
      setActiveId(current);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [post]);
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
  return <div className="article-layout"><div className="reading-progress" aria-hidden="true"><div ref={progressBar} /></div><article><div className="article-meta">{post.date} · {post.category} · {post.read}</div><p className="article-lead">{post.excerpt}</p><div className="markdown-body" ref={body} dangerouslySetInnerHTML={{ __html: post.html }} /><div className="tech-tags article-tags">{post.tags.map(tag => <a key={tag} href={`/tags/?name=${encodeURIComponent(tag)}`}>{tag}</a>)}</div><Link className="text-link" href="/archives/">← 所有项目与笔记</Link></article><aside className="article-toc"><p className="eyebrow">ON THIS PAGE</p><h2>目录</h2><nav aria-label="文章目录">{post.toc.map(item => <a className={activeId === item.id ? "active" : ""} aria-current={activeId === item.id ? "location" : undefined} key={item.id} style={{ paddingLeft: Math.max(0,item.level-2)*12 }} href={`#${item.id}`}>{item.title}</a>)}</nav></aside></div>;
}
