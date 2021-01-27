# Faire fonctionner le code en local sans Docker

Installer au préalable mysql et nodejs sur le pc

Le code fonctionnant seulement en local est situé dans le dossier ```local```

Ouvrir 2 terminaux

## Premier Terminal (User Service)

Aller dans le repertoire "users-service" (```cd local/users-service```)

Installer les dependances :
```npm install```

Executer le code permettant d'initialiser les bases de donnée SQL qui se trouve dans le fichier recreateDB.sql

Executer le code :
```npm run start```

## Deuxième Terminal (Catalog Service)

Aller dans le repertoire "catalog-service" (```cd local/catalog-service```)

Installer les dependances :
```npm install```

Executer le code permettant d'initialiser les bases de donnée SQL qui se trouve dans le fichier recreateDB.sql

Executer le code :
```npm run start```

## Comment s'en servir

Des exemples de requetes sont trouvable dans les fichiers requetePourTester.txt dans les deux dossiers

# Faire fonctionner le code avec Docker 

Attention !!! Nous n'avons pas réussi à faire tourner le code sur Docker car nous n'arrivons pas à nous connecter à la base de données...
Voici néanmoins les étapes qui, selon nous, auraient dû marcher.

## Avec docker-compose

Tout d'abord il faut créer l'image de notre code.
Pour cela, placez vous dans le dossier ./docker/users-service et éxecutez la commande :
```docker build -t app:0.0 .```

il suffit ensuite d'éxécuter la commande suivante pour faire tourner le code :
```docker-compose up```

Malheureusement, la connection à la base de données ne se fait pas...


## Sans docker-compose

Tout d'abord il faut créer l'image de notre code.
Pour cela, placez vous dans le dossier ./docker/users-service et éxecutez la commande :
```docker build -t app:0.0 .```

nous allons ensuite créer un réseau :
```docker network create net```

il suffit maintenant de lancer la base de données dans ce réseau :
```docker run -d \
     --network net --network-alias mysql \
     -v mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=123456 \
     -e MYSQL_DATABASE=todos \
     mysql:latest```

Puis il reste à lancer notre code après que la base de données ait fini de se lancer :
```docker run -dp 3000:3000 \
   --network net \
   -e MYSQL_HOST=mysql \
   -e MYSQL_USER=root \
   -e MYSQL_PASSWORD=123456 \
   -e MYSQL_DB=todos \
   app:0.0 \```

Malheureusement, avec cette méthode non plus la connection à la base de données ne se fait pas.
