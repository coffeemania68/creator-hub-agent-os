import { ClipboardList, FileText, MessageSquareText, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { agents, commandTemplates, projects } from '../data/mockData';
import type { CommandTemplate, CommandTemplateStatus, ProjectId } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const projectFilterOrder: Array<'all' | ProjectId> = ['all', 'wisdom', 'chic40', 'contest', 'stickerlab'];
const statusFilters: Array<'all' | CommandTemplateStatus> = ['all', 'ready', 'draft', 'review'];

const statusLabel: Record<CommandTemplateStatus, string> = {
  ready: 'Ready',
  draft: 'Draft',
  review: 'Review',
};

const statusTone: Record<CommandTemplateStatus, 'active' | 'muted' | 'danger'> = {
  ready: 'active',
  draft: 'muted',
  review: 'danger',
};

export function CommandTemplatesPage() {
  const [selectedProject, setSelectedProject] = useState<'all' | ProjectId>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | CommandTemplateStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleTemplates = useMemo(
    () =>
      commandTemplates.filter((template) => {
        const project = projects.find((item) => item.id === template.projectId);
        const agent = agents.find((item) => item.id === template.targetAgentId);
        const query = searchQuery.trim().toLowerCase();
        const matchesProject = selectedProject === 'all' || template.projectId === selectedProject;
        const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus;
        const matchesSearch =
          query.length === 0 ||
          [template.name, template.purpose, template.promptPreview, project?.name, project?.shortName, agent?.name, ...template.tags]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(query));

        return matchesProject && matchesStatus && matchesSearch;
      }),
    [searchQuery, selectedProject, selectedStatus],
  );

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 space-y-4">
          <CommandToolbar
            searchQuery={searchQuery}
            selectedProject={selectedProject}
            selectedStatus={selectedStatus}
            onProjectChange={setSelectedProject}
            onSearchChange={setSearchQuery}
            onStatusChange={setSelectedStatus}
          />

          <section className="space-y-4">
            {projectFilterOrder
              .filter((projectId): projectId is ProjectId => projectId !== 'all')
              .map((projectId) => {
                const projectTemplates = visibleTemplates.filter((template) => template.projectId === projectId);
                if (projectTemplates.length === 0) {
                  return null;
                }
                return <ProjectTemplateSection key={projectId} projectId={projectId} templates={projectTemplates} />;
              })}
          </section>
        </main>

        <CommandSidebar visibleTemplates={visibleTemplates} />
      </div>
    </div>
  );
}

function CommandToolbar({
  searchQuery,
  selectedProject,
  selectedStatus,
  onProjectChange,
  onSearchChange,
  onStatusChange,
}: {
  searchQuery: string;
  selectedProject: 'all' | ProjectId;
  selectedStatus: 'all' | CommandTemplateStatus;
  onProjectChange: (value: 'all' | ProjectId) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | CommandTemplateStatus) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Command Library</p>
          <h2 className="mt-1 text-xl font-black text-ink">PM command templates</h2>
        </div>
        <Badge tone="muted">Mock select only</Badge>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-line/70 bg-surface-low px-3 py-2.5">
          <Search className="shrink-0 text-ink-soft" size={18} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-soft"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search commands, projects, agents"
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
        {projectFilterOrder.map((projectId) => {
          const project = projectId === 'all' ? undefined : projects.find((item) => item.id === projectId);
          return (
            <FilterChip key={projectId} active={selectedProject === projectId} onClick={() => onProjectChange(projectId)}>
              {project?.shortName ?? 'All Projects'}
            </FilterChip>
          );
        })}
      </div>
    </Card>
  );
}

function ProjectTemplateSection({ projectId, templates }: { projectId: ProjectId; templates: CommandTemplate[] }) {
  const project = projects.find((item) => item.id === projectId);

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">{project?.name ?? projectId}</p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">{project?.domain}</p>
        </div>
        <span className="rounded-full border border-line/70 bg-white px-3 py-1 text-xs font-bold text-ink-muted">
          {templates.length} templates
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {templates.map((template) => (
          <CommandTemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
}

function CommandTemplateCard({ template }: { template: CommandTemplate }) {
  const project = projects.find((item) => item.id === template.projectId);
  const agent = agents.find((item) => item.id === template.targetAgentId);

  return (
    <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <ClipboardList size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-ink">{template.name}</h3>
            <p className="mt-1 text-xs font-bold text-ink-soft">{project?.shortName} · {agent?.name ?? 'PM'}</p>
          </div>
        </div>
        <Badge tone={statusTone[template.status]}>{statusLabel[template.status]}</Badge>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-ink-muted">{template.purpose}</p>

      <div className="mt-4 rounded-2xl bg-surface-low p-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-ink-soft">Prompt Preview</p>
        <p className="line-clamp-3 text-sm leading-6 text-ink">{template.promptPreview}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-line/70 bg-white px-2 py-1 text-[10px] font-bold text-ink-muted">
              {tag}
            </span>
          ))}
        </div>
        <button className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-black text-white">
          <MessageSquareText size={14} />
          Use in PM Workspace
        </button>
      </div>
    </Card>
  );
}

function CommandSidebar({ visibleTemplates }: { visibleTemplates: CommandTemplate[] }) {
  const readyCount = commandTemplates.filter((template) => template.status === 'ready').length;
  const reviewCount = commandTemplates.filter((template) => template.status === 'review').length;

  return (
    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Template Status</p>
            <h2 className="mt-1 text-xl font-black text-ink">{visibleTemplates.length} commands</h2>
          </div>
          <Sparkles className="text-primary" size={22} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SummaryTile label="Ready" value={readyCount.toString().padStart(2, '0')} />
          <SummaryTile label="Review" value={reviewCount.toString().padStart(2, '0')} />
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">PM Boundary</p>
        <div className="mt-3 space-y-3 text-sm leading-6 text-ink-muted">
          <p className="rounded-2xl bg-surface-low p-3">템플릿은 PM Workspace에서 자주 쓰는 지시문을 빠르게 찾기 위한 mock 라이브러리입니다.</p>
          <p className="rounded-2xl bg-surface-low p-3">Use in PM Workspace 버튼은 실제 실행, 복사, 저장, AI 호출을 수행하지 않습니다.</p>
        </div>
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

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-low p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-ink-soft">{label}</p>
        <FileText className="text-primary" size={15} />
      </div>
      <p className="mt-2 text-2xl font-black text-primary">{value}</p>
    </div>
  );
}
