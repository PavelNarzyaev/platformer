# Platformer game

## Environment (Client)
* Node.js

## Installation (Client)
* Change variable SERVER_LINK in «client/src/Server.ts»
* Change project name, description, version and author in «client/package.json»
* Run command «npm run npm-install»
* Run command «npm run server-release»
* Move files from «client/out» to your server

## Environment (Server)
* PHP 7.2 with mysqli module
* MySQL 5.7
* Nginx or Apache

## Installation (Server)
* Create MySQL database from «server/database/platformer.sql»
* Rename file «server/DataBaseConfig.php.example» to «server/DataBaseConfig.php»
* Change database connetion parameters in «server/DataBaseConfig.php»
