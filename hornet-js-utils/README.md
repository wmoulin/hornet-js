# hornet-js-utils


Le module `hornet-js-utils` comporte une collection de classes utilitaires.

Les utilitaires  :

* **logger** : Construit un logger avec la catégory demandée
* **authentication-utils** : Méthodes pour l'authentification
* **date-utils** : Méthodes pour manipuler les dates
* **string-utils**  : Methodes pour manipuler les Strings
* **object-utils** : Methodes pour manipuler des objects
* **json-loader** : Methodes pour manipuler des flux json
* **etc**

## Prérequis #

- `nodejs` 6.X
- `hornet-js-builder` 1.X installé en global

```shell
    $ npm install -g hornet-js-builder
```

## Initialisation #

Récupérer les sources sur projet.

Compiler les sources typescript de `hornet.js`

```shell
    $ hb compile
```

## Utilisation dans un projet #

Ajouter au package.json

```shell
  "appDependencies": {
    "hornet-js-core": "5.1.X",
    "hornet-js-ts-typings": "5.1.X",
    "hornet-js-utils": "5.1.X"
  }
```

Puis lancer la commande :

```shell
    $ hb install
```

## Licence

`hornet-js` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)
