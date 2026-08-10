FROM node:22-alpine

WORKDIR /app

# Install dependencies from lockfile when present; fall back to npm install.
COPY package.json package-lock.json* ./
COPY packages/engine/package.json ./packages/engine/
COPY packages/web/package.json ./packages/web/
COPY prototypes/meadow-v1/package.json ./prototypes/meadow-v1/
COPY prototypes/quiet-glade/package.json ./prototypes/quiet-glade/

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
