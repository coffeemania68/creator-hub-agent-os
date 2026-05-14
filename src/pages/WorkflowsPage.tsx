import {
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  GitBranch,
  Image,
  Play,
  RadioTower,
  RotateCcw,
  Sparkles,
  Video,
} from 'lucide-react';
import { agentQueue, agents, projects, workflowRuns } from '../data/mockData';
import type { Project, WorkflowRun, WorkflowStageId } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

type PipelineStatus = 'waiting' | 'running' | 'review' | 'completed';

type PipelineStep = {
  id: WorkflowStageId;
  label: string;
  status: PipelineStatus;
  agentId?: string;
  progress: number;
};

const pipelineStages: Array<{ id: WorkflowStageId; label: string; icon: typeof FileText }> = [
  { id: 'brief', label: 'Brief', icon: FileText },
  { id: 'research', label: 'Research', icon: Sparkles },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'image', label: 'Visual', icon: Image },
  { id: 'video', label: 'Render', icon: Video },
  { id: 'publish', label: 'Publish', icon: RadioTower },
];

const statusLabel: Record<PipelineStatus, string> = {
  waiting: 'Waiting',
  running: 'Running',
  review: 'Review',
  completed: 'Completed',
};

const statusTone: Record<PipelineStatus, 'active' | 'muted' | 'danger'> = {
  waiting: 'muted',
  running: 'active',
  review: 'danger',
  completed: 'active',
};

const statusIcon: Record<PipelineStatus, typeof Circle> = {
  waiting: Circle,
  running: Play,
  review: RotateCcw,
  completed: CheckCircle2,
};

export function WorkflowsPage() {
  const runningCount = workflowRuns.filter((workflow) =>
    workflow.stages.some((stage) => stage.status === 'running'),
  ).length;
  const reviewCount = projects.filter((project) => project.status === 'review').length;

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Workflow Map</p>
                <h2 className="mt-1 text-xl font-black text-ink">Production chain overview</h2>
              </div>
              <Badge tone="muted">Mock pipeline</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryMetric label="Chains" value={workflowRuns.length.toString().padStart(2, '0')} icon={GitBranch} />
              <SummaryMetric label="Running" value={runningCount.toString().padStart(2, '0')} icon={Play} />
              <SummaryMetric label="Review" value={reviewCount.toString().padStart(2, '0')} icon={RotateCcw} />
            </div>
          </Card>

          <section className="space-y-4">
            {workflowRuns.map((workflow) => {
              const project = projects.find((item) => item.id === workflow.projectId);
              return project ? <WorkflowChainCard key={workflow.id} workflow={workflow} project={project} /> : null;
            })}
          </section>
        </main>

        <WorkflowSidebar />
      </div>
    </div>
  );
}

function WorkflowChainCard({ workflow, project }: { workflow: WorkflowRun; project: Project }) {
  const steps = buildPipelineSteps(workflow, project);
  const completedCount = steps.filter((step) => step.status === 'completed').length;
  const activeStep = steps.find((step) => step.status === 'running' || step.status === 'review') ?? steps[completedCount - 1] ?? steps[0];
  const completion = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/40 p-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">{project.shortName}</p>
          <h2 className="mt-1 truncate text-lg font-black text-ink">{workflow.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={statusTone[activeStep.status]}>{statusLabel[activeStep.status]}</Badge>
          <span className="text-xs font-bold text-ink-soft">{completion}%</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-3 lg:grid-cols-6">
          {steps.map((step, index) => (
            <WorkflowStepCard key={step.id} step={step} isLast={index === steps.length - 1} />
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-ink-muted">
            <span>{activeStep.label}</span>
            <span>{project.updatedAt.slice(11, 16)}</span>
          </div>
          <ProgressBar value={Math.max(completion, project.progress)} tone={activeStep.status === 'review' ? 'danger' : 'primary'} />
        </div>
      </div>
    </Card>
  );
}

function WorkflowStepCard({ step, isLast }: { step: PipelineStep; isLast: boolean }) {
  const stage = pipelineStages.find((item) => item.id === step.id) ?? pipelineStages[0];
  const Icon = stage.icon;
  const StatusIcon = statusIcon[step.status];
  const agent = agents.find((item) => item.id === step.agentId);

  return (
    <div className="relative">
      {!isLast ? <div className="absolute left-10 top-6 hidden h-px w-[calc(100%_-_1rem)] bg-line/70 lg:block" /> : null}
      <div className="relative rounded-2xl border border-line/70 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Icon size={18} />
          </div>
          <StatusIcon className={step.status === 'waiting' ? 'text-ink-soft' : 'text-primary'} size={16} />
        </div>
        <p className="mt-3 text-sm font-black text-ink">{stage.label}</p>
        <p className="mt-1 truncate text-xs font-semibold text-ink-soft">{agent?.name ?? 'Unassigned'}</p>
        <div className="mt-3">
          <ProgressBar value={step.progress} tone={step.status === 'review' ? 'danger' : 'primary'} />
        </div>
      </div>
    </div>
  );
}

function WorkflowSidebar() {
  return (
    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Execution Timeline</p>
            <h2 className="mt-1 text-lg font-black text-ink">Mock queue signals</h2>
          </div>
          <Clock3 className="text-primary" size={22} />
        </div>

        <div className="mt-4 space-y-3">
          {agentQueue.map((item) => {
            const project = projects.find((entry) => entry.id === item.projectId);
            const agent = agents.find((entry) => entry.id === item.agentId);
            return (
              <div key={item.id} className="rounded-2xl bg-surface-low p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black text-ink">{project?.shortName} · {item.artifactType}</p>
                  <Badge tone={item.status === 'running' ? 'active' : item.status === 'review' ? 'danger' : 'muted'}>{item.status}</Badge>
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-ink-soft">{agent?.name ?? 'Agent'} · {item.eta}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Workflow Boundary</p>
        <div className="mt-3 space-y-3 text-sm leading-6 text-ink-muted">
          <p className="rounded-2xl bg-surface-low p-3">작업 흐름은 mock 상태로만 표시됩니다.</p>
          <p className="rounded-2xl bg-surface-low p-3">실제 queue, automation engine, agent orchestration은 연결하지 않습니다.</p>
        </div>
      </Card>
    </aside>
  );
}

function SummaryMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof GitBranch }) {
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

function buildPipelineSteps(workflow: WorkflowRun, project: Project): PipelineStep[] {
  return pipelineStages.map((stage) => {
    const sourceStage = workflow.stages.find((item) => item.id === stage.id);
    const status = mapWorkflowStatus(sourceStage?.status ?? 'idle', stage.id, project);
    return {
      id: stage.id,
      label: stage.label,
      status,
      agentId: sourceStage?.agentId,
      progress: status === 'completed' ? 100 : status === 'running' ? sourceStage?.progress ?? 68 : status === 'review' ? 82 : 12,
    };
  });
}

function mapWorkflowStatus(status: WorkflowRun['stages'][number]['status'], stageId: WorkflowStageId, project: Project): PipelineStatus {
  if (project.status === 'review' && (stageId === 'image' || stageId === 'video')) {
    return 'review';
  }

  if (status === 'done') {
    return 'completed';
  }

  if (status === 'running') {
    return 'running';
  }

  return 'waiting';
}
