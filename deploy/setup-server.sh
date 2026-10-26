#!/usr/bin/env bash
# One-time provisioning for a fresh Ubuntu/Debian VPS. Run as root on the server
# from a directory that also contains nginx.conf:
#
#   sudo bash setup-server.sh
#
# Creates a `deploy` user (reusing root's authorized SSH keys), the web root,
# the Nginx site and a firewall. HTTPS is a separate step once DNS points here.
set -euo pipefail

APP_DIR=/var/www/dayim
DEPLOY_USER=deploy
SITE=/etc/nginx/sites-available/dayim
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this as root (sudo bash setup-server.sh)" >&2
  exit 1
fi

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y nginx rsync ufw certbot python3-certbot-nginx

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
if [ ! -s "/home/$DEPLOY_USER/.ssh/authorized_keys" ] && [ -s /root/.ssh/authorized_keys ]; then
  install -m 600 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /root/.ssh/authorized_keys "/home/$DEPLOY_USER/.ssh/authorized_keys"
fi
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$APP_DIR" "$APP_DIR/releases"

# Don't clobber the HTTPS block certbot writes into the site file.
if [ -f "$SITE" ] && grep -q "managed by Certbot" "$SITE"; then
  echo "Keeping existing $SITE (already has certbot changes)"
else
  install -m 644 "$SCRIPT_DIR/nginx.conf" "$SITE"
fi
ln -sfn "$SITE" /etc/nginx/sites-enabled/dayim
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload-or-restart nginx

# Open whatever port sshd actually listens on before enabling the firewall.
for port in $(sshd -T 2>/dev/null | awk '/^port /{print $2}'); do
  ufw allow "$port/tcp"
done
ufw allow 22/tcp
ufw allow 'Nginx Full'
ufw --force enable

cat <<EOF

Server ready. Next:
  1. From your machine: DEPLOY_HOST=$DEPLOY_USER@<server-ip> npm run deploy
  2. Point the domain's A records (@ and www) at this server.
  3. Then on the server:
     certbot --nginx -d dayimdevelopers.com -d www.dayimdevelopers.com --redirect
EOF
