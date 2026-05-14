import {
  Archive,
  CheckCircle2,
  Clock3,
  FileText,
  Image,
  MessageSquareText,
  Play,
  RadioTower,
  Search,
  Table2,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { agents, artifacts, projects } from '../data/mockData';
import type { Artifact, ArtifactStatus, ArtifactType, ProjectId } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const statusFilters: Array<'all' | ArtifactStatus> = ['all', 'draft', 'review', 'approved', 'archived'];

const statusLabel: Record<ArtifactStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  approved: 'Approved',
  archived: 'Archived',
};

const statusTone: Record<ArtifactStatus, 'active' | 'muted' | 'danger'> = {
  draft: 'muted',
  review: 'danger',
  approved: 'active',
  archived: 'muted',
};

const typeLabel: Record<ArtifactType, string> = {
  script: 'Script',
  'shorts-script': 'Script',
  'blog-draft': 'Blog Draft',
  'substack-draft': 'Substack Draft',
  'naver-blog-draft': 'Naver Blog Draft',
  'thumbnail-concept': 'Thumbnail',
  'image-prompt': 'Image Prompt',
  'generated-image': 'Thumbnail',
  'video-prompt': 'Render Plan',
  'generated-video': 'Render Plan',
  'upload-metadata': 'Upload Metadata',
  'affiliate-copy': 'Affiliate Copy',
  'contest-proposal': 'Contest Proposal',
  'portfolio-draft': 'Portfolio Draft',
};

const typeIcon: Record<ArtifactType, typeof FileText> = {
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

const projectFilterOrder: Array<'all' | ProjectId> = ['all', 'wisdom', 'chic40', 'contest', 'stickerlab'];

export function ArtifactsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | ArtifactStatus>('all');
  const [selectedProject, setSelectedProject] = useState<'all' | ProjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const visibleArtifacts = useMemo(
    () =>
      artifacts.filter((artifact) => {
        const project = projects.find((item) => item.id === artifact.projectId);
        const agent = agents.find((item) => item.id === artifact.agentId);
        const query = searchQuery.trim().toLowerCase();
        const matchesStatus = selectedStatus === 'all' || artifact.status === selectedStatus;
        const matchesProject = selectedProject === 'all' || artifact.projectId === selectedProject;
        const matchesSearch =
          query.length === 0 ||
          [artifact.title, typeLabel[artifact.type], project?.name, project?.shortName, agent?.name]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(query));

        return matchesStatus && matchesProject && matchesSearch;
      }),
    [searchQuery, selectedProject, selectedStatus],
  );

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 space-y-4">
          <LibraryToolbar
            searchQuery={searchQuery}
            selectedStatus={selectedStatus}
            selectedProject={selectedProject}
            onSearchChange={setSearchQuery}
            onStatusChange={setSelectedStatus}
            onProjectChange={setSelectedProject}
          />
          <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {visibleArtifacts.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </section>
        </main>

        <ArtifactsSidebar visibleArtifacts={visibleArtifacts} />
      </div>
    </div>
  );
}

function LibraryToolbar({
  searchQuery,
  selectedStatus,
  selectedProject,
  onSearchChange,
  onStatusChange,
  onProjectChange,
}: {
  searchQuery: string;
  selectedStatus: 'all' | ArtifactStatus;
  selectedProject: 'all' | ProjectId;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | ArtifactStatus) => void;
  onProjectChange: (value: 'all' | ProjectId) => void;
}) {
  return (
    <Card className="p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-line/70 bg-surface-low px-3 py-2.5">
          <Search className="shrink-0 text-ink-soft" size={18} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-soft"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search artifacts by title, project, type"
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

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const project = projects.find((item) => item.id === artifact.projectId);
  const agent = agents.find((item) => item.id === artifact.agentId);
  const Icon = typeIcon[artifact.type];

  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3 border-b border-line/40 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-extrabold text-ink">{artifact.title}</h2>
            <p className="mt-1 text-xs font-bold text-ink-soft">{project?.shortName ?? artifact.projectId}</p>
          </div>
        </div>
        <Badge tone={statusTone[artifact.status]}>{statusLabel[artifact.status]}</Badge>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <MetaPill label="Type" value={typeLabel[artifact.type]} />
          <MetaPill label="Version" value={artifact.version} />
        </div>

        <div className="rounded-2xl bg-surface-low p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-ink-soft">Created By</p>
          <p className="mt-1 truncate text-sm font-bold text-ink">{agent?.name ?? 'Unassigned'}</p>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-ink-soft">
          <span className="truncate">{formatUpdatedAt(artifact.updatedAt)}</span>
          <span className="truncate">{artifact.metadata.format ?? typeLabel[artifact.type]}</span>
        </div>
      </div>
    </Card>
  );
}

function ArtifactsSidebar({ visibleArtifacts }: { visibleArtifacts: Artifact[] }) {
  const reviewCount = artifacts.filter((artifact) => artifact.status === 'review').length;
  const approvedCount = artifacts.filter((artifact) => artifact.status === 'approved').length;
  const latestArtifacts = [...artifacts]
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
    .slice(0, 4);

  return (
    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Library Status</p>
            <h2 className="mt-1 text-xl font-black text-ink">{visibleArtifacts.length} artifacts</h2>
          </div>
          <Archive className="text-primary" size={23} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <SummaryTile label="Review" value={reviewCount.toString().padStart(2, '0')} icon={Clock3} />
          <SummaryTile label="Approved" value={approvedCount.toString().padStart(2, '0')} icon={CheckCircle2} />
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Recent Updates</p>
        <div className="mt-3 space-y-2">
          {latestArtifacts.map((artifact) => {
            const project = projects.find((item) => item.id === artifact.projectId);
            return (
              <div key={artifact.id} className="rounded-2xl border border-line/70 bg-surface-low p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-ink">{artifact.title}</p>
                  <Badge tone={statusTone[artifact.status]}>{statusLabel[artifact.status]}</Badge>
                </div>
                <p className="mt-1 text-xs font-semibold text-ink-soft">{project?.shortName} · {artifact.version}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring shrink-0 rounded-full border px-3 py-1.5 text-xs font-black transition ${
        active ? 'border-primary bg-primary text-white' : 'border-line/70 bg-white text-ink-muted hover:border-primary/40 hover:bg-primary-soft hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-low p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-ink-soft">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function SummaryTile({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Archive }) {
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

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
