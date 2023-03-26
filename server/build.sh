rm -rf public/*
cd ../app
rm -rf build
npm run build
cp -r build/* ../server/public/
cd ../server
npm start