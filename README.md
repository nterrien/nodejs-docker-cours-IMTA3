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

TODO