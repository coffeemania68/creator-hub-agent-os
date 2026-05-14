import { ArrowRight, Layers3 } from 'lucide-react';
import type { AppRoute } from '../app/routes';
import { agents, artifacts, projects, workflowRuns } from '../data/mockData';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

type EmptyPageProps = {
  route: AppRoute;
};

export function EmptyPage({ route }: EmptyPageProps) {
  const Icon = route.icon;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="min-h-[320px] p-6 sm:p-8">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Icon size={24} strokeWidth={2.2} />
            </div>
            <Badge>{route.phase}</Badge>
            <Badge tone="muted">Empty route</Badge>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">{route.eyebrow}</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">{route.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">{route.description}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <FoundationMetric label="Projects" value={projects.length.toString().padStart(2, '0')} />
            <FoundationMetric label="Agents" value={agents.length.toString().padStart(2, '0')} />
            <FoundationMetric label="Artifacts" value={artifacts.length.toString().padStart(2, '0')} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">Foundation</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">Phase 1 Scope</h2>
            </div>
            <Layers3 className="text-primary" size={22} />
          </div>

          <div className="space-y-3 text-sm text-ink-muted">
            <ReadinessItem label="AppShell" />
            <ReadinessItem label="Sidebar / TopBar / MobileBottomNav" />
            <ReadinessItem label="Theme tokens and layout grid" />
            <ReadinessItem label="Routes with placeholder pages" />
            <ReadinessItem label="Mock data skeleton only" />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{project.shortName}</p>
                <h3 className="mt-1 text-base font-semibold text-ink">{project.domain}</h3>
              </div>
              <Badge tone="muted">{project.currentStage}</Badge>
            </div>
            <p className="line-clamp-3 text-sm leading-6 text-ink-muted">{project.description}</p>
            <div className="mt-5 flex items-center justify-between text-xs font-semibold text-ink-soft">
              <span>{project.progress}% ready</span>
              <ArrowRight size={16} />
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold text-ink">Agent Skeleton</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {agents.slice(0, 6).map((agent) => (
              <div key={agent.id} className="rounded-xl border border-line/70 bg-surface-low p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{agent.name}</p>
                  <Badge tone={agent.status === 'always-on' ? 'active' : 'muted'}>{agent.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-muted">{agent.role}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold text-ink">Workflow Skeleton</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {workflowRuns[0].stages.map((stage) => (
              <div key={stage.id} className="rounded-xl border border-line/70 bg-white px-3 py-2 text-center">
                <p className="text-xs font-semibold text-ink">{stage.label}</p>
                <p className="mt-1 text-[11px] text-ink-soft">{stage.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function FoundationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-surface-low p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}

function ReadinessItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-surface-low px-3 py-2.5">
      <span className="h-2 w-2 rounded-full bg-primary-action shadow-[0_0_0_4px_rgba(45,212,191,0.14)]" />
      <span>{label}</span>
    </div>
  );
}
