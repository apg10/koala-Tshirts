FROM node:20-slim

WORKDIR /app

COPY package.json .
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN npm install @rollup/rollup-linux-x64-gnu

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
