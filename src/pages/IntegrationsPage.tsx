import { CheckCircle2, CircleDashed, Cloud, GitBranch, Link2, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react';
import { integrationServices } from '../data/mockData';
import type { IntegrationService, IntegrationStatus } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const statusLabel: Record<IntegrationStatus, string> = {
  mock: 'Mock',
  pending: 'Pending',
  connected: 'Connected',
  blocked: 'Blocked',
};

const statusTone: Record<IntegrationStatus, 'active' | 'muted' | 'danger'> = {
  mock: 'muted',
  pending: 'muted',
  connected: 'active',
  blocked: 'danger',
};

const statusIcon: Record<IntegrationStatus, typeof CheckCircle2> = {
  mock: CircleDashed,
  pending: Link2,
  connected: CheckCircle2,
  blocked: TriangleAlert,
};

const providerInitial: Record<IntegrationService['provider'], string> = {
  GitHub: 'GH',
  'Cloudflare Pages': 'CP',
  'Cloudflare Workers': 'CW',
  'OpenAI / ChatGPT MCP': 'MCP',
  Perplexity: 'PX',
  'Codex / GitHub Issues': 'CI',
  Google: 'G',
  Notion: 'N',
};

export function IntegrationsPage() {
  const connectedCount = integrationServices.filter((service) => service.status === 'connected').length;
  const backendOnlyCount = integrationServices.filter((service) => service.connectionType !== 'Future Connector').length;

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Integration Status</p>
                <h2 className="mt-1 text-xl font-black text-ink">MCP-ready connection board</h2>
              </div>
              <Badge tone="muted">Backend only</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatusMetric label="Services" value={integrationServices.length.toString().padStart(2, '0')} icon={Cloud} />
              <StatusMetric label="Connected" value={connectedCount.toString().padStart(2, '0')} icon={ShieldCheck} />
              <StatusMetric label="Backend" value={backendOnlyCount.toString().padStart(2, '0')} icon={LockKeyhole} />
            </div>
          </Card>

          <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {integrationServices.map((service) => (
              <IntegrationCard key={service.id} service={service} />
            ))}
          </section>
        </main>

        <IntegrationBoundary />
      </div>
    </div>
  );
}

function IntegrationCard({ service }: { service: IntegrationService }) {
  const StatusIcon = statusIcon[service.status];

  return (
    <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-black text-primary">
            {providerInitial[service.provider]}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-ink">{service.provider}</h2>
            <p className="mt-1 text-xs font-bold text-ink-soft">{service.connectionType}</p>
          </div>
        </div>
        <Badge tone={statusTone[service.status]}>{statusLabel[service.status]}</Badge>
      </div>

      <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-ink-muted">{service.usageLabel}</p>

      <div className="mt-4 rounded-2xl bg-surface-low p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-ink-soft">
          <GitBranch size={14} />
          Handoff
        </div>
        <p className="text-sm font-bold text-ink">{service.handoff}</p>
      </div>

      <div className="mt-4 flex min-w-0 items-center gap-2 text-xs font-semibold text-ink-soft">
        <StatusIcon className="shrink-0 text-primary" size={16} />
        <span className="truncate">{service.note}</span>
      </div>
    </Card>
  );
}

function IntegrationBoundary() {
  return (
    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Secret Boundary</p>
            <h2 className="mt-1 text-lg font-black text-ink">Secrets are backend-only</h2>
          </div>
          <LockKeyhole className="text-primary" size={22} />
        </div>

        <div className="mt-4 space-y-3">
          <BoundaryRow title="Frontend" body="Shows connection status only. No API key or OAuth secret inputs." />
          <BoundaryRow title="MCP / Backend" body="Future provider calls, tokens, and approvals live outside the browser." />
          <BoundaryRow title="GitHub" body="Tasks can become Issues after user approval in a later phase." />
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Runtime Flow</p>
        <div className="mt-3 space-y-2 text-sm font-bold text-ink-muted">
          <p>ChatGPT</p>
          <p>MCP / Backend</p>
          <p>Creator Hub Task</p>
          <p>GitHub Issue</p>
          <p>User Approval</p>
        </div>
      </Card>
    </aside>
  );
}

function StatusMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Cloud }) {
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

function BoundaryRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-surface-low p-3">
      <p className="text-sm font-black text-ink">{title}</p>
      <p className="mt-1 text-xs leading-5 text-ink-muted">{body}</p>
    </div>
  );
}
