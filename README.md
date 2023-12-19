### Installing (docker)

```
docker pull mohammedz666/ecomapp
```

#### For subsequent runs, just run the follwing command only

```
docker run -e "PORT=3000" -e "DB_KEY=YOUR_MONGODB_CONNECTION_STRING" -p 3000:3000 -it mohammedz666/ecomapp:latest
```
