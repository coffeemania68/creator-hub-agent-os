export type ProjectId = 'wisdom' | 'chic40' | 'contest' | 'stickerlab';

export type ProjectStatus = 'ideation' | 'active' | 'review' | 'rendering' | 'completed';

export type WorkflowStageId =
  | 'brief'
  | 'research'
  | 'plan'
  | 'script'
  | 'image'
  | 'video'
  | 'edit'
  | 'review'
  | 'publish'
  | 'archive';

export type WorkflowStageStatus = 'done' | 'running' | 'queued' | 'blocked' | 'idle';

export type AgentStatus = 'always-on' | 'working' | 'idle' | 'queued' | 'action-needed';

export type AgentTeam = 'strategy' | 'content' | 'visual' | 'operation' | 'review';

export type ArtifactType =
  | 'script'
  | 'shorts-script'
  | 'blog-draft'
  | 'substack-draft'
  | 'naver-blog-draft'
  | 'thumbnail-concept'
  | 'image-prompt'
  | 'generated-image'
  | 'video-prompt'
  | 'generated-video'
  | 'upload-metadata'
  | 'affiliate-copy'
  | 'contest-proposal'
  | 'portfolio-draft';

export type ArtifactStatus = 'draft' | 'review' | 'approved' | 'archived';

export type ConnectionStatus = 'connected' | 'placeholder' | 'offline';

export type IntegrationStatus = 'mock' | 'pending' | 'connected' | 'blocked';

export type IntegrationProvider =
  | 'GitHub'
  | 'Cloudflare Pages'
  | 'Cloudflare Workers'
  | 'OpenAI / ChatGPT MCP'
  | 'Perplexity'
  | 'Codex / GitHub Issues'
  | 'Google'
  | 'Notion';

export type CommandTemplateStatus = 'ready' | 'draft' | 'review';

export type Project = {
  id: ProjectId;
  name: string;
  shortName: string;
  domain: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  currentStage: WorkflowStageId;
  activeAgentIds: string[];
  nextAction: string;
  channels: string[];
  priority: 'high' | 'medium' | 'low';
  visualTheme: string;
  deliverables: ArtifactType[];
  updatedAt: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  team: AgentTeam;
  status: AgentStatus;
  currentTask?: string;
  projectId?: ProjectId;
  skills: string[];
  baseEngine?: string;
  primaryTool?: string;
  recentArtifactIds: string[];
};

export type WorkflowRun = {
  id: string;
  projectId: ProjectId;
  title: string;
  stages: Array<{
    id: WorkflowStageId;
    label: string;
    status: WorkflowStageStatus;
    agentId?: string;
    progress?: number;
  }>;
};

export type Artifact = {
  id: string;
  projectId: ProjectId;
  type: ArtifactType;
  title: string;
  status: ArtifactStatus;
  agentId?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, string>;
};

export type PMThread = {
  id: string;
  projectId: ProjectId;
  title: string;
  lastMessage: string;
  agentId?: string;
  status: 'active' | 'processing' | 'completed' | 'idle';
  updatedAt: string;
};

export type Connection = {
  id: string;
  provider: 'ChatGPT' | 'Claude' | 'Gemini' | 'Codex' | 'Sora' | 'Remotion' | 'YouTube' | 'Firebase';
  status: ConnectionStatus;
  usageLabel?: string;
};

export type IntegrationService = {
  id: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  connectionType: 'MCP' | 'Backend' | 'GitHub' | 'Cloudflare' | 'Future Connector';
  handoff: string;
  usageLabel: string;
  note: string;
};

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend?: string;
  tone: 'primary' | 'secondary' | 'accent' | 'neutral';
};

export type PriorityTask = {
  id: string;
  projectId: ProjectId;
  title: string;
  reason: string;
  ownerAgentId: string;
  dueLabel: string;
  status: 'needs-approval' | 'running' | 'queued';
};

export type AgentQueueItem = {
  id: string;
  agentId: string;
  projectId: ProjectId;
  task: string;
  artifactType: ArtifactType;
  status: 'running' | 'queued' | 'blocked' | 'review';
  eta: string;
};

export type QuickAction = {
  id: string;
  label: string;
  prompt: string;
  projectId?: ProjectId;
};

export type CommandTemplate = {
  id: string;
  projectId: ProjectId;
  name: string;
  purpose: string;
  targetAgentId: string;
  promptPreview: string;
  status: CommandTemplateStatus;
  tags: string[];
};

export type PMMessage = {
  id: string;
  sender: 'user' | 'pm';
  body: string;
  createdAt: string;
};

export type ApprovalArtifact = {
  id: string;
  artifactId: string;
  title: string;
  projectId: ProjectId;
  description: string;
  revisionPrompt: string;
  status: 'new' | 'waiting' | 'approved' | 'regenerate';
  versionHistory: Array<{
    version: string;
    label: string;
    timestamp: string;
  }>;
  statusLog: Array<{
    level: 'success' | 'info' | 'warning';
    message: string;
  }>;
};

export type LearningTip = {
  id: string;
  category: 'Remotion' | 'AI 영상' | '디자인' | '콘텐츠 운영';
  title: string;
  summary: string;
  publishLabel: string;
};

export type StudioTeamId = 'strategy' | 'content' | 'visual' | 'operations' | 'commerce';

export type StudioAgentProfile = {
  id: string;
  name: string;
  role: string;
  teamId: StudioTeamId;
  status: 'always-on' | 'working' | 'idle' | 'queued' | 'action-needed';
  projectIds: ProjectId[];
  currentTask: string;
  commandExamples: string[];
  recentOutputs: string[];
  progress: number;
  engine: string;
  primaryTool: string;
  skills: string[];
};
