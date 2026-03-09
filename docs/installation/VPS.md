# ☁️ VPS Installation Guide

Deploy your bot system to a Virtual Private Server for 24/7 uptime.

## Recommended VPS Providers

- **DigitalOcean** - $4-6/month (Droplet)
- **Linode** - $5/month  
- **Vultr** - $3.50-6/month
- **AWS EC2** - t2.micro (Free tier)
- **Google Cloud** - e2-micro (Free tier)
- **Oracle Cloud** - Always Free tier (ARM-based)

**Minimum Requirements:**
- 1 GB RAM
- 1 vCPU
- 25 GB SSD
- Ubuntu 22.04 LTS (recommended)

## Quick Installation Script

```bash
# Run this one-liner on fresh Ubuntu 22.04 VPS
curl -fsSL https://raw.githubusercontent.com/your-repo/upgraded-bot-system/main/scripts/vps-install.sh | bash
```

## Manual Installation

### 1. Initial Server Setup

```bash
# SSH into your VPS
ssh root@your_vps_ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser botuser
usermod -aG sudo botuser

# Setup firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Switch to new user
su - botuser
```

### 2. Install Dependencies

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
sudo npm install -g pnpm pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Git
sudo apt install -y git
```

### 3. Configure PostgreSQL

```bash
# Switch to postgres user
sudo -i -u postgres

# Create database and user
createdb bot_system
createuser --interactive botuser
# Answer: superuser? No, createdb? Yes, createrole? No

# Set password
psql
ALTER USER botuser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bot_system TO botuser;
\q

# Exit postgres user
exit

# Configure remote access (if needed)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Find and change: listen_addresses = 'localhost'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host    all    all    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 4. Configure Redis

```bash
# Edit Redis config
sudo nano /etc/redis/redis.conf

# Set password (uncomment and change)
requirepass your_redis_password

# Bind to localhost only
bind 127.0.0.1

# Save and exit (Ctrl+X, Y, Enter)

# Restart Redis
sudo systemctl restart redis-server
```

### 5. Clone and Setup Project

```bash
# Clone repository
cd ~
git clone https://github.com/your-repo/upgraded-bot-system.git
cd upgraded-bot-system

# Run database initialization
sudo -u postgres psql -d bot_system -f scripts/init-db.sql

# Run migrations
cd shared/database/migrations
sudo -u postgres psql -d bot_system -f 001_initial_schema.sql
sudo -u postgres psql -d bot_system -f 002_indexes.sql
cd ~/upgraded-bot-system
```

### 6. Configure Environment

```bash
# Telegram bot
cd telegram-bot
cp .env.example .env
nano .env
# Fill in your configuration (see localhost guide)

# Discord bot
cd ../discord-bot
cp .env.example .env
nano .env
# Fill in your configuration

cd ..
```

### 7. Install Dependencies

```bash
# Telegram bot
cd telegram-bot
pnpm install
pnpm run build

# Discord bot
cd ../discord-bot
pnpm install
pnpm run deploy  # Deploy Discord commands
pnpm run build

cd ..
```

### 8. Setup PM2 (Process Manager)

```bash
# Start bots with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs

# Monitor bots
pm2 status
pm2 logs

# Other PM2 commands
pm2 restart all
pm2 stop all
pm2 delete all
```

### 9. Setup Log Rotation

```bash
sudo nano /etc/logrotate.d/bot-system

# Add:
/home/botuser/upgraded-bot-system/telegram-bot/logs/*.log
/home/botuser/upgraded-bot-system/discord-bot/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 botuser botuser
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 10. Setup Automated Backups

```bash
# Create backup script
mkdir -p ~/backups
nano ~/backups/backup.sh

# Add:
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups/database
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U botuser bot_system > $BACKUP_DIR/bot_system_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"

# Make executable
chmod +x ~/backups/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/botuser/backups/backup.sh >> /home/botuser/backups/backup.log 2>&1
```

### 11. Setup Monitoring (Optional)

```bash
# Install monitoring tools
sudo apt install -y htop iotop netdata

# Netdata will be available at http://your_vps_ip:19999

# Or use PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 12. Setup SSL/HTTPS (Optional - for webhooks)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Updating the Bots

```bash
cd ~/upgraded-bot-system
git pull
cd telegram-bot && pnpm install && pnpm run build
cd ../discord-bot && pnpm install && pnpm run build
cd ..
pm2 restart all
```

## Troubleshooting

### Bot Keeps Crashing

```bash
# View logs
pm2 logs

# Check system resources
htop

# Check disk space
df -h

# Check memory
free -h
```

### Database Connection Errors

```bash
# Test database connection
psql -U botuser -d bot_system -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Out of Memory

```bash
# Add swap file (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Security Hardening

### 1. SSH Key Authentication

```bash
# On your local machine
ssh-keygen -t ed25519

# Copy to VPS
ssh-copy-id botuser@your_vps_ip

# Disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 2. Fail2Ban

```bash
# Install
sudo apt install -y fail2ban

# Configure
sudo nano /etc/fail2ban/jail.local

# Add:
[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

# Start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Auto-Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Performance Optimization

### Database Optimization

```sql
-- Connect to database
psql -U botuser -d bot_system

-- Analyze tables
ANALYZE;

-- Vacuum tables
VACUUM ANALYZE;

-- Create indexes
CREATE INDEX CONCURRENTLY idx_messages_timestamp ON messages(created_at DESC);
```

### Redis Optimization

```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Add/modify:
maxmemory 256mb
maxmemory-policy allkeys-lru
save ""  # Disable RDB snapshots if not needed

# Restart
sudo systemctl restart redis-server
```

## Monitoring Commands

```bash
# Bot status
pm2 status

# Realtime logs
pm2 logs --lines 100

# System resources
htop

# Database size
psql -U botuser -d bot_system -c "SELECT pg_size_pretty(pg_database_size('bot_system'));"

# Redis memory usage
redis-cli INFO memory

# Disk usage
du -sh ~/upgraded-bot-system/*
```

## Cost Optimization

1. **Use ARM-based VPS** (Oracle Cloud Free Tier)
2. **Compress logs** with logrotate
3. **Clean old data** regularly:
```sql
DELETE FROM messages WHERE created_at < NOW() - INTERVAL '30 days';
VACUUM FULL;
```
4. **Use Redis for caching** to reduce database queries

## Scaling

### Vertical Scaling
Upgrade VPS resources when needed:
- 1GB → 2GB RAM
- 1 vCPU → 2 vCPU

### Horizontal Scaling
Run multiple instances:
```bash
pm2 start ecosystem.config.js -i 2  # 2 instances
```

## Maintenance Schedule

**Daily:**
- Check PM2 status
- Review error logs

**Weekly:**
- Check disk space
- Review database size
- Update packages: `pnpm update`

**Monthly:**
- System updates: `sudo apt update && sudo apt upgrade`
- Backup verification
- Performance review

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 🐛 Issues: [GitHub](https://github.com/example/issues)

---

✅ Your bots are now running 24/7 on VPS!
