import {
  Activity,
  Bot,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  LucideIcon,
  Megaphone,
  Palette,
  PenTool,
  Server,
  Terminal,
  Video,
  Workflow,
} from 'lucide-react';

export const DEFAULT_PROJECT_IMAGE = '/orbact-icon.svg';
export const DEFAULT_TEAM_IMAGE = '/orbact-icon.svg';

export const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Bot,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Megaphone,
  Palette,
  PenTool,
  Server,
  Terminal,
  Video,
  Workflow,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);
