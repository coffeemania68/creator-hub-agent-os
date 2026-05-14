import {
  Archive,
  CheckCircle2,
  Download,
  FileCheck2,
  Filter,
  History,
  Image,
  MessageSquareText,
  Paperclip,
  Palette,
  RefreshCw,
  Save,
  Send,
  Settings,
  Share2,
  Video,
} from 'lucide-react';
import {
  agents,
  approvalArtifact,
  artifacts,
  pmMessages,
  pmThreads,
  projects,
} from '../data/mockData';
import type { PMMessage, PMThread } from '../types/creatorHub';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

const commandChips = [
  { label: '쇼츠 만들기', icon: Video },
  { label: '이미지 생성', icon: Palette },
  { label: '영상 생성', icon: Image },
  { label: '공모전 기획', icon: Archive },
  { label: '대본 검수', icon: FileCheck2 },
];

export function PMWorkspacePage() {
  return (
    <div className="grid w-full min-w-0 bg-surface-low xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="flex min-w-0 flex-col border-r border-line/50 bg-white">
        <PMHeader />
        <ChatPanel />
        <ProjectThreads />
      </section>

      <ApprovalPanel />
    </div>
  );
}

function PMHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line/40 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <AgentAvatar label="PM" active />
        <div>
          <h2 className="text-sm font-bold text-ink">PM Supervisor</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary-action">Active production session</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-ink-muted">
        <button className="focus-ring rounded-xl p-2 hover:bg-surface-low hover:text-primary">
          <History size={19} />
        </button>
        <button className="focus-ring rounded-xl p-2 hover:bg-surface-low hover:text-primary">
          <Settings size={19} />
        </button>
      </div>
    </header>
  );
}

function ChatPanel() {
  return (
    <div className="flex min-h-[500px] flex-1 flex-col bg-surface-base">
      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-8 sm:px-8">
        {pmMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="border-t border-line/40 bg-white/88 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {commandChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full border border-line/70 bg-surface-highest px-4 py-2 text-sm font-semibold text-ink-muted transition hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                key={chip.label}
              >
                <Icon size={16} />
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-line/70 bg-surface-low p-3">
          <button className="focus-ring rounded-xl p-2 text-ink-muted hover:bg-white hover:text-primary">
            <Paperclip size={20} />
          </button>
          <textarea
            className="min-h-9 flex-1 resize-none border-none bg-transparent py-2 text-base text-ink outline-none placeholder:text-ink-soft"
            placeholder="명령어를 입력하세요..."
            rows={1}
          />
          <button className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lift hover:bg-primary/90">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: PMMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? <AgentAvatar label="PM" active /> : null}
      <div
        className={`max-w-[620px] rounded-3xl px-5 py-4 text-base leading-7 shadow-ambient ${
          isUser ? 'rounded-tr-sm bg-primary-action text-ink' : 'rounded-tl-sm border border-line/50 bg-white text-ink'
        }`}
      >
        <p>{message.body}</p>
        <p className={`mt-2 text-[10px] font-semibold ${isUser ? 'text-primary' : 'text-ink-soft'}`}>{message.createdAt}</p>
      </div>
    </div>
  );
}

function ProjectThreads() {
  return (
    <section className="border-t border-line/40 bg-white">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <h3 className="text-base font-bold text-ink">프로젝트 스레드</h3>
        <div className="flex items-center gap-3">
          <button className="text-sm font-bold text-primary">모두 보기</button>
          <Filter className="text-ink-soft" size={17} />
        </div>
      </div>

      <div className="hidden grid-cols-[1fr_1fr_140px_120px_90px] border-y border-line/40 bg-surface-low px-8 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft md:grid">
        <span>프로젝트</span>
        <span>최근 메시지</span>
        <span>에이전트</span>
        <span>진행률</span>
        <span>상태</span>
      </div>

      <div className="max-h-[360px] divide-y divide-line/40 overflow-y-auto">
        {pmThreads.map((thread) => (
          <ThreadRow key={thread.id} thread={thread} />
        ))}
      </div>
    </section>
  );
}

function ThreadRow({ thread }: { thread: PMThread }) {
  const project = projects.find((item) => item.id === thread.projectId);
  const agent = agents.find((item) => item.id === thread.agentId);
  const isActive = thread.status === 'processing';
  const progress = project?.progress ?? 20;

  return (
    <div className={`grid gap-3 px-4 py-4 sm:px-8 md:grid-cols-[1fr_1fr_140px_120px_90px] md:items-center ${isActive ? 'bg-primary-soft/50' : 'bg-white'}`}>
      <div className="flex min-w-0 items-center gap-3">
        <MiniPreview projectId={thread.projectId} />
        <div className="min-w-0">
          <p className={`truncate text-sm font-bold ${isActive ? 'text-primary' : 'text-ink'}`}>{project?.shortName}</p>
          <p className="text-[10px] text-ink-soft">{thread.updatedAt}</p>
        </div>
      </div>
      <p className="line-clamp-1 text-sm text-ink-muted">{thread.lastMessage}</p>
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <MessageSquareText className="text-primary" size={15} />
        {agent?.name ?? 'PM'}
      </div>
      <ProgressBar value={progress} tone={isActive ? 'primary' : 'secondary'} />
      <button className={`focus-ring rounded-xl px-3 py-1.5 text-sm font-bold ${isActive ? 'bg-primary text-white' : 'border border-line bg-white text-ink-muted'}`}>
        Open
      </button>
    </div>
  );
}

function ApprovalPanel() {
  const artifact = artifacts.find((item) => item.id === approvalArtifact.artifactId);
  const project = projects.find((item) => item.id === approvalArtifact.projectId);

  return (
    <aside className="flex min-h-0 flex-col bg-surface-base xl:h-[calc(100vh-73px)]">
      <div className="border-b border-line/40 px-5 py-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-ink">
          <FileCheck2 className="text-primary" size={20} />
          승인 대기 산출물
        </h3>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-ink-muted">{approvalArtifact.title}</p>
            <p className="mt-1 text-xs text-ink-soft">{project?.shortName} · {artifact?.version}</p>
          </div>
          <Badge>New</Badge>
        </div>

        <div className="relative h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-primary to-accent-peach shadow-ambient">
          <div className="absolute inset-0 opacity-55 [background:radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.54),transparent_24%),radial-gradient(circle_at_70%_70%,rgba(45,212,191,0.5),transparent_26%)]" />
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[42%] border border-white/35 bg-white/10" />
        </div>

        <blockquote className="rounded-2xl border-l-4 border-primary bg-primary-soft p-4 text-sm italic leading-6 text-ink">
          "{approvalArtifact.description}"
        </blockquote>

        <div>
          <p className="mb-2 text-sm font-bold text-ink-muted">수정 요청 메모 (선택)</p>
          <textarea
            className="min-h-24 w-full resize-none rounded-2xl border border-line/70 bg-surface-low p-4 text-sm outline-none placeholder:text-ink-soft focus:border-primary"
            placeholder={approvalArtifact.revisionPrompt}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="focus-ring flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-lift hover:bg-primary/90">
            <CheckCircle2 size={18} />
            승인하기
          </button>
          <button className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface-high px-4 py-4 text-sm font-bold text-ink-muted hover:bg-surface-container">
            <RefreshCw size={17} />
            재생성
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 border-y border-line/40 py-4">
          <ActionIcon icon={Download} label="Download" />
          <ActionIcon icon={Save} label="Save to Project" />
          <ActionIcon icon={Share2} label="Share" />
        </div>

        <InfoBox title="Version History">
          {approvalArtifact.versionHistory.map((item) => (
            <div className="flex items-center justify-between text-xs" key={item.version}>
              <span className={item.label === 'Current' ? 'font-bold text-ink' : 'text-ink-muted'}>{item.version} ({item.label})</span>
              <span className="text-ink-soft">{item.timestamp}</span>
            </div>
          ))}
        </InfoBox>

        <InfoBox title="Error / Status Log">
          {approvalArtifact.statusLog.map((item) => (
            <div className="flex gap-2 text-xs leading-5 text-ink-muted" key={item.message}>
              <CheckCircle2 className={item.level === 'success' ? 'mt-0.5 text-secondary-action' : 'mt-0.5 text-primary'} size={14} />
              <span>{item.message}</span>
            </div>
          ))}
        </InfoBox>
      </div>
    </aside>
  );
}

function ActionIcon({ icon: Icon, label }: { icon: typeof Download; label: string }) {
  return (
    <button className="focus-ring flex flex-col items-center gap-2 rounded-2xl p-2 text-ink-muted hover:bg-surface-low hover:text-primary">
      <Icon size={20} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line/50 bg-white p-4">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.14em] text-ink-soft">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AgentAvatar({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary to-primary-action text-xs font-black text-white shadow-ambient">
      {label}
      {active ? <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-secondary-action" /> : null}
    </div>
  );
}

function MiniPreview({ projectId }: { projectId: string }) {
  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-teal-900 via-primary to-primary-action">
      <div className="h-full w-full opacity-70 [background:radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.45),transparent_24%),radial-gradient(circle_at_70%_75%,rgba(243,199,173,0.34),transparent_28%)]" />
      <span className="sr-only">{projectId}</span>
    </div>
  );
}
