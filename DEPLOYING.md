# Deploying to a VPS with Docker

## Prerequisites

Your **VPS** needs:

- **Docker** and **Docker Compose** (v2)
- **SSH server** (e.g. OpenSSH)

Your **local machine** needs:

- rsync
- SSH access to the VPS (key-based authentication recommended)

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) for the contact form |
| `DEPLOY_HOST` | Hostname or IP address of your VPS (e.g. `203.0.113.10`) |
| `DEPLOY_USER` | SSH user on the VPS (e.g. `deploy`) |
| `DEPLOY_PATH` | Absolute path on the VPS where the project is synced (e.g. `/opt/siam-it`) |

> **Note:** `.env` is listed in `.gitignore` — secrets are never committed.

## One-time VPS setup

1. **Install Docker** (if not already installed):

   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   # Log out and back in for the group change to take effect
   ```

2. **Create the deploy directory:**

   ```bash
   sudo mkdir -p /opt/siam-it
   sudo chown $USER:$USER /opt/siam-it
   ```

3. **Set up SSH key access** so the deploy script can connect without a password:

   ```bash
   # On your local machine
   ssh-copy-id deploy@your-vps-host
   ```

## How it works

The project includes:

- **`Dockerfile`** — Multi-stage build: installs deps, builds the Astro site, then runs the Node server on port 4321.
- **`docker-compose.yml`** — Two services:
  - `app` — The Astro Node server (reads `RESEND_API_KEY` from `.env`)
  - `nginx` — Reverse proxy on port 80, forwards traffic to the app
- **`nginx.conf`** — Nginx reverse proxy configuration
- **`deploy.sh`** — Syncs the project to the VPS via rsync, copies `.env`, then runs `docker compose up -d --build` remotely.

## Deploying

From the project root on your local machine, run:

```bash
./deploy.sh
```

This will:

1. Sync the project files to your VPS (excluding `node_modules`, `dist`, `.git`, `.env`)
2. Copy your `.env` to the remote server
3. Build the Docker image and start the containers on the VPS

The site will be available on port 80 of your VPS.

## Useful commands (run on VPS)

```bash
cd /opt/siam-it

# View logs
docker compose logs -f

# Restart containers
docker compose restart

# Stop everything
docker compose down

# Rebuild after manual changes
docker compose up -d --build
```

## Adding HTTPS

Install Certbot on your VPS and use it with Nginx. One approach:

1. Stop the nginx container temporarily: `docker compose stop nginx`
2. Run certbot standalone: `sudo certbot certonly --standalone -d your-domain.com`
3. Update `docker-compose.yml` to mount the certs and expose port 443
4. Update `nginx.conf` with the SSL configuration
5. Restart: `docker compose up -d`

Alternatively, use a reverse proxy like [Caddy](https://caddyserver.com/) or [Traefik](https://traefik.io/) which handle HTTPS automatically.
