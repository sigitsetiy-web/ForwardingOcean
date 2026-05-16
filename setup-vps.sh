#!/bin/bash
# ============================================
# KeyOcean FMS - VPS Setup Script
# Run as root on Ubuntu 22.04/24.04
# ============================================

echo "🚀 Starting KeyOcean FMS Setup..."

# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install PM2 (process manager)
npm install -g pm2

# 4. Install Nginx (reverse proxy)
apt install -y nginx

# 5. Clone repository
cd /opt
git clone https://github.com/sigitsetiy-web/ForwardingOcean.git
cd ForwardingOcean

# 6. Create .env file
cat > .env.local << 'EOF'
DATABASE_URL=postgres://postgres:Bismillah%40123Pass@db.yeadywoaxbnjiwsnmnpb.supabase.co:5432/postgres
DB_HOST=db.yeadywoaxbnjiwsnmnpb.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Bismillah@123Pass
NEXT_PUBLIC_SUPABASE_URL=https://yeadywoaxbnjiwsnmnpb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_5EKRDdhWbgKLckMXO3J8zg_bFdi5ciyD
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_5EKRDdhWbgKLckMXO3J8zg_bFdi5ciyD
ACCURATE_SIGNATURE_SECRET=ddysQme2PPhEeFU1HqdXLZqIoLdAePtTaIKzXMsfO53MeuKq0mJLJNWLeomYuEA8
ACCURATE_API_TOKEN=aat.NTA.eyJ2IjoxLCJ1Ijo3NDE4LCJkIjoyNjY3MjIzLCJhaSI6Njk2MDQsImFrIjoiY2IzYmZhZDctODA4Yy00NjY5LWIwOGEtYzEyMjA1MmJjZjE0IiwiYW4iOiJTbWFydEZvcndhcmRpbmciLCJhcCI6ImJhOGJkNDBlLWNhZWQtNGRiMC05YjZhLTljNjM2ZTEzMTliNCIsInQiOjE3Nzg3MTg2MjIxNTh9.6iNyb3skZE9dQYJ/fIX478j1MMkN7HsmBT34xBftDGObxgNDyHte8hBdjCqbn70Wi8ld33CS/1GH3bYw6i4UlnQlV+x+tsNKu4D2EKlHCw0mIqJVpW5dKR4L1Uv5CN+NJZhEiPs7VOYq8JxzZEpNsYARv1BDnUbc+VYGVZuISdndfwD+91kxsSeGKbm0r60dKPtZA5V9E7U=.xMjKusx67dVj2bUsxsaxmxRPl5RWFXChHAURqTnzS2Q
NEXT_PUBLIC_APP_URL=http://76.13.194.156:3000
NODE_ENV=production
EOF

# 7. Install dependencies
npm install

# 8. Generate Prisma client
npx prisma generate

# 9. Build application
npm run build

# 10. Setup PM2 to run the app
pm2 start npm --name "keyocean-fms" -- start
pm2 save
pm2 startup

# 11. Setup Nginx reverse proxy (port 80 → 3000)
cat > /etc/nginx/sites-available/keyocean << 'EOF'
server {
    listen 80;
    server_name 76.13.194.156;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/keyocean /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 12. Open firewall
ufw allow 80
ufw allow 443
ufw allow 22
ufw --force enable

echo ""
echo "✅ ============================================"
echo "✅ KeyOcean FMS berhasil di-deploy!"
echo "✅ ============================================"
echo ""
echo "🌐 Buka: http://76.13.194.156"
echo ""
echo "📋 Commands:"
echo "   pm2 status          - cek status app"
echo "   pm2 logs            - lihat logs"
echo "   pm2 restart all     - restart app"
echo "   cd /opt/ForwardingOcean && git pull && npm run build && pm2 restart all  - update"
echo ""
