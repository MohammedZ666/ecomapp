FROM node:14.9
WORKDIR /workspace
COPY . .
RUN cd server;npm install;rm -rf public/*;cd ../app;npm install;rm -rf build;npm run build;cp -r build/* ../server/public/
EXPOSE 3000
CMD cd server;npm start
