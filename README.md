```bash
# После создания файла package.json, выполните команду
npm install
```

```bash
# Build DOCKER container
docker build . -t agrow/nodejs-web-app
```

```bash
# Запуск образа с флагом -d позволяет контейнеру работать в фоновом режиме. 
# Флаг -p перенаправляет публичный порт на приватный порт внутри контейнера.
docker run -p 49160:8080 -d agrow/nodejs-web-app
```

```bash
# Отобразить все контейнеры, чтобы получить id нужного нам
$ docker ps
```

```bash
# Отобразить логи from container
$ docker logs <container_id>
```

```bash
# Войти в контейнер в интерактивном режиме
$ docker exec -it <container id> /bin/bash
```

```bash
# Deploy changes to production
ssh USER@IP_ADDRESS -p 2202 # connect to production on local desktop
## next commands run on remote server!
cd ~/divo-nodejs/ # open a folder with app
git pull origin master # get updates from git
pm2 restart server # run restart
```
