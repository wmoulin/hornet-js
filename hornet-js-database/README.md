# hornet-js-database

hornet-js-database fournit un module pour la gestion des connexions à une base de données (postgresql, sqlserver, ...).

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
    "hornet-js-database": "5.1.X"
  }
```

Puis lancer la commande :

```shell
    $ hb install
```

## Définition d'un service transactionel

Un service transactionel est une méthode, principalement de la couche service, dans laquelle toutes les actions sur les données
via les différents DAO, sont encapsulées dans une même transaction. Si un incident se produit, le rollback de la
transaction annule toutes les actions précédentes. Si aucun incident ne survient, toutes les actions sont validées
grâce à un commit en fin de transaction.

voici un exemple de service transactionel :
La méthode "service" est annotée avec le descriptor @Transactional()


```javascript
@Transactional()
    private suppressionDunPartenaire(id: number): Promise<any> {
        return this.produitPartenaireDAO.supprimerProduitByPartenaire(id).then((data) => {
            return this.partenaireDAO.deleteByIdIfNotVIP(id);
        });
    }
```

## Licence

`hornet-js-database` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)

