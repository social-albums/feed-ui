# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---- Desarrollo (Vite con hot reload) ----
FROM base AS dev
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ---- Build ----
FROM base AS build
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
# Las variables VITE_* se embeben en el bundle en tiempo de build
ARG VITE_AUTH_URL
ARG VITE_FEED_URL
ARG VITE_CONTENT_URL
ARG VITE_SOCIAL_URL
ARG VITE_NOTIFICATION_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL \
    VITE_FEED_URL=$VITE_FEED_URL \
    VITE_CONTENT_URL=$VITE_CONTENT_URL \
    VITE_SOCIAL_URL=$VITE_SOCIAL_URL \
    VITE_NOTIFICATION_URL=$VITE_NOTIFICATION_URL
RUN npm run build

# ---- Producción (Nginx sirviendo estáticos) ----
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
