import {
  Bot,
  Boxes,
  Cable,
  ChartNoAxesCombined,
  ClipboardList,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Settings,
} from 'lucide-react';
import { DashboardPage } from '../pages/DashboardPage';
import { EmptyPage } from '../pages/EmptyPage';
import { PMWorkspacePage } from '../pages/PMWorkspacePage';
import { StudioTeamsPage } from '../pages/StudioTeamsPage';
import { ArtifactsPage } from '../pages/ArtifactsPage';
import { IntegrationsPage } from '../pages/IntegrationsPage';
import { WorkflowsPage } from '../pages/WorkflowsPage';
import { CommandTemplatesPage } from '../pages/CommandTemplatesPage';
import { ProjectsPage } from '../pages/ProjectsPage';

export type AppRoute = {
  path: string;
  label: string;
  shortLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof LayoutDashboard;
  phase: string;
};

export const routes: AppRoute[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    shortLabel: 'Home',
    title: 'Home Dashboard',
    eyebrow: 'Production Control Center',
    description: '4개 MVP 프로젝트의 제작 상태와 PM Supervisor의 운영 신호를 모으는 관제센터입니다.',
    icon: LayoutDashboard,
    phase: 'Phase 2',
  },
  {
    path: '/pm',
    label: 'PM Workspace',
    shortLabel: 'PM',
    title: 'PM Workspace',
    eyebrow: 'Supervisor Command Room',
    description: '사용자가 PM Supervisor에게만 지시하고 산출물 승인 흐름을 확인하는 실제 작업실입니다.',
    icon: MessageSquareText,
    phase: 'Phase 3',
  },
  {
    path: '/commands',
    label: 'Commands',
    shortLabel: 'Cmd',
    title: 'Command Templates',
    eyebrow: 'PM Command Library',
    description: 'PM Workspace에서 자주 쓰는 작업 지시문을 프로젝트와 에이전트별로 빠르게 찾습니다.',
    icon: ClipboardList,
    phase: 'Phase 9',
  },
  {
    path: '/projects',
    label: 'Projects',
    shortLabel: 'Proj',
    title: 'Projects',
    eyebrow: 'MVP Portfolio',
    description: '4개 MVP 프로젝트의 목적, 진행률, 담당 에이전트, 산출물 흐름을 한 곳에서 정리합니다.',
    icon: FolderKanban,
    phase: 'Phase 8',
  },
  {
    path: '/teams',
    label: 'Studio Teams',
    shortLabel: 'Teams',
    title: 'Studio Teams',
    eyebrow: 'AI Employee Board',
    description: '고정 AI 직원처럼 재사용되는 에이전트의 배치와 현재 작업 상태를 보여줍니다.',
    icon: Bot,
    phase: 'Phase 4',
  },
  {
    path: '/workflows',
    label: 'Workflows',
    shortLabel: 'Flow',
    title: 'Workflows',
    eyebrow: 'Content Production Chain',
    description: 'Brief부터 Archive까지 프로젝트별로 활성화된 콘텐츠 제작 체인을 시각화합니다.',
    icon: ChartNoAxesCombined,
    phase: 'Phase 7',
  },
  {
    path: '/artifacts',
    label: 'Artifacts',
    shortLabel: 'Files',
    title: 'Artifacts',
    eyebrow: 'Creative Output Library',
    description: '스크립트, 블로그 초안, 이미지 프롬프트, 영상 프롬프트, 업로드 메타데이터를 관리합니다.',
    icon: FileStack,
    phase: 'Phase 5',
  },
  {
    path: '/connections',
    label: 'Integrations',
    shortLabel: 'AI',
    title: 'Integrations',
    eyebrow: 'Settings Foundation',
    description: 'ChatGPT, Claude, Gemini, Sora, Remotion, YouTube 등 향후 연결 상태의 placeholder입니다.',
    icon: Cable,
    phase: 'Phase 6',
  },
  {
    path: '/settings',
    label: 'Settings',
    shortLabel: 'More',
    title: 'Settings',
    eyebrow: 'System Preferences',
    description: '실제 설정 기능은 이후 단계에서 추가하며, Phase 1에서는 라우트 자리만 준비합니다.',
    icon: Settings,
    phase: 'Phase 6',
  },
];

export const fallbackRoute = routes[0];

export function getRoute(pathname: string): AppRoute {
  if (pathname === '/') {
    return fallbackRoute;
  }

  return routes.find((route) => route.path === pathname) ?? fallbackRoute;
}

export function renderRoute(route: AppRoute) {
  if (route.path === '/dashboard') {
    return <DashboardPage />;
  }

  if (route.path === '/pm') {
    return <PMWorkspacePage />;
  }

  if (route.path === '/commands') {
    return <CommandTemplatesPage />;
  }

  if (route.path === '/projects') {
    return <ProjectsPage />;
  }

  if (route.path === '/teams') {
    return <StudioTeamsPage />;
  }

  if (route.path === '/workflows') {
    return <WorkflowsPage />;
  }

  if (route.path === '/artifacts') {
    return <ArtifactsPage />;
  }

  if (route.path === '/connections' || route.path === '/settings') {
    return <IntegrationsPage />;
  }

  return <EmptyPage route={route} />;
}

export const shellStats = [
  { label: 'MVP Projects', value: '04' },
  { label: 'AI Agents', value: '09' },
  { label: 'Active Chains', value: '04' },
];

export const shellUtilities = [
  { label: 'Foundation', icon: Boxes },
  { label: 'Mock only', icon: Cable },
];
