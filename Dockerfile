FROM node:alpine
WORKDIR /src/bank-emailer
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm","start"]