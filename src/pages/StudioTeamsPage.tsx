import {
  Bot,
  Clapperboard,
  Megaphone,
  Palette,
  PenLine,
  Shirt,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { studioAgents } from '../data/mockData';
import type { StudioAgentProfile, StudioTeamId } from '../types/creatorHub';

const teamLabels: Record<StudioTeamId, string> = {
  strategy: 'Strategy Team',
  content: 'Content Team',
  visual: 'Visual Team',
  operations: 'Operation Team',
  commerce: 'Commerce Team',
};

const productionTeamOrder: StudioTeamId[] = ['content', 'visual', 'commerce', 'operations'];

const agentIcons: Record<string, typeof Bot> = {
  'studio-pm-supervisor': Sparkles,
  'studio-script-agent': PenLine,
  'studio-visual-agent': Palette,
  'studio-remotion-agent': Clapperboard,
  'studio-publish-agent': Megaphone,
  'studio-contest-agent': Trophy,
  'studio-fashion-agent': Shirt,
  'studio-sticker-agent': Bot,
};

const statusLabel: Record<StudioAgentProfile['status'], string> = {
  'always-on': 'Always On',
  working: 'Working',
  idle: 'Idle',
  queued: 'Queued',
  'action-needed': 'Needs Review',
};

const statusTone: Record<StudioAgentProfile['status'], 'active' | 'muted' | 'danger'> = {
  'always-on': 'active',
  working: 'active',
  idle: 'muted',
  queued: 'muted',
  'action-needed': 'danger',
};

const pmCapability = '작업을 분석하고 알맞은 AI 직원에게 배정합니다.';

function AgentCard({ agent }: { agent: StudioAgentProfile }) {
  const Icon = agentIcons[agent.id] ?? Bot;

  return (
    <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon size={21} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-ink">{agent.name}</h3>
            <p className="mt-1 text-sm font-semibold text-ink-muted">{agent.role}</p>
          </div>
        </div>
        <Badge tone={statusTone[agent.status]}>{statusLabel[agent.status]}</Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full border border-line/70 bg-surface-low px-2.5 py-1 text-[11px] font-black text-primary">
          {teamLabels[agent.teamId]}
        </span>
      </div>

    </Card>
  );
}

function TeamSection({ teamId }: { teamId: StudioTeamId }) {
  const teamAgents = studioAgents.filter((agent) => agent.teamId === teamId && agent.id !== 'studio-pm-supervisor');

  if (teamAgents.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">{teamLabels[teamId]}</p>
        </div>
        <span className="rounded-full border border-line/70 bg-white px-3 py-1 text-xs font-bold text-ink-muted">
          {teamAgents.length} agents
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {teamAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}

function PMSidebar() {
  const supervisor = studioAgents[0];

  return (
    <aside className="space-y-3 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">PM Supervisor</p>
            <h2 className="mt-2 text-xl font-black text-ink">{supervisor.name}</h2>
            <p className="mt-1 text-sm font-semibold text-ink-muted">{supervisor.role}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles size={23} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-surface-low p-3">
            <span className="text-sm font-bold text-ink-muted">Status</span>
            <Badge>{statusLabel[supervisor.status]}</Badge>
          </div>
          <div className="rounded-2xl bg-surface-low p-3">
            <p className="text-sm font-bold text-ink-muted">Team</p>
            <p className="mt-1 text-sm font-black text-ink">{teamLabels[supervisor.teamId]}</p>
          </div>
          <div className="rounded-2xl bg-surface-low p-3">
            <p className="text-sm font-bold text-ink-muted">Capability</p>
            <p className="mt-1 text-sm leading-6 text-ink">{pmCapability}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">PM Chat</p>
        <div className="mt-3 space-y-3">
          <div className="rounded-2xl bg-surface-low p-3 text-sm leading-6 text-ink-muted">
            지금은 Studio Teams 현황판입니다. 실제 작업 지시는 PM Workspace에서 이어집니다.
          </div>
          <div className="rounded-2xl border border-line/70 bg-white p-3 text-sm font-semibold text-ink">
            오늘 가동 가능한 에이전트만 보여줘
          </div>
        </div>
      </Card>
    </aside>
  );
}

export function StudioTeamsPage() {
  return (
    <div className="grid min-h-full w-full min-w-0 gap-4 bg-surface-base p-4 pb-24 md:p-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:pb-5">
      <main className="min-w-0 space-y-4">
        <div className="space-y-4">
          {productionTeamOrder.map((teamId) => (
            <TeamSection key={teamId} teamId={teamId} />
          ))}
        </div>
      </main>

      <PMSidebar />
    </div>
  );
}
