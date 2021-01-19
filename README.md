# Faire fonctionner le code en local sans Docker

Installer au préalable mysql et nodejs sur le pc

Ouvrir 2 terminaux

## Premier Terminal (User Service)

Aller dans le repertoire "users-service" (```cd users-service```)

Installer les dependances :
```npm install```

Executer le code permettant d'initialiser les bases de donnée SQL qui se trouve dans le fichier recreateDB.sql

Executer le code :
```npm run start```

## Deuxième Terminal (Catalog Service)

Aller dans le repertoire "catalog-service" (```cd catalog-service```)

Installer les dependances :
```npm install```

Executer le code permettant d'initialiser les bases de donnée SQL qui se trouve dans le fichier recreateDB.sql

Executer le code :
```npm run start```

## Comment s'en servir

Des exemples de requetes sont trouvable dans les fichiers requetePourTester.txt dans les deux dossiers
