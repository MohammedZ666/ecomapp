FROM node:18.13
WORKDIR /workspace
COPY . .
RUN cd server
RUN pwd & npm install
RUN rm -rf public/*
RUN cd ../app
RUN npm install
RUN rm -rf build
RUN npm run build
RUN cp -r build/* ../server/public/
RUN cd ../server
RUN npm start
EXPOSE 3000
CMD [ "npm","start" ]
