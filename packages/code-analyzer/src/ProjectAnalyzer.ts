```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectConfig, FileNode } from '@meo/shared';

export class ProjectAnalyzer {
  async analyzeProject(projectPath: string): Promise<ProjectConfig> {
    const pkg = await this.readJson(path.join(projectPath, 'package.json'));
    const tree = await this.buildFileTree(projectPath);
    return {
      id: 'auto',
      name: pkg.name || path.basename(projectPath),
      path: projectPath,
      type: 'nextjs',
      language: 'typescript',
      framework: 'next.js',
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      structure: tree,
    };
  }

  async buildFileTree(dir: string): Promise<FileNode[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const nodes: FileNode[] = [];
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        nodes.push({
          name: e.name,
          path: full,
          type: 'directory',
          children: await this.buildFileTree(full),
        });
      } else {
        nodes.push({
          name: e.name,
          path: full,
          type: 'file',
          content: await fs.readFile(full, 'utf-8').catch(() => ''),
          language: e.name.split('.').pop() || 'text',
        });
      }
    }
    return nodes;
  }

  private async readJson(p: string): Promise<any> {
    try {
      return JSON.parse(await fs.readFile(p, 'utf-8'));
    } catch {
      return {};
    }
  }
}
```

---