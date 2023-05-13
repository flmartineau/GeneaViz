# GeneaViz

GeneaViz est une application de visualisation d'arbres généalogiques qui permet de charger et d'afficher des données de fichiers GEDCOM.

## Fonctionnalités

- Chargement de fichiers GEDCOM
- Visualisation des individus et de leurs relations
- Zoom et déplacement dans l'arbre généalogique
- Sélection d'un individu pour afficher plus d'informations

## Installation

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) sur votre machine.

Clonez le dépôt :

`git clone https://github.com/flmartineau/GeneaViz.git`


Accédez au répertoire du projet :

`cd GeneaViz`

Installez les dépendances :

`npm install`


## Configuration clé API OpenAI (optionnel)

Pour un individu, il est possible d'afficher une biographie générée avec le modèle GPT d'OpenAI.
Pour cela, il est nécessaire d'ajouter une clé API OpenAI (vous pouvez en récupérer une à cetta adresse : https://platform.openai.com/account/api-keys) :

1. Créez un fichier à la racine de votre projet et nommez-le `.env`.
2. Ouvrez le fichier `.env` et ajoutez votre clé API de la manière suivante : `REACT_APP_OPENAI_API_KEY=votre_clé_api_ici`

**Note :** Remplacez `votre_clé_api_ici` par votre véritable clé API.

## Utilisation

Pour démarrer l'application en mode de développement, exécutez :

`npm start`


Ouvrez votre navigateur et accédez à [http://localhost:3000](http://localhost:3000) pour voir l'application en action.

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.
