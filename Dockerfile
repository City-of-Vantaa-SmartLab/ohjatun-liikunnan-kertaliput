FROM node:24.11.0-alpine

ENV TZ=Europe/Helsinki
RUN rm -f /etc/localtime && ln -s /usr/share/zoneinfo/$TZ /etc/localtime

ADD ./frontend /frontend
ADD ./backend /backend

WORKDIR /frontend
RUN npm ci
RUN npm run build
RUN cp -r ./build ../backend/public

WORKDIR /backend
RUN npm ci

ENV APPLICATION_PORT=80
EXPOSE 80
CMD ["npm", "run", "start"]
