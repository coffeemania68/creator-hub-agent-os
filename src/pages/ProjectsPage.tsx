import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  FolderKanban,
  Search,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { agents, artifacts, projects, workflowRuns } from '../data/mockData';
import type { Project, ProjectStatus } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

const statusFilters: Array<'all' | ProjectStatus> = ['all', 'ideation', 'active', 'review', 'rendering', 'completed'];
const priorityFilters: Array<'all' | Project['priority']> = ['all', 'high', 'medium', 'low'];

const statusLabel: Record<ProjectStatus, string> = {
  ideation: 'Ideation',
  active: 'Active',
  review: 'Review',
  rendering: 'Rendering',
  completed: 'Completed',
};

const statusTone: Record<ProjectStatus, 'active' | 'muted' | 'danger'> = {
  ideation: 'muted',
  active: 'active',
  review: 'danger',
  rendering: 'active',
  completed: 'muted',
};

export function ProjectsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProjectStatus>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | Project['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleProjects = useMemo(
    () =>
      projects.filter((project) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
        const matchesPriority = selectedPriority === 'all' || project.priority === selectedPriority;
        const matchesSearch =
          query.length === 0 ||
          [project.name, project.shortName, project.domain, project.description, project.nextAction, ...project.channels]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query));

        return matchesStatus && matchesPriority && matchesSearch;
      }),
    [searchQuery, selectedPriority, selectedStatus],
  );

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-4">
          <ProjectToolbar
            searchQuery={searchQuery}
            selectedPriority={selectedPriority}
            selectedStatus={selectedStatus}
            onPriorityChange={setSelectedPriority}
            onSearchChange={setSearchQuery}
            onStatusChange={setSelectedStatus}
          />

          <section className="grid gap-4 lg:grid-cols-2">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        </main>

        <ProjectsSidebar visibleProjects={visibleProjects} />
      </div>
    </div>
  );
}

function ProjectToolbar({
  searchQuery,
  selectedPriority,
  selectedStatus,
  onPriorityChange,
  onSearchChange,
  onStatusChange,
}: {
  searchQuery: string;
  selectedPriority: 'all' | Project['priority'];
  selectedStatus: 'all' | ProjectStatus;
  onPriorityChange: (value: 'all' | Project['priority']) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | ProjectStatus) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Project Portfolio</p>
          <h2 className="mt-1 text-xl font-black text-ink">MVP production lines</h2>
        </div>
        <Badge tone="muted">Mock project board</Badge>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-line/70 bg-surface-low px-3 py-2.5">
          <Search className="shrink-0 text-ink-soft" size={18} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-soft"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects, domains, next actions"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((status) => (
            <FilterChip key={status} active={selectedStatus === status} onClick={() => onStatusChange(status)}>
              {status === 'all' ? 'All' : statusLabel[status]}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {priorityFilters.map((priority) => (
          <FilterChip key={priority} active={selectedPriority === priority} onClick={() => onPriorityChange(priority)}>
            {priority === 'all' ? 'All Priorities' : priority}
          </FilterChip>
        ))}
      </div>
    </Card>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const projectAgents = agents.filter((agent) => project.activeAgentIds.includes(agent.id));
  const projectArtifacts = artifacts.filter((artifact) => artifact.projectId === project.id);
  const workflow = workflowRuns.find((item) => item.projectId === project.id);
  const completedStages = workflow?.stages.filter((stage) => stage.status === 'done').length ?? 0;
  const stageCount = workflow?.stages.length ?? 1;

  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className={`relative h-24 overflow-hidden bg-gradient-to-br ${project.visualTheme}`}>
        <div className="absolute inset-0 opacity-55 [background:radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.5),transparent_24%),radial-gradient(circle_at_76%_76%,rgba(45,212,191,0.38),transparent_25%)]" />
        <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
          {project.shortName}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-ink">{project.name}</h3>
            <p className="mt-1 line-clamp-1 text-sm font-semibold text-ink-muted">{project.domain}</p>
          </div>
          <Badge tone={statusTone[project.status]}>{statusLabel[project.status]}</Badge>
        </div>

        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-ink-muted">{project.nextAction}</p>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-ink-muted">
            <span>{project.currentStage}</span>
            <span>{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} tone={project.status === 'review' ? 'danger' : 'primary'} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MetaTile label="Agents" value={projectAgents.length.toString().padStart(2, '0')} />
          <MetaTile label="Artifacts" value={projectArtifacts.length.toString().padStart(2, '0')} />
          <MetaTile label="Stages" value={`${completedStages}/${stageCount}`} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 gap-1.5 overflow-hidden">
            {project.channels.slice(0, 3).map((channel) => (
              <span key={channel} className="shrink-0 rounded-full border border-line/70 bg-white px-2 py-1 text-[10px] font-bold text-ink-muted">
                {channel}
              </span>
            ))}
          </div>
          <button className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs font-black text-ink-muted">
            Open
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}

function ProjectsSidebar({ visibleProjects }: { visibleProjects: Project[] }) {
  const highPriority = projects.filter((project) => project.priority === 'high').length;
  const activeProjects = projects.filter((project) => project.status === 'active' || project.status === 'rendering').length;

  return (
    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Portfolio Status</p>
            <h2 className="mt-1 text-xl font-black text-ink">{visibleProjects.length} projects</h2>
          </div>
          <FolderKanban className="text-primary" size={22} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SummaryTile label="Active" value={activeProjects.toString().padStart(2, '0')} icon={Sparkles} />
          <SummaryTile label="High" value={highPriority.toString().padStart(2, '0')} icon={CheckCircle2} />
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Recent Updates</p>
        <div className="mt-3 space-y-2">
          {[...projects]
            .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
            .map((project) => (
              <div key={project.id} className="rounded-2xl bg-surface-low p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black text-ink">{project.shortName}</p>
                  <Badge tone={statusTone[project.status]}>{statusLabel[project.status]}</Badge>
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-ink-soft">{project.nextAction}</p>
              </div>
            ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Project Boundary</p>
        <p className="mt-3 rounded-2xl bg-surface-low p-3 text-sm leading-6 text-ink-muted">
          프로젝트 카드는 mock portfolio 현황만 표시하며 실제 생성, 삭제, 배포 기능은 실행하지 않습니다.
        </p>
      </Card>
    </aside>
  );
}

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className={`focus-ring shrink-0 rounded-full border px-3 py-1.5 text-xs font-black transition ${
        active ? 'border-primary bg-primary text-white' : 'border-line/70 bg-white text-ink-muted hover:border-primary/40 hover:bg-primary-soft hover:text-primary'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-low p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      <p className="mt-1 text-lg font-black text-primary">{value}</p>
    </div>
  );
}

function SummaryTile({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Boxes }) {
  return (
    <div className="rounded-2xl bg-surface-low p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-ink-soft">{label}</p>
        <Icon className="text-primary" size={15} />
      </div>
      <p className="mt-2 text-2xl font-black text-primary">{value}</p>
    </div>
  );
}
