# 🚀 MotoPH CI/CD + Docker Setup Guide

## 📋 What You're Getting

This setup includes:
- ✅ **Docker** - Containerized Next.js app
- ✅ **Docker Compose** - Multi-container orchestration
- ✅ **GitHub Actions** - Automated CI/CD pipeline
- ✅ **Security Scanning** - Automated vulnerability checks
- ✅ **Multi-stage builds** - Optimized production images

---

## 🐳 Docker Setup

### Local Development with Docker

```bash
# Build the image
docker build -t motoph-app .

# Run the container
docker run -p 3000:3000 motoph-app

# Or use Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Docker Commands Cheat Sheet

```bash
# Build image
docker build -t motoph:latest .

# Run container
docker run -d -p 3000:3000 --name motoph motoph:latest

# View logs
docker logs -f motoph

# Shell into container
docker exec -it motoph sh

# Stop container
docker stop motoph

# Remove container
docker rm motoph

# Remove image
docker rmi motoph:latest
```

---

## 🔧 GitHub Actions CI/CD Setup

### Step 1: Enable GitHub Actions

1. Go to your GitHub repo
2. Click **"Actions"** tab
3. Enable workflows

### Step 2: Add Secrets (for deployment)

Go to **Settings → Secrets and variables → Actions** and add:

#### For Vercel Deployment:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

#### For Server Deployment (SSH):
```
SERVER_HOST=your_server_ip
SERVER_USER=your_username
SERVER_SSH_KEY=your_private_key
```

### Step 3: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "feat: add CI/CD pipeline with Docker support"

# Add remote
git remote add origin https://github.com/yourusername/3d-moto-sys.git

# Push
git push -u origin main
```

### Step 4: Watch the Magic! ✨

Every push to `main` or `develop` will:
1. ✅ Run linting & type checks
2. ✅ Build Docker image
3. ✅ Run security scans
4. ✅ Deploy to production (if configured)

---

## 📦 What Each File Does

### `Dockerfile`
- Multi-stage build for small image size (~150MB)
- Production-optimized Next.js build
- Non-root user for security
- Health checks included

### `docker-compose.yml`
- Local development environment
- Optional Nginx reverse proxy
- Network configuration
- Volume mounts for hot reload

### `.github/workflows/ci-cd.yml`
- Automated testing on every push
- Docker image building and pushing to GitHub Container Registry
- Optional deployment to Vercel or your server
- Security vulnerability scanning

---

## 🚀 Deployment Options

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Docker on Your Server
```bash
# SSH into server
ssh user@your-server.com

# Clone repo
git clone https://github.com/yourusername/3d-moto-sys.git
cd 3d-moto-sys

# Build and run
docker-compose up -d
```

### Option 3: GitHub Container Registry + Your Server
```bash
# On your server
docker login ghcr.io -u yourusername

# Pull image
docker pull ghcr.io/yourusername/3d-moto-sys:latest

# Run
docker run -d -p 3000:3000 ghcr.io/yourusername/3d-moto-sys:latest
```

---

## 🔐 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use `.env.local`** for local development
3. **Enable Dependabot** - Auto security updates
4. **Review security scan results** - Check Actions tab

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint
Create `src/app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
}
```

---

## 🐛 Troubleshooting

### Docker build fails
```bash
# Clear cache
docker builder prune -a

# Build without cache
docker build --no-cache -t motoph:latest .
```

### CI/CD fails
- Check **Actions** tab for error logs
- Verify secrets are set correctly
- Check `package.json` scripts exist

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

## 📚 Learning Resources

- **Docker:** https://docs.docker.com/get-started/
- **GitHub Actions:** https://docs.github.com/en/actions
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Update `next.config.ts` with `output: 'standalone'`
- [ ] Set environment variables
- [ ] Configure domain & SSL
- [ ] Set up monitoring (optional)
- [ ] Enable CDN (optional)
- [ ] Test Docker build locally
- [ ] Run security scan
- [ ] Set up backup strategy

---

## 📝 Next Steps

1. **Copy all DevOps files to your project root**
2. **Update `next.config.ts`** (use the docker version)
3. **Test Docker build locally**
4. **Push to GitHub**
5. **Watch CI/CD pipeline run**
6. **Deploy!** 🚀

---

## 💡 Pro Tips

- Use `docker-compose` for local dev (hot reload works!)
- GitHub Actions are free for public repos
- Vercel has generous free tier
- Monitor your Docker image size
- Use multi-stage builds to keep images small

Ready to deploy! 🎉
