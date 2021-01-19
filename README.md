# Faire fonctionner le code en local sans Docker

Installer au préalable mysql et nodejs sur le pc

Ouvrir 2 terminals

## Premier Terminal (User Service)

Aller dans le repertoire "users-service" (```cd users-service```)

Installer les dependances :
```npm install package.json```

Executer le code permettant d'initialiser les bases de donnée SQL qui se trouve dans le fichier recreateDB.sql

Executer le code :
```nodemon src/index.ts```

## Deuxième Terminal (Catalog Service)

Aller dans le repertoire "catalog-service" (```cd catalog-service```)

Installer les dependances :
```npm install package.json```

Executer le code permettant d'initialiser les bases de donnée SQL qui se trouve dans le fichier recreateDB.sql

Executer le code :
```nodemon src/index.ts```

## Comment s'en servir

Des exemples de requetes sont trouvable dans les fichiers requetePourTester.txt dans les deux dossiers