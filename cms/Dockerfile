FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Use Nginx to serve the static Vite build
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# If using React Router with client-side routing, you'd need a custom nginx config
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
