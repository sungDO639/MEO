```bash
#!/bin/bash
set -e
cd /opt/meo-code-ai
docker-compose down || true
docker-compose build
docker-compose up -d
echo "Deploy completed. Frontend: http://$(curl -s ifconfig.me):3000"
```