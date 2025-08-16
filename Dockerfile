# Multi-stage build pour optimiser la taille de l'image
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Stage de production avec Nginx
FROM nginx:alpine AS production

# Copier la configuration Nginx optimisée
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_proxied expired no-cache no-store private must-revalidate proxy-revalidate max-age=0; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
}' > /etc/nginx/conf.d/default.conf

# Exposer le port 8080 (requis par Cloud Run)
EXPOSE 8080

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]