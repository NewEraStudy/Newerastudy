# StudyMaster Deployment Guide

Complete guide to deploying StudyMaster on various platforms.

## Quick Start (Choose One)

1. **GitHub Pages** - Free, easy, recommended for beginners
2. **Vercel** - Free, automatic deployments, great for developers
3. **Netlify** - Free, drag-and-drop, very user-friendly
4. **Custom Server** - Full control, requires server management

---

## 1. GitHub Pages (Recommended for Beginners)

### Prerequisites
- GitHub account
- Git installed on your computer

### Step-by-Step Instructions

#### A. Create Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Name it: `studymaster` (or any name you prefer)
4. Make it Public
5. Don't initialize with README (we already have one)
6. Click "Create repository"

#### B. Push Your Code

```bash
# Navigate to your project folder
cd path/to/studymaster

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - StudyMaster v1.0"

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/studymaster.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### C. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" section (left sidebar)
4. Under "Source", select branch: `main`
5. Select folder: `/ (root)`
6. Click "Save"
7. Wait 1-2 minutes
8. Your site will be live at: `https://YOUR-USERNAME.github.io/studymaster`

#### D. Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In GitHub Pages settings, enter your custom domain
3. In your domain registrar, add these DNS records:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   
   Type: A
   Host: @
   Value: 185.199.109.153
   
   Type: A
   Host: @
   Value: 185.199.110.153
   
   Type: A
   Host: @
   Value: 185.199.111.153
   
   Type: CNAME
   Host: www
   Value: YOUR-USERNAME.github.io
   ```
4. Wait for DNS propagation (up to 24 hours)

### Updating Your Site

```bash
# Make your changes
# Then:
git add .
git commit -m "Description of changes"
git push
```

Changes will be live in 1-2 minutes!

---

## 2. Vercel (Recommended for Developers)

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free)

### Deployment Steps

#### Method 1: Vercel Dashboard (Easiest)

1. Push your code to GitHub (see GitHub Pages steps A & B above)
2. Go to [Vercel](https://vercel.com)
3. Click "Sign Up" and connect your GitHub
4. Click "New Project"
5. Import your `studymaster` repository
6. Click "Deploy"
7. Done! Your site is live at: `https://studymaster-xxx.vercel.app`

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to your project
cd path/to/studymaster

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? studymaster
# - In which directory is your code located? ./
# - Auto-detected settings? Yes

# Your site is now live!
```

### Custom Domain on Vercel

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your domain
4. Update DNS records as Vercel instructs
5. SSL certificate automatically configured!

### Environment Variables (Future Use)

```bash
# For when you add a backend
vercel env add API_URL
# Enter value: https://api.studymaster.com
```

---

## 3. Netlify (Easiest Drag & Drop)

### Method 1: Drag & Drop (Fastest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your project folder onto the page
3. Done! Your site is live immediately
4. Note: URL will be random (e.g., `happy-panda-123.netlify.app`)

### Method 2: Netlify Dashboard

1. Push code to GitHub (see GitHub Pages steps A & B)
2. Go to [Netlify](https://netlify.com)
3. Click "Sign up" and connect GitHub
4. Click "New site from Git"
5. Choose GitHub and select repository
6. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
7. Click "Deploy site"
8. Live at: `https://random-name.netlify.app`

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Custom Domain on Netlify

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain
4. Update DNS:
   ```
   Type: A
   Host: @
   Value: 75.2.60.5
   
   Type: CNAME
   Host: www
   Value: YOUR-SITE.netlify.app
   ```
5. Enable HTTPS (automatic)

### Netlify Features

```toml
# netlify.toml (create this file for advanced config)
[build]
  publish = "/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## 4. Firebase Hosting

### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Select options:
# - What do you want to use as public directory? ./
# - Configure as single-page app? No
# - Set up automatic builds with GitHub? (optional) Yes

# Deploy
firebase deploy --only hosting
```

### Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow verification steps
4. Firebase handles SSL automatically

---

## 5. AWS S3 + CloudFront

### Prerequisites
- AWS account
- AWS CLI installed

### S3 Setup

```bash
# Create bucket
aws s3 mb s3://studymaster

# Upload files
aws s3 sync . s3://studymaster --exclude ".git/*"

# Enable static website hosting
aws s3 website s3://studymaster \
  --index-document index.html \
  --error-document index.html

# Set bucket policy (make public)
aws s3api put-bucket-policy \
  --bucket studymaster \
  --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::studymaster/*"
  }]
}
```

### CloudFront Setup (CDN + HTTPS)

1. Go to CloudFront console
2. Create distribution
3. Origin: Your S3 bucket URL
4. Enable "Redirect HTTP to HTTPS"
5. Custom SSL certificate (from ACM)
6. Create distribution
7. Wait 10-15 minutes for deployment

---

## 6. Self-Hosted Server

### Simple HTTP Server

#### Python
```bash
# Python 3
python -m http.server 8000

# Access at: http://localhost:8000
```

#### Node.js
```bash
# Install http-server
npm install -g http-server

# Run
http-server -p 8000

# Access at: http://localhost:8000
```

### Apache Server

1. Install Apache
2. Copy files to `/var/www/html/studymaster/`
3. Create virtual host:

```apache
<VirtualHost *:80>
    ServerName studymaster.com
    DocumentRoot /var/www/html/studymaster
    
    <Directory /var/www/html/studymaster>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

4. Enable site and restart Apache

### Nginx Server

```nginx
server {
    listen 80;
    server_name studymaster.com;
    root /var/www/studymaster;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot

# For Nginx
sudo certbot --nginx -d studymaster.com

# For Apache
sudo certbot --apache -d studymaster.com
```

---

## 7. Docker Deployment

### Dockerfile

```dockerfile
FROM nginx:alpine

# Copy files
COPY . /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
# Build image
docker build -t studymaster .

# Run container
docker run -d -p 8080:80 studymaster

# Access at: http://localhost:8080
```

### Docker Compose

```yaml
version: '3'
services:
  studymaster:
    build: .
    ports:
      - "8080:80"
    restart: always
```

```bash
# Run
docker-compose up -d
```

---

## Performance Optimization

### 1. Enable Compression

#### Netlify
Automatic!

#### Nginx
```nginx
gzip on;
gzip_types text/css application/javascript application/json;
```

#### Apache
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### 2. Add Caching Headers

#### Netlify (_headers file)
```
/*
  Cache-Control: public, max-age=31536000
  
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

#### Nginx
```nginx
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN Configuration

Use CDN for external libraries:
- Chart.js: Already using CDN ✓
- Font Awesome: Already using CDN ✓
- Google Fonts: Already using CDN ✓

---

## Monitoring

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://pingdom.com) - Paid
- [StatusCake](https://statuscake.com) - Free/Paid

### Analytics (Optional)
- Google Analytics
- Plausible (privacy-friendly)
- Simple Analytics

### Error Tracking
- Sentry (free tier)
- LogRocket

---

## Troubleshooting

### Site Not Loading

**Check:**
1. DNS propagation (use [dnschecker.org](https://dnschecker.org))
2. SSL certificate status
3. Firewall settings
4. Console errors (F12)

### LocalStorage Not Working

**Possible causes:**
- Private/Incognito mode
- Browser storage quota exceeded
- Browser security settings

**Solution:**
```javascript
// Test localStorage
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage working');
} catch(e) {
    console.error('localStorage not available:', e);
}
```

### Charts Not Displaying

**Check:**
1. Chart.js CDN loaded
2. Canvas elements present
3. Console for errors

---

## Backup Strategy

### Automatic Backups

For localStorage data, create export functionality:

```javascript
// Export all data
function exportData() {
    const data = {
        users: localStorage.getItem('users'),
        currentUser: localStorage.getItem('currentUser'),
        userData: localStorage.getItem(`userData_${userId}`)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], 
        {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymaster-backup-${Date.now()}.json`;
    a.click();
}
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No sensitive data in client code
- [ ] Regular dependency updates
- [ ] Content Security Policy (CSP)

### Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Cost Comparison

| Platform | Free Tier | Bandwidth | Custom Domain | SSL |
|----------|-----------|-----------|---------------|-----|
| GitHub Pages | ✅ Unlimited | 100GB/month | ✅ | ✅ |
| Vercel | ✅ | 100GB/month | ✅ | ✅ |
| Netlify | ✅ | 100GB/month | ✅ | ✅ |
| Firebase | ✅ | 10GB/month | ✅ | ✅ |
| AWS S3 | 12 months | 5GB/month* | ✅ | ✅* |

*Additional costs may apply

---

## Next Steps

1. Choose a platform
2. Deploy following the guide above
3. Test thoroughly
4. Set up monitoring
5. Share with users!

Need help? Check our [GitHub Discussions](https://github.com/yourusername/studymaster/discussions)

---

**Happy Deploying! 🚀**
