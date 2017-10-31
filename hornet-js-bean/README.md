# hornet-js-bean

hornet-js-bean fournit un module pour la gestion des beans afin de faire du mapping entre objets.
Ce module est basé sur les annotations *@Bean* et *@Map*.

## Prérequis #

* NodeJS 6.X
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
    "hornet-js-bean": "5.1.X"
  }
```

Puis lancer la commande :

```shell
    $ hb install
```

### Définition d'un Bean Hornet

voici un exemple de configuration d'un objet métier:
on déclare notre objet en tant que bean hornet à l'aide de @Bean.
Puis, on définit les champs que l'on veut mapper.


```javascript

import Bean from "hornet-js-bean/src/decorators/Bean";
import Map from "hornet-js-bean/src/decorators/Map";

@Bean
export class ObjetMetier {

    @Map()
    id: number = 0;

    @Map()
    nom: string;

    desc: string = 'dummy';
}

```

## Utilisation du mapper

Le projet hornet-js-bean fournit une classe *BeanUtils* qui fournit des opérateurs sur les Beans Hornet.
Tous ces opérateurs renvoient une Promise.

* **mapObject** : Méthode statique qui permet de mapper un objet <source> vers un objet de type <targetClass>
* **mapArray** : Méthode statique qui permet de mapper un tableau <source> vers un tableau de type <targetClass>
* **map** : Méthode statique qui permet de mapper une instance <source> vers un objet de type <targetClass>
* **serializeObject** : Méthode statique qui permet de sérialiser un objet <source> vers un objet de type <targetClass>
* **serializeArray** : Méthode statique qui permet de sérialiser un tableau <source> vers un tableau de type <targetClass>
* **serialize** : Méthode statique qui permet de sérialiser une instance <source> vers un objet de type <targetClass>
* **cloneObject** : Méthode statique qui permet de cloner un objet <source> vers un nouvel objet de même type
* **cloneArray** : Méthode statique qui permet de cloner un tableau <source> vers un nouveau tableau de même type
* **clone** : Méthode statique qui permet de cloner une instance <source> vers un nouvel objet de même type

Voici un exemple qui permet de créer un objet ObjetMetier à partir d'un objet existant.

```javascript

import {BeanUtils} from "hornet-js-bean/src/bean-utils";

...
let source = {
    id : 1,
    nom : 'nom',
    prenom: 'prenom',
    desc : 'desc'};

BeanUtils.mapObject(ObjetMetier,source).then((result:ObjetMetier) =>{
    result.id //<= 1
    result.nom //<= 'nom'
    result.desc //<= 'dummy'
    //l'attribut prénom n'existe pas dans result
});
...

```

### Utilisation du mapper via l'annotation @Map sur une Promise

si une fonction renvoie une promesse de résultat, il est possible de chainer le mapping de deux façons:

```javascript

    getObjetMetier() : Promise<ObjetMetier>{
        return New Promise<>(resolve, reject).then((source) => {
            return BeanUtils.mapObject(ObjetMetier,source))
        }
    }

est équivalent à

    @Map(ObjetMetier)
    getObjetMetier() : Promise<ObjetMetier>{
        return New Promise<>(resolve, reject)
    }
```

### Utilisation du mapper via l'annotation @Map sur les paramètres d'une fonction qui renvoie une Promise


Pour transformer un object metier en DTO par exemple, on peut procéder de la manière suivante:
Attention, il ne faut pas oublier de mettre une annotation sur la fonction pour lui dire de faire la transformation!

```javascript

    @Map()
    getObjetMetier(@Map(ObjectDTO)metier) : Promise<ObjetMetier>{
        //ici metier sera transformé automatiquement en un objetDTO
        return insert(metier)
    }
```

### Utilisation du mapper avec des alias

Il se peut que les noms des attributs diffèrent entre l'objet source et l'object de destination
L'annotation @Alias permet de configurer 1 ou plusieurs alias (l'ordre est important ici=>Le premier qui match est retenu).
Reprenons l'exemple ci-dessus:

```javascript

@Bean
export class ObjetMetier {

    @Map()
    id: number = 0;

    @Map()
    nom: string;

    @Map()
    @Alias('description')
    desc: string = 'dummy';
}

import {BeanUtils} from "hornet-js-bean/src/bean-utils";

...
let source = {
    id : 1,
    nom : 'nom',
    prenom: 'prenom',
    description : 'desc'};

BeanUtils.mapObject(ObjetMetier,source).then((result:ObjetMetier) =>{
    result.id //<= 1
    result.nom //<= 'nom'
    result.desc //<= 'desc'
});
...

```

## Licence

`hornet-js-bean` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)
