```typescript
import Docker from 'dockerode';

export class SandboxExecutor {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async executeCommand(command: string, options: { cwd?: string } = {}): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    try {
      const container = await this.docker.createContainer({
        Image: 'node:20-alpine',
        Cmd: ['sh', '-c', command],
        WorkingDir: '/workspace',
        HostConfig: {
          AutoRemove: true,
          Binds: options.cwd ? [`${options.cwd}:/workspace`] : [],
          Memory: 512 * 1024 * 1024,
          NetworkMode: 'none',
        },
      });
      await container.start();
      const result = await container.wait();
      const logs = await container.logs({ stdout: true, stderr: true });
      return {
        stdout: logs.toString(),
        stderr: '',
        exitCode: result.StatusCode,
      };
    } catch (err: any) {
      return { stdout: '', stderr: err.message, exitCode: 1 };
    }
  }
}
```

---