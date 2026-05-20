# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# In Docker, the nginx layer proxies /api to the server service, so a relative base URL is correct.
ENV VITE_API_BASE_URL=/api
RUN npm run build

# --- runtime: nginx ---
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
