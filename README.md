После создания файла package.json, выполните команду
```bash
npm install
```

Build
```bash
docker build . -t agrow/nodejs-web-app
```

Запуск образа с флагом -d позволяет контейнеру работать в фоновом режиме. Флаг -p перенаправляет публичный порт 
на приватный порт внутри контейнера.
```bash
docker run -p 49160:8080 -d agrow/nodejs-web-app
```

Отобразить все контейнеры, чтобы получить id нужного нам
$ docker ps

Отобразить логи
$ docker logs <container_id>

Войти в контейнер в интерактивном режиме
$ docker exec -it <container id> /bin/bash