import { Bell, CheckCircle2, Gauge, MonitorCog, PanelsTopLeft, SlidersHorizontal } from 'lucide-react';
import { projects } from '../data/mockData';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const settingGroups = [
  {
    title: 'Workspace',
    icon: PanelsTopLeft,
    items: [
      { label: 'Workspace name', value: 'Creator Hub Agent OS' },
      { label: 'Default project', value: projects[0].name },
      { label: 'Approval mode', value: 'User approval required' },
    ],
  },
  {
    title: 'Display',
    icon: MonitorCog,
    items: [
      { label: 'Theme', value: 'System default' },
      { label: 'Density', value: 'Compact operations' },
      { label: 'Sidebar', value: 'Grouped navigation' },
    ],
  },
  {
    title: 'Operations',
    icon: Bell,
    items: [
      { label: 'Notifications', value: 'Approval-first summary' },
      { label: 'Daily brief', value: 'Mock digest only' },
      { label: 'Runtime mode', value: 'MCP-ready' },
    ],
  },
];

export function SettingsPage() {
  return (
    <div className="w-full bg-surface-base">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 pb-28 sm:px-5 lg:px-6 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">System Preferences</p>
                <h2 className="mt-1 text-xl font-black text-ink">Workspace operating settings</h2>
              </div>
              <Badge tone="muted">Mock settings</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatusMetric label="Workspace" value="OS" icon={PanelsTopLeft} />
              <StatusMetric label="Approval" value="On" icon={CheckCircle2} />
              <StatusMetric label="Runtime" value="MCP" icon={Gauge} />
            </div>
          </Card>

          <section className="grid gap-3 lg:grid-cols-3">
            {settingGroups.map((group) => (
              <SettingsGroup key={group.title} group={group} />
            ))}
          </section>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Runtime Mode</p>
                <h2 className="mt-1 text-lg font-black text-ink">Mock to MCP-ready</h2>
              </div>
              <SlidersHorizontal className="text-primary" size={22} />
            </div>
            <div className="mt-4 space-y-3">
              <ModeRow label="Mock" active />
              <ModeRow label="MCP-ready" active />
              <ModeRow label="Production" />
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">Boundary</p>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Settings controls app behavior and display only. External providers, secrets, and API credentials belong in Integrations through a future backend boundary.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SettingsGroup({ group }: { group: (typeof settingGroups)[number] }) {
  const Icon = group.icon;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon size={20} />
        </div>
        <h2 className="text-lg font-black text-ink">{group.title}</h2>
      </div>
      <div className="space-y-3">
        {group.items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-surface-low p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-ink-soft">{item.label}</p>
            <p className="mt-1 text-sm font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatusMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof PanelsTopLeft }) {
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

function ModeRow({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-low p-3">
      <span className="text-sm font-bold text-ink">{label}</span>
      <Badge tone={active ? 'active' : 'muted'}>{active ? 'Ready' : 'Planned'}</Badge>
    </div>
  );
}
