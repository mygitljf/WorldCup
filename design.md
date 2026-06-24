# 2026 世界杯买球模拟器设计文档

> 当前文档用于方案审核，不代表已经开始实现。产品定位为“虚拟资金预测/赔率模拟器”，不接入真实金钱、不提供充值提现、不承诺奖品收益。

## 1. 产品定位

### 1.1 一句话说明

每个用户在 2026 世界杯开始前获得 1000 美元虚拟本金，按实时或准实时赔率进行虚拟投注，系统在比赛结束后自动结算，最终用排行榜展示谁的虚拟收益最高。

### 1.2 核心目标

- 提供娱乐性质的世界杯预测游戏，不做真实博彩平台。
- 支持用户注册/登录、虚拟资金账户、投注记录、赛程赔率展示、自动结算和排行榜。
- 用单台服务器完成 MVP 部署，降低运维复杂度。
- 把赔率、赛程、赛果接入做成可替换 Provider，方便从 mock 数据切换到付费 API。
- 开源时具备可本地运行、可演示、可二次开发的项目质感，争取 GitHub stars。

### 1.3 非目标

- 不支持真实充值、提现、法币/加密货币支付。
- 不提供可兑换现金或实物的奖励。
- 不抓取受保护的博彩网站页面，不绕过 API 授权或条款限制。
- MVP 不做 Kubernetes、多机高可用、多地区部署。
- MVP 不做复杂博彩盘口全覆盖，先以胜平负 1X2 和冠军/小组出线等少量市场为主。

## 2. 合规与免责声明

### 2.1 产品边界

- 所有金额均为虚拟记账单位，仅用于游戏排名。
- 用户初始资金固定为 1000 虚拟美元，不能购买、转让或提现。
- 页面显著位置展示“仅供娱乐，不构成博彩、投资或财务建议”。
- 项目不得暗示与 FIFA、世界杯官方、博彩公司存在合作关系，除非未来获得明确授权。
- 若上线公开站点，发布前需要根据目标地区做一次法律审核。

### 2.2 赔率数据边界

- 不应对外宣称“官方 FIFA 赔率”。赔率本质上是博彩公司或交易市场给出的价格，不是 FIFA 直接发布的统一赔率。
- FIFA 2026 官方博彩数据分发权属于 Stats Perform/Opta/RunningBall 这类授权数据商，主要面向持牌 sportsbook 的事件、统计、结算和 in-play 数据，不等同于免费公开赔率 feed。
- MVP 使用 mock provider 或合法 API provider，生产环境只接入有授权、允许展示和缓存的赔率 API。
- 赔率快照只用于模拟投注，用户下单时绑定当时快照，不因后续赔率变化修改历史投注。

## 3. 推荐技术栈

### 3.1 MVP 推荐栈

| 层级 | 选择 | 理由 |
| --- | --- | --- |
| Web 框架 | Next.js + TypeScript | 一个仓库同时覆盖前端页面、服务端 API、SSR/SEO 和部署产物，适合单机 MVP。 |
| UI | Tailwind CSS + shadcn/ui 风格组件 | 开发快、组件一致性高、适合做漂亮的排行榜和比赛卡片。 |
| 数据库 | PostgreSQL | 虚拟资金账本、投注、赔率快照、结算都需要强事务和可审计记录。 |
| ORM | Drizzle ORM | 类型安全、迁移清晰、SQL 可控，适合资金账本类业务。 |
| 校验 | Zod | API 入参、Provider 响应和前后端表单共用 schema。 |
| 后台任务 | pg-boss 或 graphile-worker | 复用 PostgreSQL 做队列，避免 MVP 额外引入 Redis。 |
| 认证 | Auth.js 或 Lucia/Auth.js 替代方案 | 支持邮箱、GitHub OAuth，方便开源项目演示和真实登录。 |
| 部署 | Docker Compose + Caddy | 单台 VPS 上部署 web、worker、postgres、反向代理和自动 HTTPS。 |
| 监控 | Pino 日志 + healthcheck + 可选 Grafana/Prometheus/Loki | MVP 先保证可观测，后续再扩展完整监控栈。 |
| 测试 | Vitest + Playwright | 单元测试覆盖账本/结算，端到端测试覆盖用户下单与排行榜。 |

### 3.2 为什么不是更重的架构

- Kubernetes、微服务、独立队列集群对 MVP 运维成本过高。
- SQLite 不适合高并发虚拟资金扣减和后台结算事务。
- Redis 可以后置，等出现高频实时榜单、WebSocket 或多实例部署需求再引入。
- 赔率同步、赛果同步、结算任务用 worker 进程即可，不需要一开始拆成多个服务。

### 3.3 单台服务器部署拓扑

```text
Internet
  |
Caddy / HTTPS / gzip / rate limit
  |
Next.js Web App  ---- PostgreSQL
  |                     |
Worker Process --------+
  |
Odds/Fixture/Result Provider APIs
```

Docker Compose 服务建议：

- `web`: Next.js 应用，提供页面和 API。
- `worker`: 后台任务进程，负责同步赔率、同步赛果、结算、排行榜刷新。
- `postgres`: 主数据库，持久化业务数据和任务队列。
- `caddy`: 反向代理、自动 TLS、静态压缩。
- `backup`: 定时 `pg_dump`，推送到对象存储或服务器外部位置。

公开入口建议：

- GitHub README 顶部放 `Live Demo` 链接，用户点击即可进入线上服务。
- 生产环境推荐使用域名加 HTTPS，例如 `https://worldcup.example.com`，不要长期使用裸 `IP:端口` 作为公开入口。
- 裸 `IP:端口` 可以用于内测，但对 OAuth 回调、cookie、安全提示、分享传播和搜索收录都不友好。
- Caddy 监听 80/443，对外提供 HTTPS，对内反向代理到 `web:3000`。
- README 同时保留本地启动入口：`docker compose up`，方便开发者一键自部署。

### 3.4 赔率与赛果 Provider 策略

Provider 必须做成接口层，避免业务代码绑定某一家数据商。

优先级建议：

1. `MockProvider`: 本地开发和 demo 使用，内置 2026 世界杯样例赛程、赔率、赛果。
2. `AggregatorProvider`: 生产 MVP 使用合法赔率聚合 API，例如 The Odds API、Sportmonks、SportsDataIO 或覆盖 World Cup 2026 的同类付费体育数据 API。
3. `OfficialLicensedProvider`: 如果未来能采购 Stats Perform/Opta/RunningBall 等官方授权数据，再新增适配器；页面仍应把赔率标为“市场赔率/博彩公司赔率”，不要标成“FIFA 官方赔率”。

Provider 接口至少返回：

- 赛程：比赛 ID、队伍、开球时间、阶段、场馆、状态。
- 赔率：市场、选项、十进制赔率、博彩公司、采集时间、是否可投注。
- 赛果：比分、比赛状态、胜平负结果、加时/点球信息。
- 元数据：provider cursor、rate limit、最后成功同步时间、错误原因。

推荐同步频率：

- 赛程：赛前每天或每小时同步；临近比赛日提高到 30 分钟一次。
- 赛前赔率：普通时段 15-60 分钟一次，临近开球 1-5 分钟一次。
- 赛果：比赛进行中 10-30 秒一次，终场后延迟 1-5 分钟再结算。
- MVP 暂不做 in-play 即时投注，降低数据授权、风控和结算复杂度。

## 4. MVP 功能范围

### 4.1 用户侧

- 注册/登录。
- 查看自己的虚拟余额、总投注、已结算盈亏、未结算风险敞口。
- 查看赛程、比赛详情、赔率变化和可投注选项。
- 使用虚拟资金下注，下注后不可撤销。
- 查看投注历史、结算结果和排行榜。
- 使用 GitHub 账号验证 star 后领取一次额外 1000 虚拟美元启动资金。
- 查看当前获利最高 15 人，以及这些用户公开的历史买入/投注操作。

### 4.2 管理侧

- 查看数据源健康状态和最近同步时间。
- 手动触发赛程、赔率、赛果同步。
- 锁定/解锁比赛投注。
- 修正比赛结果并触发重新结算。
- 查看用户、投注、账本、任务和审计日志。

### 4.3 后续版本

- 私人联赛/好友房间。
- 更多市场：大小球、让球、冠军、金靴、晋级等。
- 赔率走势图、CLV、命中率、ROI 等分析指标。
- WebSocket 实时推送赔率和排行榜。
- PWA、移动端优化、多语言。
- 公开只读 API 和可嵌入 widgets。

## 5. 核心领域模型

### 5.1 表结构草案

| 模型 | 关键字段 | 说明 |
| --- | --- | --- |
| `users` | `id`, `name`, `email`, `role`, `github_login`, `created_at` | 用户基础信息，`role` 区分普通用户和管理员；公开榜单优先展示昵称或 GitHub login。 |
| `github_star_bonus_claims` | `id`, `user_id`, `github_user_id`, `repo`, `status`, `verified_at`, `created_at` | GitHub star 奖励领取记录，确保每个用户/每个 GitHub 账号只能领一次。 |
| `bankroll_ledger_entries` | `id`, `user_id`, `type`, `amount_cents`, `balance_after_cents`, `ref_type`, `ref_id`, `created_at` | 虚拟资金账本，只追加记录。 |
| `teams` | `id`, `provider_id`, `name`, `country_code`, `group` | 球队信息。 |
| `matches` | `id`, `provider_id`, `home_team_id`, `away_team_id`, `kickoff_at`, `stage`, `status`, `score` | 赛程和赛果主表。 |
| `markets` | `id`, `match_id`, `type`, `status`, `lock_at` | 单场比赛下的盘口市场，例如 1X2。 |
| `outcomes` | `id`, `market_id`, `type`, `label` | 市场选项，例如主胜、平、客胜。 |
| `odds_snapshots` | `id`, `outcome_id`, `provider`, `bookmaker`, `decimal_odds`, `captured_at`, `is_active` | 不可变赔率快照，下注绑定快照。 |
| `bets` | `id`, `user_id`, `odds_snapshot_id`, `stake_cents`, `potential_payout_cents`, `status`, `placed_at`, `settled_at` | 用户投注单。 |
| `settlements` | `id`, `bet_id`, `result`, `payout_cents`, `job_run_id`, `created_at` | 结算记录，保证幂等。 |
| `leaderboard_snapshots` | `id`, `scope`, `ranked_at`, `payload` | 排行榜快照，减少实时聚合压力。 |
| `provider_cursors` | `id`, `provider`, `resource`, `cursor`, `last_success_at` | 外部同步游标和状态。 |
| `job_runs` | `id`, `job_name`, `status`, `started_at`, `finished_at`, `error` | 后台任务执行记录。 |
| `audit_logs` | `id`, `actor_id`, `action`, `target_type`, `target_id`, `metadata`, `created_at` | 管理员操作和关键业务事件审计。 |

### 5.2 资金账本规则

- 用户首次注册后写入一笔 `INITIAL_GRANT`，金额为 `100000` cents，对应 1000 虚拟美元。
- 用户完成 GitHub star 验证后写入一笔 `GITHUB_STAR_BONUS`，金额为 `100000` cents，对应额外 1000 虚拟美元。
- `GITHUB_STAR_BONUS` 是一次性额外本金，不计入获利；排行榜按投注盈亏排序，而不是按总赠金排序。
- 可用余额不直接手写覆盖，来源于账本流水和投注状态。
- 下单时写入 `BET_STAKE` 负向流水。
- 赢单时写入 `BET_PAYOUT` 正向流水，金额为本金乘以下注时锁定的十进制赔率。
- 输单无派奖流水；走水/取消写入 `BET_REFUND`。
- 管理员修正只能写补偿流水，不能删除历史流水。

### 5.3 投注生命周期

```text
draft -> placed -> settled_win
               -> settled_loss
               -> voided
               -> cancelled_by_admin
```

下注事务必须一次性完成：

1. 校验用户存在且未被禁用。
2. 校验比赛和市场未锁定，当前时间早于 `lock_at`。
3. 校验赔率快照仍可投注。
4. 校验下注金额大于最小值且不超过可用余额。
5. 创建投注单并写入负向账本流水。
6. 返回投注单和新的余额。

### 5.4 结算规则

- 结算任务按比赛维度执行，并使用数据库事务和唯一约束保证幂等。
- 每个 bet 最多有一条有效 settlement。
- 结算时使用下注绑定的 `odds_snapshot.decimal_odds`，不使用当前最新赔率。
- 结果修正时，不删除旧记录，而是创建修正事件和补偿账本流水。
- 排行榜按 `当前余额 - 所有赠金本金 + 未结算投注估值策略` 或已实现盈亏排序，平分时按命中率、下注次数、最早达到排名时间做确定性排序。

### 5.5 GitHub star 奖励规则

- 用户需要使用 GitHub 登录或绑定 GitHub 账号后才能领取 star bonus。
- 系统使用 GitHub REST API `GET /user/starred/{owner}/{repo}` 验证当前登录 GitHub 用户是否已 star 项目仓库；`204` 表示已 star，`404` 表示未 star。
- 系统只检查 star 状态，不替用户自动执行 star；用户必须自己在 GitHub 页面完成 star。
- OAuth/GitHub App 权限使用最小化策略，能读当前用户身份和 star 状态即可；不要申请仓库写权限，除非未来明确要做更复杂的 GitHub 集成。
- 验证通过后发放一次 `GITHUB_STAR_BONUS` 账本流水。
- 同一应用用户、同一 GitHub 用户、同一仓库只能领取一次。
- 用户之后取消 star，不回收已经发放的虚拟本金，但可以在前端提示“感谢支持，取消 star 不影响已领取虚拟资金”。
- 如果 GitHub API 暂时不可用，领取按钮显示“稍后重试”，不能绕过验证直接发放。
- Star 奖励文案必须透明：这是虚拟游戏内奖励，不是金钱、奖品或投资收益。
- 不要写“强制 star 才能玩”；更好的文案是“Star 项目可领取额外虚拟本金，支持开源项目”。

## 6. 后台任务设计

| 任务 | 触发方式 | 频率建议 | 幂等策略 | 失败处理 |
| --- | --- | --- | --- | --- |
| `sync-fixtures` | 定时 + 管理员手动 | 每 6 小时，比赛日每 30 分钟 | 按 provider match ID upsert | 记录错误，保留旧赛程。 |
| `sync-odds` | 定时 | 非比赛日 5-10 分钟，比赛日 60-120 秒 | 赔率快照只追加，重复快照去重 | 供应商失败时暂停对应市场新下注。 |
| `sync-results` | 定时 | 比赛进行中 30-60 秒，赛后 5 分钟 | 按 match ID upsert 状态和比分 | 结果不完整则不触发结算。 |
| `settle-match` | 赛果变为 final 后 | 即时 | `bet_id` 唯一结算约束 | 失败可重试，不重复派奖。 |
| `refresh-leaderboard` | 定时 + 结算后 | 1-5 分钟 | 按 scope 和时间生成快照 | 失败时继续展示上一版榜单。 |
| `reconcile-ledger` | 定时 | 每天 | 重算账本和投注状态差异 | 生成告警，不自动改账。 |
| `backup-database` | 定时 | 每天，淘汰赛可加密增量 | 备份文件带时间戳 | 失败告警，保留上一份备份。 |

## 7. API 与页面设计

### 7.1 用户页面

- `/`: 项目介绍、当前世界杯进度、排行榜预览、免责声明。
- `/matches`: 赛程列表，按日期、阶段、球队筛选。
- `/matches/[id]`: 比赛详情、赔率、投注入口、历史赔率变化。
- `/dashboard`: 用户余额、盈亏、未结算投注、最近结算。
- `/bets`: 投注历史和筛选。
- `/leaderboard`: 当前获利最高 Top 15，总榜默认按净利润排序。
- `/users/[publicHandle]`: Top 15 用户公开资料页，展示排名、当前净利润、命中率、历史买入/投注操作。
- `/rewards/github-star`: GitHub star 验证和额外 1000 虚拟美元领取页。

### 7.2 管理页面

- `/admin`: 管理总览。
- `/admin/providers`: 数据源健康状态、rate limit、最近同步错误。
- `/admin/matches`: 赛程和结果管理。
- `/admin/bets`: 投注查询和异常排查。
- `/admin/jobs`: 后台任务执行记录和重试入口。
- `/admin/audit`: 管理操作审计。

### 7.3 API 草案

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/matches` | 赛程列表。 |
| `GET` | `/api/matches/:id` | 比赛详情、市场、最新可投注赔率。 |
| `POST` | `/api/bets` | 创建投注单。 |
| `GET` | `/api/me` | 当前用户资料和余额。 |
| `GET` | `/api/me/bets` | 当前用户投注历史。 |
| `GET` | `/api/leaderboard?limit=15` | 当前获利最高 15 人。 |
| `GET` | `/api/users/:publicHandle/history` | 榜单用户公开历史买入/投注操作。 |
| `POST` | `/api/rewards/github-star/claim` | 验证 GitHub star 并领取一次额外虚拟本金。 |
| `POST` | `/api/admin/jobs/:name/run` | 管理员手动触发任务。 |
| `PATCH` | `/api/admin/matches/:id` | 管理员修正比赛信息。 |
| `POST` | `/api/admin/matches/:id/settle` | 管理员触发或重跑结算。 |
| `GET` | `/api/health` | 存活检查。 |
| `GET` | `/api/ready` | 数据库和关键依赖就绪检查。 |

### 7.4 下单 API 关键返回

`POST /api/bets` 请求字段：

- `oddsSnapshotId`: 选择的赔率快照。
- `stakeCents`: 下注金额，整数 cents。
- `idempotencyKey`: 客户端生成，防止重复提交。

成功返回：

- `betId`
- `stakeCents`
- `decimalOdds`
- `potentialPayoutCents`
- `newBalanceCents`
- `status`

## 8. 可观测性与运维

### 8.1 必备指标

- 赔率同步最近成功时间。
- 数据源 API 错误率和 rate-limit 次数。
- 待结算投注数量。
- 结算任务成功/失败次数。
- 用户下单成功率、余额不足失败次数、市场锁定失败次数。
- 数据库连接数、慢查询、磁盘空间。

### 8.2 日志要求

- 使用结构化 JSON 日志。
- 每个请求带 `requestId`。
- 每次后台任务带 `jobRunId`。
- 每次投注、结算、管理员修正都写审计日志。
- 不记录密码、token、完整 OAuth payload 等敏感信息。

### 8.3 备份与恢复

- 每天自动 `pg_dump`。
- 备份加密后上传到服务器外位置。
- 每周做一次恢复演练，至少验证 schema、账本、投注、结算数据可读。
- 重大比赛日前手动创建恢复点。

## 9. 安全设计

### 9.1 认证与权限

- 普通用户只能访问自己的投注、余额和个人统计。
- 管理员接口必须做 RBAC 校验。
- 管理员建议启用强密码和 MFA。
- 所有状态变更接口做 CSRF 防护或使用同站点 cookie 策略。
- 登录、下注、管理接口做 IP + 用户维度限流。
- GitHub OAuth token 不写入日志；如需持久化，必须加密存储并限制用途。

### 9.2 业务安全

- 下单接口使用事务和行级锁，防止余额并发扣成负数。
- 使用 `idempotencyKey` 防重复下单。
- 比赛锁盘时间由服务端判断，不能信任客户端时间。
- 赔率快照不可变，结算只读取历史快照。
- 管理员修正必须写审计日志，并记录修正前后差异。
- GitHub star 奖励接口必须幂等，不能重复发放 `GITHUB_STAR_BONUS`。
- Top 15 用户历史只展示公开字段：昵称、比赛、市场、选项、下注金额、锁定赔率、结算结果、时间；不展示邮箱、IP、OAuth token、内部用户 ID。
- 公开历史接口做分页、缓存和限流，避免被批量抓取用户隐私或拖垮数据库。

### 9.3 部署安全

- `.env` 不提交仓库，提供 `.env.example`。
- 数据库端口只暴露给 Docker 内网。
- Caddy 强制 HTTPS。
- 设置安全响应头：CSP、HSTS、X-Frame-Options、Referrer-Policy。
- 定期更新依赖并开启 GitHub Dependabot。

## 10. 测试策略

### 10.1 单元测试

- 初始赠金：新用户只有一笔 1000 虚拟美元入账。
- Star 奖励：同一用户完成 GitHub star 验证后只增加一次 1000 虚拟美元。
- 下注扣款：余额足够时扣款成功，余额不足时失败。
- 赔率锁定：投注收益按下单快照计算。
- 结算幂等：同一投注重复结算不会重复派奖。
- 排行榜排序：Top 15 按净利润排序，赠金本金不计入获利，盈亏相同时 tie-breaker 稳定。

### 10.2 集成测试

- Provider adapter 能把外部赛程、赔率、赛果转换为内部模型。
- `POST /api/bets` 在并发请求下不会透支余额。
- `settle-match` 能正确处理赢、输、取消、走水。
- 管理员修正赛果后能生成补偿流水。
- `POST /api/rewards/github-star/claim` 在 GitHub 返回 `204` 时发放一次奖励，在返回 `404`、`401`、`403` 或超时时不发放奖励。
- `POST /api/rewards/github-star/claim` 在重复请求和并发请求下不会重复发放奖励。
- 公开历史接口只返回脱敏字段。

### 10.3 端到端测试

- 用户注册后看到 1000 虚拟美元。
- 用户完成 GitHub star 验证后看到额外 1000 虚拟美元。
- 用户进入比赛详情页并成功下注。
- 余额不足时下注失败并显示明确错误。
- 比赛锁盘后不能下注。
- 赛果同步后投注自动结算，排行榜更新。
- 首页和 README `Live Demo` 入口能进入线上服务。
- `/leaderboard` 只展示当前获利最高 15 人，并能进入公开历史页。
- 非管理员不能访问 `/admin`。

## 11. 开源与 stars 策略

### 11.1 能不能圈 stars

可以，但要靠“好玩 + 好跑 + 好展示”，不是只靠题材。世界杯题材天然有时效流量，项目如果在开赛前就具备可演示 demo、漂亮截图、模拟数据和清晰路线图，有机会获得 stars。

### 11.2 开源包装清单

- README 顶部放产品截图、`Live Demo` 入口、免责声明和一键启动命令。
- 提供 mock 赛程、mock 赔率和 seed 用户，让任何人本地 2 分钟跑起来。
- 增加架构图、数据流图、投注结算流程图。
- 提供 `docker compose up` 本地启动路径。
- 提供 `.env.example` 和 provider adapter 开发说明。
- 使用 MIT 或 Apache-2.0 许可证，具体由项目所有者决定。
- 建立 Roadmap、Contributing、Issue templates、good first issue。
- 做一个公开 demo 站，只展示虚拟模拟，不引导真实博彩。
- README 明确线上入口和本地自部署入口：普通用户点 `Live Demo` 直接玩，开发者用 `docker compose up` 本地跑。

### 11.3 传播点

- “Build your own World Cup prediction market simulator”。
- “No real-money gambling, just virtual bankroll and odds analytics”。
- “PostgreSQL-backed ledger and idempotent settlement design”。
- “Mock provider included, plug in your own sports data API”。

## 12. MVP 里程碑

### M0：项目骨架

- Next.js、TypeScript、Tailwind、数据库、Docker Compose。
- 基础 README、免责声明、mock provider。

### M1：账户与账本

- 登录注册。
- 初始 1000 虚拟美元。
- 账本模型和余额展示。

### M2：赛程与赔率

- mock 赛程导入。
- 比赛列表和详情页。
- 赔率快照展示。

### M3：下注与结算

- 创建投注单。
- 锁盘逻辑。
- 自动结算和投注历史。

### M4：排行榜与管理端

- 当前获利 Top 15 排行榜快照。
- Top 15 用户公开历史买入/投注记录。
- GitHub star 额外 1000 虚拟美元奖励。
- 管理后台。
- 数据源状态、任务重试、审计日志。

### M5：生产部署

- Caddy HTTPS。
- 数据库备份。
- healthcheck、日志、基础监控。
- 真实 Provider 接入前的合规和授权确认。

## 13. 待你审核的问题

1. 目标用户是熟人小圈子、公开社区，还是公司/社群内部活动？
2. 是否允许设置任何奖品？如果有，需要重新做合规评估。
3. 登录方式用邮箱密码、GitHub OAuth，还是邀请码？
4. 赔率供应商是否有预算？如果没有，MVP 默认只做 mock provider。
5. 是否要支持中文为主，还是中英双语？
6. 开源许可证倾向 MIT 还是 Apache-2.0？
7. 排行榜按最终余额、净利润、ROI，还是多指标并列展示？

## 14. 审核通过后的实现原则

- 先写账本和结算测试，再实现业务逻辑。
- 每个资金相关状态变化都必须可审计。
- 先完成 mock provider，再接真实数据源。
- 先单机稳定运行，再考虑扩展。
- 不实现任何真实博彩、支付、提现或奖品兑换逻辑。
