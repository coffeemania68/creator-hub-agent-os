import {
  CheckCircle2,
  FileText,
  Image,
  MessageSquareText,
  Mic,
  MoreVertical,
  Play,
  RadioTower,
  Send,
  Table2,
  Video,
} from 'lucide-react';
import {
  agentQueue,
  agents,
  artifacts,
  connections,
  dashboardMetrics,
  projects,
  workflowRuns,
} from '../data/mockData';
import type { Artifact, ArtifactType, Project, ProjectStatus } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

const projectVisualClasses: Record<Project['id'], string> = {
  wisdom: 'from-teal-950 via-primary to-primary-action',
  chic40: 'from-emerald-900 via-teal-700 to-cyan-300',
  contest: 'from-teal-950 via-primary to-emerald-500',
  stickerlab: 'from-emerald-900 via-teal-600 to-accent-peach',
};

const statusLabel: Record<ProjectStatus, string> = {
  ideation: 'Ideation',
  active: 'Active',
  review: 'In Review',
  rendering: 'Rendering',
  completed: 'Completed',
};

const artifactIcon: Record<ArtifactType, typeof FileText> = {
  script: FileText,
  'shorts-script': MessageSquareText,
  'blog-draft': FileText,
  'substack-draft': FileText,
  'naver-blog-draft': FileText,
  'thumbnail-concept': Image,
  'image-prompt': Image,
  'generated-image': Image,
  'video-prompt': Video,
  'generated-video': Play,
  'upload-metadata': RadioTower,
  'affiliate-copy': MessageSquareText,
  'contest-proposal': FileText,
  'portfolio-draft': Table2,
};

export function DashboardPage() {
  const featuredProject = projects.find((project) => project.id === 'wisdom') ?? projects[0];
  const secondaryProjects = projects.filter((project) => project.id !== featuredProject.id);
  const featuredWorkflow = workflowRuns.find((workflow) => workflow.projectId === featuredProject.id);

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <FeaturedProjectCard project={featuredProject} stages={featuredWorkflow?.stages.slice(3, 5) ?? []} />
            <div className="grid gap-3 md:grid-cols-3 xl:col-span-12">
              {secondaryProjects.map((project) => (
                <CompactProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <RecentArtifactsPanel artifacts={artifacts.slice(0, 4)} />
            <MemoPanel />
          </section>
        </div>

        <aside className="space-y-4">
          <ApprovalPanel />
          <WorkflowPanel />
          <ConnectionPanel />
          <RecentMediaPanel />
          <QuickCommandPanel />
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: (typeof dashboardMetrics)[number] }) {
  const isAccent = metric.tone === 'accent';

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-ink-muted">{metric.label}</p>
          <p className={`mt-2 text-2xl font-semibold ${isAccent ? 'text-accent' : 'text-primary'}`}>{metric.value}</p>
        </div>
        {metric.trend ? (
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${isAccent ? 'bg-accent-soft text-accent' : 'bg-primary-soft text-primary'}`}>
            {metric.trend}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

function FeaturedProjectCard({ project, stages }: { project: Project; stages: Array<{ id: string; label: string; status: string; progress?: number }> }) {
  return (
    <Card className="overflow-hidden xl:col-span-12">
      <div className="grid min-h-[250px] lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1fr)]">
        <ProductionVisual project={project} large />
        <div className="flex flex-col justify-between p-5">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <Badge>{statusLabel[project.status]}</Badge>
              <span className="text-sm font-bold text-primary">실시간 렌더링 중</span>
            </div>
            <h2 className="text-3xl font-semibold text-ink">{project.shortName}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">{project.description}. {project.progress}% 공정 완료.</p>
          </div>

          <div className="mt-5 space-y-4">
            <StageProgress icon="video" label={stages[0]?.label ?? 'Script'} value={project.progress} />
            <StageProgress icon="mic" label={stages[1]?.label ?? 'Voiceover'} value={100} />
            <div className="flex gap-2">
              <button className="focus-ring flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90">프로젝트 관리</button>
              <button className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white text-ink-muted">
                <MoreVertical size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StageProgress({ icon, label, value }: { icon: 'video' | 'mic'; label: string; value: number }) {
  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-low text-primary">
        {icon === 'video' ? <Video size={18} /> : <Mic size={18} />}
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs font-semibold text-ink-muted">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
        <ProgressBar value={value} />
      </div>
    </div>
  );
}

function CompactProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden">
      <ProductionVisual project={project} />
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="truncate text-lg font-semibold text-ink">{project.shortName}</h3>
          <Badge tone={project.priority === 'high' ? 'active' : 'muted'}>{statusLabel[project.status]}</Badge>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-ink-muted">{project.nextAction}</p>
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-bold text-ink-muted">
            <span>{project.currentStage}</span>
            <span>{project.progress}% 진행됨</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>
      </div>
    </Card>
  );
}

function ProductionVisual({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${projectVisualClasses[project.id]} ${large ? 'min-h-[250px]' : 'h-36'}`}>
      <div className="absolute inset-0 opacity-55 [background:radial-gradient(circle_at_30%_30%,rgba(125,255,233,0.55),transparent_24%),radial-gradient(circle_at_78%_70%,rgba(243,199,173,0.35),transparent_22%)]" />
      <div className="absolute left-[44%] top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[42%] border border-white/25 bg-white/10 blur-[1px]" />
      <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">{project.shortName}</div>
    </div>
  );
}

function RecentArtifactsPanel({ artifacts: recentArtifacts }: { artifacts: Artifact[] }) {
  return (
    <Card className="p-5">
      <SectionTitle title="최근 산출물 프리뷰" action="전체보기" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {recentArtifacts.map((artifact) => {
          const Icon = artifactIcon[artifact.type];
          return (
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-line/70 bg-gradient-to-br from-teal-900 via-primary to-primary-action text-white" key={artifact.id}>
              <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_25%,rgba(125,255,233,0.7),transparent_25%),radial-gradient(circle_at_70%_70%,rgba(243,199,173,0.32),transparent_24%)]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-75">
                <Icon size={18} />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-teal-950/90 to-transparent p-2 pt-8">
                <p className="line-clamp-2 text-[10px] font-bold leading-4 text-white">{artifact.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MemoPanel() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-ink">아이디어 메모장</h2>
        <span className="text-[10px] font-semibold text-ink-soft">자동 저장됨</span>
      </div>
      <div className="mt-4 rounded-2xl border border-line/70 bg-surface-low p-4 text-sm leading-7 text-ink-muted">
        <p>시크40 여름 쇼츠 아이디어...</p>
        <p>공모전 영상 장면 메모...</p>
      </div>
    </Card>
  );
}

function ApprovalPanel() {
  return (
    <Card className="p-4">
      <SectionTitle title="승인 대기" badge="02건" />
      <div className="mt-3 rounded-2xl border border-line/70 bg-surface-low p-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-200 to-primary-action" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">시크40 썸네일 A</p>
            <p className="text-xs text-ink-soft">5분 전 생성됨</p>
          </div>
          <CheckCircle2 className="text-primary" size={18} />
        </div>
      </div>
    </Card>
  );
}

function WorkflowPanel() {
  return (
    <Card className="p-4">
      <SectionTitle title="워크플로우 상태" />
      <div className="mt-3 space-y-3">
        {agentQueue.slice(0, 2).map((item) => {
          const project = projects.find((entry) => entry.id === item.projectId);
          const agent = agents.find((entry) => entry.id === item.agentId);
          return (
            <div className="rounded-2xl border border-line/70 bg-surface-low p-3" key={item.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{project?.shortName} - {item.artifactType}</p>
                  <p className="truncate text-xs text-ink-soft">{agent?.name}</p>
                </div>
                <span className="rounded-full bg-primary-soft px-2 py-1 text-[10px] font-bold text-primary">{item.status}</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={item.status === 'running' ? 72 : 16} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ConnectionPanel() {
  return (
    <Card className="p-4">
      <SectionTitle title="AI 연결 현황" />
      <div className="mt-3 flex flex-wrap gap-2">
        {connections.slice(0, 6).map((connection) => (
          <span className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-white px-3 py-1.5 text-xs font-bold text-ink-muted" key={connection.id}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary-action" />
            {connection.provider}
          </span>
        ))}
      </div>
    </Card>
  );
}

function RecentMediaPanel() {
  return (
    <Card className="p-4">
      <SectionTitle title="최근 미디어" action="모두보기" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {projects.slice(0, 3).map((project) => (
          <ProductionVisual key={project.id} project={project} />
        ))}
      </div>
    </Card>
  );
}

function QuickCommandPanel() {
  const displayPrompts = ['시크40 여름 쇼츠 5개 만들어줘', '지혜샘 최신 댓글 분석 리포트 생성'];

  return (
    <Card className="border-primary/20 bg-primary-soft p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">PM Quick Command</p>
      <div className="mt-3 space-y-2">
        {displayPrompts.map((prompt) => (
          <button className="block text-left text-xs font-semibold italic leading-5 text-primary hover:text-accent" key={prompt}>
            "{prompt}"
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line/70 bg-white p-2">
        <span className="min-w-0 flex-1 px-2 text-sm text-ink-soft">명령어 입력...</span>
        <button className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white hover:bg-accent">
          <Send size={17} />
        </button>
      </div>
    </Card>
  );
}

function SectionTitle({ title, action, badge }: { title: string; action?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {badge ? <span className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-bold text-accent">{badge}</span> : null}
      {action ? <button className="text-xs font-bold text-primary">{action}</button> : null}
    </div>
  );
}
