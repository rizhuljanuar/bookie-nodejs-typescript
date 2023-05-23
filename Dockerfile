FROM node:19-alpine

# Create app directory
WORKDIR /app

# Install app dependecies
COPY package.json pnpm-lock.yaml ./
ENV PNPM_HOME="/home/zhul/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install -g pnpm
RUN pnpm i
RUN pnpm add --global ts-node

# Copy source files
COPY . .
