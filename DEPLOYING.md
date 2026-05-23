# Deploying to a VPS

## Prerequisites

Your VPS needs the following software installed:

- **Node.js** >= 22.12.0 (the version required by this project)
- **rsync** (usually pre-installed on most Linux distributions)
- **SSH server** (e.g. OpenSSH) — the deploy script connects over SSH

On your **local machine** (where you run the deploy) you need:

- Node.js >= 22.12.0
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
| `DEPLOY_PATH` | Absolute path on the VPS where the built site is served (e.g. `/var/www/siam-it`) |

> **Note:** `.env` is listed in `.gitignore` — secrets are never committed.

## One-time VPS setup

1. **Install Node.js** (if using the Node adapter for server-rendered routes):

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Ensure rsync is available:**

   ```bash
   sudo apt-get install -y rsync
   ```

3. **Create the deploy directory** and set ownership:

   ```bash
   sudo mkdir -p /var/www/siam-it
   sudo chown deploy:deploy /var/www/siam-it
   ```

4. **Set up SSH key access** so the deploy script can connect without a password:

   ```bash
   # On your local machine
   ssh-copy-id deploy@your-vps-host
   ```

5. **Configure your web server** (e.g. Nginx or Caddy) to serve files from `DEPLOY_PATH`.

## Deploying

From the project root on your local machine, run:

```bash
./deploy.sh
```

This will:

1. Install dependencies (`npm ci`)
2. Build the site (`npm run build`)
3. Sync the `dist/` directory to your VPS via rsync over SSH
