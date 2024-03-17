# stage build
FROM node:13.12.0-alpine AS builder
WORKDIR /app
COPY  . .
RUN yarn && yarn build
# stage build end

# from builder stage
FROM nginx:1.25.4-alpine3.18
COPY --from=builder /app/build /usr/share/nginx/html