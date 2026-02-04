FROM node:24.11.0-alpine
ENV TZ=Europe/Helsinki
RUN rm -f /etc/localtime && ln -s /usr/share/zoneinfo/$TZ /etc/localtime
WORKDIR /backend
COPY package*.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]
