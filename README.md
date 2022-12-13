Comandos utilizados:
* **Nodemon:**
    1. Fork: nodemon .
    2. Cluster: nodemon . -m cluster
* **Forever:**
    1. Fork: forever start server.js --watch
    2. Cluster: forever start server.js -m cluster --watch
    3. Listar procesos: forever list
    4. Finalización: forever stopall
* **PM2:**
    1. Fork: pm2 start server.js  --watch 
    2. Cluster: pm2 start server.js --watch -i max
    3. Listar procesos: pm2 list
    4. Finalización: pm2 stop all