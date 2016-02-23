# hornet-js

![Presentation generale](.//architecture/hornet-flux-diagramme-5.0.png)

Le framework `Hornet` est conçu selon le principe d'`isomorphisme`, c'est à dire que le code d'une application Hornet s'exécute aussi bien dans un navigateur web que sur un serveur d'application Node.js.

Les composants techniques du framework :

* `Node.js` : plateforme logiciel d'exécution du code JavaScript côté serveur
* `Express` : bibliothèque de base pour l'écriture d'application web sur Node.js
* `Director` : composant de gestion du routage des urls sur le serveur
* `Fluxible` : composant permettant de structurer les interfaces entre les modules Flux (Actions, Stores, Vues et Dispatcher)
* `Dispachr` : composant intégré à Fluxible orienté évènement/message prenant le rôle du module Dispatcher du pattern Flux
* `React` : bibliothèque de création d'IHM html selon une logique orientée composants
* `Newforms` : bibliothèque JavaScript isomorphe de gestion de formulaires pour React
* `Superagent` : composant JavaScript pour l'exécution d'appels http
* `Webpack` : outil de création de paquetages (JavaScript, CSS, ...) pour les navigateurs web
* `Gulp` : outil pour la création de tâches de développement


## Prérequis #

* NodeJS 4.X
* hornet-js-builder 1.X installé en global:

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
    "hornet-js-components": "5.0.X",
    "hornet-js-core": "5.0.X",
    "hornet-js-ts-typings": "5.0.X",
    "hornet-js-utils": "5.0.X"
  }
```

Puis lancer la commande :

```shell
    $ hb install
```

## Pattern d’architecture Flux Isomorphique

Le schéma ci-dessous explique les responsabilités dans les grandes lignes de chaque élément.

![Pattern Flux](.//architecture/pattern-flux.png)


### <a id="Routeur"></a>Routeur

Ce composant est le point central de la navigation. Il permet de gérer de manière identique la navigation au sein de l’application que ce soit côté client (avec ou sans JavaScript) ou côté serveur.

Ce composant est configuré à partir d’un ensemble de « routes » qui viennent faire le lien entre une URL et les actions du pattern Flux (dans son implémentation isomorphe).

Le routeur d'Hornet s'appuie sur le composant [Director](https://github.com/flatiron/director).

L’isomorphisme met l'accent sur les points les suivants :

* Utilisation du mode « historique » html5 (mode `pushState` à la place de la notation `!#`) afin d’uniformiser les urls entre la partie client et serveur.
* Les actions à réaliser sont effectuées par le moteur. C'est lui qui décide si elles doivent être exécutées ou pas (voir le paragraphe sur les actions ci-dessus)

### Actions

Les actions portent les traitements de l’application. Leur réalisation est à la charge du développeur de l’application.

Les services externes sont appelés depuis les actions afin d’effectuer les traitements demandés par l’utilisateur. Les retours des services externes sont transmis aux *stores* par le biais du mécanisme de propagation via le *dispatcher*.

- _Les interfaces avec les modules du pattern Flux_

Fluxible limite le contexte d'exécution des Actions à un `ActionContext` ayant l'interface suivante :

``` java
declare class ActionContext {
    dispatch(action:String, data?:any):void;
    executeAction(action:any, payload:any, callback:any):void;
    getStore(store:typeof Store): Store;
}
```
Une action partage donc une interface avec :

- Le dispatcher
- Les actions
- Les stores

L’isomorphisme met l'accent sur les points les suivants :

* chaque *action* doit être une fonction retournant une `Promise` effectuant l’action à proprement parler (au sens métier). Ce fonctionnement est nécessaire afin de permettre au routeur :
  * de savoir quand effectuer le rendu de la page côté serveur en s’enregistrant en callback.
  * de pouvoir désactiver les actions lors du premier affichage de la page côté client pour éviter un double appel des API externes (serveur puis client).

### Dispatcher

Ce composant technique a pour vocation à recevoir les évènements émis par les *actions* aux différents *stores* qui en sont à l’écoute. Ce composant est pris en charge par le framework via la bibliothèque JavaScript [Yahoo Fluxible](https://github.com/yahoo/fluxible) qui intègre elle-même [Yahoo Dispatchr](https://github.com/yahoo/dispatchr).

Le pattern Flux met l'accent sur les points les suivants :

* Un seul évènement propagé à la fois. Cela implique :
  * que seule une action peut émettre un évènement
  * qu’une action ne peut pas émettre un deuxième évènement avant la fin du premier
  * qu’une vue ne peut pas exécuter une action suite à un évènement émis par un store
* L’exécution des *stores* associés à un événement est synchrone
* Chaque *store* doit s’enregistrer auprès du dispatcher au chargement de l'application

L’isomorphisme met l'accent sur les points les suivants :

* Le *dispatcher* doit être instancié pour chaque requête, de ce fait il doit être propagé à tous les composants qui l’utilisent (vue, actions, routeur).
* Le *dispatcher* doit proposer une méthode pour sauvegarder l’état des *stores* côté serveur et une pour les réinjecter côté client. Ceci est nécessaire afin d’éviter un double appel des services externes lors du premier chargement de la page (rendu par le serveur puis par le client).

### <a id="Stores"></a>Stores

Les stores ont pour vocation à garder en mémoire l'état courant (données techniques et métiers) de l’application.

Ils ne doivent pas appeler d’API externes (rôle dévolu aux *actions*). Les vues appellent ces composants afin de construire leur rendu quand celui-ci est dynamique.

- _Les interfaces avec les modules du pattern Flux_

Fluxible limite le contexte d'exécution des Stores à un `StoreContext` ayant l'interface suivante :

``` java
declare class StoreContext {

}
```

Un Store ne partage donc aucune interface avec les autres modules du pattern Flux. Ils doivent étendre `EventEmitter` afin de permettre aux vues de s’enregistrer

L’isomorphisme met l'accent sur les points les suivants :

* Mise en place de mécanisme de sérialisation/désérialisation afin de permettre une transmission des états interne du serveur vers le client. les méthodes sont appelées automatiquement par le dispatcher

#### <a id="Vues"></a>Vues

Les vues sont les composants servant à produire le code html affiché à l'utilisateur.

- _Les interfaces avec les modules du pattern Flux_

Fluxible limite le contexte d'exécution des composants à un `ComponentContext` ayant l'interface suivante :

``` java
declare class ComponentContext {
    executeAction(action:any, payload:any):void;
    getStore(store:typeof Store): Store;
}
```
Une vue partage donc une interface avec :

- Les actions
- Les stores

Le pattern Flux met l'accent sur les points les suivants :

* Elles ne doivent pas modifier directement l'état d'un *store*, seulement y lire des données.
* Elles peuvent exécuter des actions mais ne peuvent pas attendre de callback indiquant que l'action est terminée.

Les composants de cette brique utilisent le moteur de rendu [React](http://facebook.github.io/react/) :

* Un rendu des composants à partir d’un template JSX/TSX/JavaScript
* Une gestion des évènements permettant un binding unidirectionnel (vue -> modèle).

Les composants graphiques sont implémentés avec la librairie React et les formulaires sont décrits avec [Newforms](https://github.com/insin/newforms).


## Licence

`hornet-js` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)
