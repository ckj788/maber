FROM node:20-slim

# 字体 + Chromium 依赖（中文/emoji + headless 依赖）
RUN apt-get update && apt-get install -y \
  fonts-noto-cjk fonts-noto-color-emoji \
  libnss3 libxss1 libasound2 libxshmfence1 libatk-bridge2.0-0 libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 8787
CMD ["npm","start"]
