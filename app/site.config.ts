export const site = {
  name: "吴廷颖", englishName: "Tingying Wu",
  title: "吴廷颖 · AI 应用与优化研究",
  description: "厦门大学控制工程硕士在读，关注大模型应用、智能体工程与组合优化。记录项目、研究与工程实践。",
  url: "https://honesty0119.github.io", github: "https://github.com/honesty0119", email: "wutingying129@gmail.com",
  role: "大模型应用 · Agent 工程 · 组合优化",
  education: [
    { school: "厦门大学", degree: "控制工程 · 硕士在读", period: "2024.09 — 2027.06（预计）", detail: "研究方向：组合优化与机器学习" },
    { school: "东莞理工学院", degree: "电子信息工程 · 本科", period: "2019.09 — 2023.06", detail: "全国大学生机器人竞赛 ROBOCON 三等奖 · 全国数学竞赛三等奖 · 一等奖学金" },
  ],
  projects: [
    { id: "agent-runtime", number: "01", category: "AGENT ENGINEERING", title: "Minimal Agent Runtime", subtitle: "从执行循环，到可追踪的智能体服务。", description: "独立开发轻量级智能体运行框架，串联模型决策、工具调用与结果回填，支持流式输出、多会话隔离和 Trace 追踪。", tags: ["Python", "FastAPI", "Tool Calling", "SQLite"], period: "2026.06", href: "/post/minimal-agent-runtime/", github: "https://github.com/honesty0119/Agent_design", visual: "agent" },
    { id: "vehicle-uav", number: "02", category: "OPTIMIZATION RESEARCH", title: "车机协同巡检与能源调度", subtitle: "把路径、任务与补能，放进同一个模型。", description: "研究单车搭载双无人机的协同巡检，使用 MILP 与能源感知启发式算法，联合考虑任务分配、同步时序和有限充电资源。", tags: ["MILP", "组合优化", "能源调度", "启发式算法"], period: "2026.04 — 2026.09", href: "/post/vehicle-uav-coordination/", github: "", visual: "route" },
  ],
  experience: [
    { slug: "quanju-dtp", company: "厦门圈巨网络科技有限公司", role: "AI Coding / FDE 实习生", period: "2026.06 — 2026.08", domain: "DTP 业务本体与数据平台", points: ["参与销售与运营系统重构，梳理线索、客户跟进、商机、订单和支付的业务规则。", "优化六页经营看板，完善订单镜像、跨对象审计与双渠道支付测试链路。", "将领域规则与研发规范封装为 Agent Skills，支持代码互审与研发决策治理。"], tags: ["经营看板", "Agent Skills", "业务系统集成"] },
    { slug: "jinmen-finance", company: "深圳进门财经科技股份有限公司", role: "数据分析实习生", period: "2024.04 — 2024.06", domain: "金融智能问答系统", points: ["参与金融知识库建设，处理监管文件、研报与产品说明书，设计混合检索及重排序流程。", "基于 Schema 注入、Few-shot Prompt、SQL 校验和执行反馈构建 Text2SQL 链路。", "设计意图识别与查询路由，在 RAG、结构化查询与缓存之间选择处理路径。"], tags: ["RAG", "BM25 / BGE", "查询路由"] },
  ],
  skills: [
    { title: "大模型应用", items: "RAG · Text2SQL · Function Calling · Agent 工具路由" },
    { title: "工程开发", items: "Python · FastAPI · MySQL · REST API · Git" },
    { title: "优化研究", items: "混合整数线性规划 · 任务调度 · 能源感知启发式" },
  ],
};
