# hornet-js-component

Ce module est un composant de haut niveau qui comporte:

* La gestion de la navigation dans le menu en fonction des rôles de  l'utilisateur
* Une énumération des codes clavier pour la gestion des RGA
* L'interface correspondant à une page
* L'interface correspondant aux propriétés d'un élément de menu
* etc

## Prérequis #

* NodeJS 6.X
* hornet-js-builder 1.X installé en global:

```shell
    $ npm install -g hornet-js-builder
```

## Initialisation #

Récupérer les sources du projet.

Compiler les sources typescript de `hornet.js`

```shell
    $ hb compile
```

## Utilisation dans un projet #

Ajouter au package.json

```shell
  "appDependencies": {
    "hornet-js-components": "5.1.X"
  }
```

Puis lancer la commande :

```shell
    $ hb install
```

## Licence

`hornet-js-component` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)
