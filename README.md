This project was wrote as learning but has a useful function.
You can share one balance of fuel account with your friends.  
For example, you have OKKO Fuel account and 5 friends. Each of them add money and get fuel after that.
All dialogs will take by Telegram bot.
Administrator can handle process via REST requests and access of the Database.

At the current time it works successful and very helped me and my friends during Fuel Crisis exists. 

Production works at Digitalocean image (Ubuntu + NodeJS + MySQL + Nginx + Docker + PM2). 

![Example](example.png)

```bash
# Deploy changes to production
ssh USER@IP_ADDRESS -p 2202 # connect to production on local desktop
## next commands run on remote server!
cd ~/divo-nodejs/ # open a folder with app
git pull origin master # get updates from git
npm install # rebuild dependencies
pm2 restart /home/divo/divo-nodejs/built/server.js # run restart
```

Run this application via Docker.
- Install [Docker](https://www.docker.com/)
- For MacOS ONLY (this line): Open .env file and set DB_HOST='host.docker.internal'. Its allow Mac Docker connect app container to db container. For Ubuntu this line looks like DB_HOST='localhost'. 
- If you changed DB_HOST this build cannot work directly. Only via Docker. Or set default value DB_HOST='localhost'
- Open a folder with this project, and build the app via running a terminal command (with dot at the end) `docker build -t divo/server .`
- Start the container UBUNTU `docker run --network=host --rm -p 3000:3000 -it divo/server`
- Start the container MACOS `docker run --rm -p 3000:3000 -it divo/server`
- Start node `npm start` or `npm run dbmigrate` or `npm run test`  
- For stopping type `exit` on the terminal window

```bash
npm run dbmigrate # run migrations
```

```bash
# Show all containers for getting ID of the container.
$ docker ps
```

```bash
# Show logs from the container
$ docker logs <container_id>
```

```bash
# Entry for interaction mode.
$ docker exec -it <container id> /bin/bash
```

```bash
docker-compose build # build container with database
docker-compose up # run container with database
```

```bash
docker stop $(docker ps -a -q) # Stop all running containers
docker rm $(docker ps -a -q) # Delete all stopped containers
docker system prune -a # remove all containers and images
```