# ecomapp

This is an e-commerce platform developed with the MERN stack. Github CI/CD was used to build and deploy the project to Docker. 

![image](https://github.com/MohammedZ666/ecomapp/assets/50874919/87b4244e-b4c3-4dcf-8587-d567d81585f4)

## Features:
* User login/registration, multi-product-based orders, product query with category/keywords, cart system, and commenting on product pages.
* Cart system remembering the last interrupted session.
* Email notifications on order updates to users.
* And other standard ecommerce app features.

## Installing (docker)

```
docker pull mohammedz666/ecomapp
```

### For subsequent runs, just run the follwing command only

```
docker run -e "PORT=3000" -e "DB_KEY=YOUR_MONGODB_CONNECTION_STRING" -e "USER=YOUR_SERVICE_EMAIL" -e "PASS=YOUR_SERVICE_EMAIL_PASSWORD" -p 3000:3000 -it mohammedz666/ecomapp:latest
```
