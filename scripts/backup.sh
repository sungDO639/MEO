```bash
#!/bin/bash
cd /opt/meo-code-ai
mkdir -p backups
docker-compose exec -T postgres pg_dump -U meo meo_code_ai > backups/db_$(date +%Y%m%d).sql
echo "Backup saved to backups/"
```