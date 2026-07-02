```typescript
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ProjectConfig {
  id: string;
  name: string;
  path: string;
  type: 'react' | 'nextjs' | 'react-native' | 'expo' | 'flutter' | 'nodejs' | 'nestjs';
  language: 'typescript' | 'javascript' | 'dart';
  framework: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  structure: FileNode[];
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
  children?: FileNode[];
  size?: number;
  modifiedAt?: number;
}

export interface AIAction {
  type: 'create_file' | 'modify_file' | 'delete_file' | 'execute_command' | 'install_package' | 'run_test' | 'analyze' | 'refactor';
  payload: Record<string, any>;
  reasoning: string;
}

export interface ProjectPlan {
  steps: PlanStep[];
  estimatedTime: number;
  dependencies: string[];
  risks: string[];
}

export interface PlanStep {
  id: string;
  description: string;
  action: AIAction;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
}
```

---