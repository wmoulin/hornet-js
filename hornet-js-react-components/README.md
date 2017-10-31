# hornet-js-react-components

hornet-js-bean fournit un module pour la gestion des composants graphiques. Les composants graphiques sont implémentés avec la librairie React.

Les composants graphique du framework :

* **Button** : Composant qui produit un élément de type submit.
* **Accordion** : Composant qui permettant d'afficher des blocs de contenu dépliables.
* **Modal** : Composant qui affiche un contenu HTML dans une popup.
* **Dropdown** : Composant qui affiche un bouton textuel ou en forme d'icône qui, au clic, ouvre un menu déroulant.
* **FooterPage** : Elément HTML qui représente le pied de page de la section.
* **AutoComplete** : Elément HTML qui fournit une liste d'options et une aide a la saisie.
* **Calendar** : Composant qui associe une zone de saisie de date avec un calendrier.
* **CheckBox** : Elément de saisie qui permet de sélectionner une valeur dans un formulaire grâce à une case à cocher.
* **Form** : Composant qui permet de créer de manière homogène des formulaires de saisie en respectant les dispositions d'accessibilité.
* **InputField** : Champs de saisie d'un formulaire.
* **Textarea** : Champs de saisie multiLigne d'un formulaire.
* **UploadFileField** : Composant qui permet de télécharger un fichier vers le serveur.
* **SelectField** : Elément HTML qui fournit une liste d'options parmi lesquelles l'utilisateur pourra choisir.
* **AutocompleteField** : Elément HTML qui fournit une liste d'options parmi lesquelles l'utilisateur pourra choisir.
* **AutocompleteMultiField** : Elément HTML qui fournit une liste d'options parmi lesquelles l'utilisateur pourra en choisir une ou plusieurs.
* **HeaderPage** : L'élément HTML  qui représente un groupe de contenu introductif.
* **ChangeLanguage** : Composant qui affiche un menu déroulant qui permet de changer la langue du site
* **BreadCrumb** : Composant qui met à jour l'affichage du fil d'ariane selon la page courante
* **Menu** : Elément HTML  qui représente un groupe de lien que l'utilisateur peut utiliser.
* **Plan** : Génère le plan de l'application à partir de la configuration de navigation.
* **Notification** : Composant qui permet d'afficher des notifications de plusieurs types (warning, error etc ).
* **pager** : Composant qui permet de faire de la pagination.
* **LayoutSwitcher** : Composant qui permet d'étendre l'espace de travail à la largeur disponible de l'écran.
* **Spinner** : Composant qui affiche le loader lors de l'execution d'une action (appel service par exemple).
* **Table** : Composant répresentant un tableau HTML (valide W3C).
* **ToolTip** :  Composant qui affiche une icône d'information qui laisse apparaitre une infobulle au survol du pointeur.



## Prérequis #

* NodeJS 6.X
* hornet-js-builder 1.X installé en global:

```shell
    $ npm install -g hornet-js-builder
```

## Initialisation #

Récupérer les sources sur projet.

Compiler les sources typescript de `hornet-js-react-components`

```shell
    $ hb compile
```

## Utilisation dans un projet #

Ajouter au package.json

```shell

  "appDependencies": {
    "hornet-js-react-components": "5.1.X",
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
