import {
  CheckCircle2,
  CircleDashed,
  Cloud,
  Code2,
  KeyRound,
  Link2,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Unplug,
} from 'lucide-react';
import { integrationServices } from '../data/mockData';
import type { IntegrationService, IntegrationStatus } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const statusLabel: Record<IntegrationStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  'needs-setup': 'Needs Setup',
  'mock-mode': 'Mock Mode',
};

const statusTone: Record<IntegrationStatus, 'active' | 'muted' | 'danger'> = {
  connected: 'active',
  disconnected: 'muted',
  'needs-setup': 'danger',
  'mock-mode': 'muted',
};

const statusIcon: Record<IntegrationStatus, typeof CheckCircle2> = {
  connected: CheckCircle2,
  disconnected: Unplug,
  'needs-setup': Settings2,
  'mock-mode': CircleDashed,
};

const providerInitial: Record<IntegrationService['provider'], string> = {
  Google: 'G',
  OpenAI: 'AI',
  Perplexity: 'PX',
  Claude: 'CL',
  YouTube: 'YT',
  Naver: 'N',
};

const envGroups = [
  ['OPENAI_API_KEY', 'PERPLEXITY_API_KEY', 'ANTHROPIC_API_KEY'],
  ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET'],
  ['NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET'],
];

export function IntegrationsPage() {
  const connectedCount = integrationServices.filter((service) => service.status === 'connected').length;
  const setupCount = integrationServices.filter((service) => service.status === 'needs-setup').length;

  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Integration Readiness</p>
                <h2 className="mt-1 text-xl font-black text-ink">Mock connection setup</h2>
              </div>
              <Badge tone="muted">No live auth</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatusMetric label="Services" value={integrationServices.length.toString().padStart(2, '0')} icon={Cloud} />
              <StatusMetric label="Connected" value={connectedCount.toString().padStart(2, '0')} icon={ShieldCheck} />
              <StatusMetric label="Needs Setup" value={setupCount.toString().padStart(2, '0')} icon={KeyRound} />
            </div>
          </Card>

          <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {integrationServices.map((service) => (
              <IntegrationCard key={service.id} service={service} />
            ))}
          </section>
        </main>

        <SettingsSidebar />
      </div>
    </div>
  );
}

function IntegrationCard({ service }: { service: IntegrationService }) {
  const StatusIcon = statusIcon[service.status];
  const isConnected = service.status === 'connected';

  return (
    <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-black text-primary">
            {providerInitial[service.provider]}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-ink">{service.provider}</h2>
            <p className="mt-1 text-xs font-bold text-ink-soft">{service.authType}</p>
          </div>
        </div>
        <Badge tone={statusTone[service.status]}>{statusLabel[service.status]}</Badge>
      </div>

      <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-ink-muted">{service.usageLabel}</p>

      <div className="mt-4 rounded-2xl bg-surface-low p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-ink-soft">
          <Code2 size={14} />
          Env Keys
        </div>
        <div className="flex flex-wrap gap-1.5">
          {service.envVars.map((envVar) => (
            <span key={envVar} className="rounded-full border border-line/70 bg-white px-2 py-1 text-[10px] font-bold text-ink-muted">
              {envVar}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-ink-soft">
          <StatusIcon className="shrink-0 text-primary" size={16} />
          <span className="truncate">{service.note}</span>
        </div>
        <button className={`focus-ring shrink-0 rounded-xl px-3 py-2 text-xs font-black ${isConnected ? 'border border-line bg-white text-ink-muted' : 'bg-primary text-white'}`}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </Card>
  );
}

function SettingsSidebar() {
  return (
    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Environment</p>
            <h2 className="mt-1 text-lg font-black text-ink">Required keys</h2>
          </div>
          <LockKeyhole className="text-primary" size={22} />
        </div>

        <div className="mt-4 space-y-3">
          {envGroups.map((group) => (
            <div key={group.join('-')} className="rounded-2xl bg-surface-low p-3">
              {group.map((envVar) => (
                <p key={envVar} className="py-0.5 text-xs font-bold text-ink-muted">
                  {envVar}=
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Auth Boundary</p>
        <div className="mt-3 space-y-3">
          <InfoRow icon={KeyRound} title="API Keys" body="Listed only for setup planning. Keys are not stored in the UI." />
          <InfoRow icon={Link2} title="OAuth" body="Client IDs are placeholders. No login or callback is executed." />
          <InfoRow icon={ShieldCheck} title="Mock Mode" body="Buttons only describe future connect and disconnect actions." />
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

function InfoRow({ icon: Icon, title, body }: { icon: typeof KeyRound; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-surface-low p-3">
      <div className="flex items-center gap-2">
        <Icon className="text-primary" size={16} />
        <p className="text-sm font-black text-ink">{title}</p>
      </div>
      <p className="mt-1 text-xs leading-5 text-ink-muted">{body}</p>
    </div>
  );
}
