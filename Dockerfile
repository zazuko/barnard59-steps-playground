FROM docker.io/library/node:16-alpine

RUN apk add --no-cache tini

WORKDIR /app

ENV PUBLIC_BASE_URL="http://localhost:4000"
ENV PORT="4000"
EXPOSE 4000

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy the rest of the files
COPY . .

CMD [ "tini", "--", "npm", "run", "server" ]
