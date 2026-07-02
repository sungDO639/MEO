```typescript
import { ProjectConfig, ProjectPlan, Message } from '@meo/shared';
import { ProjectAnalyzer } from '@meo/code-analyzer';
import { SandboxExecutor } from '@meo/sandbox';

export class MeoEngine {
  private projectAnalyzer: ProjectAnalyzer;
  private sandbox: SandboxExecutor;
  private currentProject: ProjectConfig | null = null;

  constructor() {
    this.projectAnalyzer = new ProjectAnalyzer();
    this.sandbox = new SandboxExecutor();
  }

  async loadProject(projectPath: string): Promise<ProjectConfig> {
    const config = await this.projectAnalyzer.analyzeProject(projectPath);
    this.currentProject = config;
    return config;
  }

  async planTask(description: string): Promise<ProjectPlan> {
    return {
      steps: [{
        id: '1',
        description: `Execute: ${description}`,
        action: { type: 'execute_command', payload: { command: 'echo planned' }, reasoning: 'auto' },
        status: 'pending',
      }],
      estimatedTime: 1,
      dependencies: [],
      risks: [],
    };
  }

  async chat(message: string, history: Message[]): Promise<Message> {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Processing: "${message}"`,
      timestamp: Date.now(),
    };
  }
}
```

---