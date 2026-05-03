# Build stage
FROM node:22-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Inject environment variables if they exist
RUN if [ -f env.tmp ]; then cp env.tmp .env; fi

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Use environment variable for port (Cloud Run requires listening on $PORT)
ENV PORT=8080

# Replace the port in nginx config at runtime
CMD ["sh", "-c", "sed -i 's/listen 80;/listen '\"$PORT\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080
