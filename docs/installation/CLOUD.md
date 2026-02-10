# 🐳 Docker & Cloud Deployment Guide

Deploy your bot system using Docker for easy portability and cloud deployment.

## Prerequisites

- **Docker** 20.10+ ([Install](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([Install](https://docs.docker.com/compose/install/))

## Quick Start with Docker

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/upgraded-bot-system.git
cd upgraded-bot-system
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

Fill in:
```env
# Generate secure passwords
POSTGRES_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

# Add your bot tokens
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_ADMIN_IDS=your_telegram_id
DISCORD_BOT_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id
LOG_LEVEL=info
```

### 3. Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec postgres psql -U botuser -d bot_system -f /docker-entrypoint-initdb.d/init.sql
```

### 5. Deploy Discord Commands

```bash
docker-compose exec discord-bot npm run deploy
```

## Docker Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f telegram-bot
docker-compose logs -f discord-bot

# Execute commands in containers
docker-compose exec telegram-bot sh
docker-compose exec postgres psql -U botuser -d bot_system

# Update containers
docker-compose pull
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

## Cloud Platform Deployment

### AWS (Amazon Web Services)

#### Option 1: ECS (Elastic Container Service)

```bash
# Install AWS CLI
aws configure

# Create ECR repositories
aws ecr create-repository --repository-name telegram-bot
aws ecr create-repository --repository-name discord-bot

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t telegram-bot ./telegram-bot
docker tag telegram-bot:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/telegram-bot:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/telegram-bot:latest

# Repeat for discord-bot
```

#### Option 2: EC2 with Docker

```bash
# Launch Ubuntu EC2 instance (t2.small recommended)
# SSH into instance
ssh -i your-key.pem ubuntu@ec2-ip

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# Clone and deploy
git clone <repo-url>
cd upgraded-bot-system
cp .env.example .env
# Edit .env
docker-compose up -d
```

### Google Cloud Platform

```bash
# Install gcloud CLI
gcloud init

# Create GKE cluster
gcloud container clusters create bot-cluster --num-nodes=1 --machine-type=e2-small

# Build and push to GCR
gcloud builds submit --tag gcr.io/project-id/telegram-bot ./telegram-bot
gcloud builds submit --tag gcr.io/project-id/discord-bot ./discord-bot

# Deploy
kubectl apply -f k8s/
```

### DigitalOcean

```bash
# Install doctl
doctl auth init

# Create Kubernetes cluster
doctl kubernetes cluster create bot-cluster --count 1 --size s-1vcpu-2gb

# Or use App Platform
doctl apps create --spec app-spec.yaml
```

### Heroku

```bash
# Install Heroku CLI
heroku login

# Create apps
heroku create telegram-bot-app
heroku create discord-bot-app

# Add PostgreSQL and Redis
heroku addons:create heroku-postgresql:mini -a telegram-bot-app
heroku addons:create heroku-redis:mini -a telegram-bot-app

# Set environment variables
heroku config:set BOT_TOKEN=xxx -a telegram-bot-app

# Deploy
git subtree push --prefix telegram-bot heroku main
```

### Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Add PostgreSQL and Redis from marketplace
5. Set environment variables
6. Deploy

### Render

1. Go to [render.com](https://render.com)
2. New → "Web Service"
3. Connect GitHub repository
4. Add PostgreSQL and Redis from dashboard
5. Set environment variables
6. Deploy

## Monitoring & Maintenance

### Health Checks

```bash
# Create health check endpoint
# Add to bot code:
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
```

### Logging

```bash
# View logs
docker-compose logs --tail=100 telegram-bot
docker-compose logs --since=1h discord-bot

# Export logs
docker-compose logs > bot-logs.txt
```

### Backups

```bash
# Backup database
docker-compose exec postgres pg_dump -U botuser bot_system > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U botuser bot_system
```

### Automated Backups

```bash
# Create backup script
cat > backup.sh << 'BACKUP'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U botuser bot_system | gzip > backups/backup_$DATE.sql.gz
find backups/ -name "*.sql.gz" -mtime +7 -delete
BACKUP

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  telegram-bot:
    deploy:
      replicas: 3  # Run 3 instances
```

### Load Balancing

```yaml
# Add nginx
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
```

## Security Best Practices

1. **Use secrets management**:
```bash
# Docker secrets
docker secret create db_password ./db_password.txt
```

2. **Limit resources**:
```yaml
services:
  telegram-bot:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

3. **Network isolation**:
```yaml
networks:
  bot-network:
    driver: bridge
    internal: true  # No external access
```

4. **Read-only containers**:
```yaml
services:
  telegram-bot:
    read_only: true
    tmpfs:
      - /tmp
```

## Troubleshooting

### Container Won't Start

```bash
# View logs
docker-compose logs telegram-bot

# Check build
docker-compose build --no-cache telegram-bot

# Inspect container
docker-compose exec telegram-bot sh
```

### Database Connection Issues

```bash
# Test connection
docker-compose exec telegram-bot sh
nc -zv postgres 5432

# Check database
docker-compose exec postgres psql -U botuser -d bot_system -c "SELECT 1;"
```

### Out of Memory

```bash
# Increase memory limit
docker-compose up -d --scale telegram-bot=1 --memory=1g
```

## Performance Optimization

### Multi-stage Builds
Already implemented in Dockerfiles to reduce image size.

### Layer Caching
```dockerfile
# Copy package files first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
# Then copy source (changes more frequently)
COPY . .
```

### Image Optimization
```bash
# Use alpine base images
FROM node:18-alpine  # 40MB vs 900MB

# Remove dev dependencies
RUN pnpm install --prod
```

## Cost Optimization

| Platform | Free Tier | Cost |
|----------|-----------|------|
| Railway | $5 credit | ~$5-10/month |
| Render | 750 hours | Free |
| Fly.io | 3 VMs | Free |
| Oracle Cloud | Always free | Free |
| AWS EC2 | 750 hours | $3-5/month |

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 📖 Docs: [Full documentation](../README.md)

---

✅ Your bots are now running in containers!
