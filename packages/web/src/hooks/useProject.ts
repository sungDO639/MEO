```typescript
import { useState, useEffect } from 'react';

export function useProject() {
  const [project, setProject] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}`);
      const data = await res.json();
      setProject(data);
      setFiles(data.files || []);
    } finally {
      setLoading(false);
    }
  };

  return { project, files, loading, loadProject, setFiles };
}
```

---