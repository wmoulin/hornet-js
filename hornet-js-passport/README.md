# hornet-js-passport

hornet-js-passport fournit un module pour la gestion des droits d'accès pour les applications HornetJS.

Ce module est basé sur *PassportJs* qui est un Middleware d'authentification pour NodeJs, il propose donc des stratégies, ainsi que des middlewares Express pour simplifier son utilisation.


## Prérequis #

* NodeJS 6.X
* hornet-js-builder 1.X installé en global:

```shell
    $ npm install -g hornet-js-builder
```

## Initialisation #

Récupérer les sources sur projet.

Compiler les sources typescript de `hornet-js-passport`

```shell
    $ hb compile
```

## Utilisation dans un projet #

Ajouter au package.json

```shell

  "appDependencies": {
    "hornet-js-passport": "5.1.X",
  }
  
```

Puis lancer la commande :

```shell

    $ hb install
    
```

## PassportJs et Stratégies

PassportJS s'appuie sur des stratégies d'authentification. Une même instance de ce Middleware peut gérer plusieurs stratégies, dés qu'une a pû permettre de s'authentifier, les suivantes ne sont pas exécutées.

### Présentation et mise en place

Tout d'abord il faut instancier PassportJs et lui fournir les méthodes de sérialisation et désérialisation :

```javascript

import passport = require('passport');
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

```

Dans cet exemple aucune sérialisation/désérialisation est faite, le user est complet dans la session, mais nous aurions pu, par exemple, sauvegarder l'utilisateur en base et ne mettre que son id dans la session lors de la sérialisation, et le récupérer de la base pour le mettre dans la session lors de la désérialisation.

Ensuite il faut préciser la ou les stratégies à utiliser, exemple :

```javascript

passport.use(new authentication.StrategyArobas());

```

A l'appel de la méthode *authenticate*, 'PassportJs' appelle la méthode *authenticate* sur la stratégie, tout en ayant auparavent ajouté dynamiquement sur cette dernière les méthodes suivantes :
* succes
* fail
* redirect
* pass
* error

Maintenant nous avons une instance de PassPortJs prête à être utilisée, mais attention, elle peut avoir besoin de s'appuyer sur d'autres middlewares suivant les cas (LocalStrategy utilise Flash pour échanger les erreurs entre les Middlewares ou les requêtes).
La position des Middlewares est importante, elle induit l'ordre d'exécution. Dans la plus part des cas l'utilisateur sera sauvegardé en session, donc l'ajout des Middlewares devra se faire apprès celui gérant la session, exemple :

```javascript

server.use(flash()); // middleware d'échange d'information (passe par la session)
server.use(passport.session()); // charge le user présent dans la session
server.get(utils.buildContextPath('/logout'), function (req, res, next) { //déconnexion
    req.logout();
    res.redirect(307, utils.buildContextPath('/'));
});
server.use(function ensureAuthenticated(req, res, next) { // test si l'utilisateur est déjà connecté, sinon demande une authentification
    if (req.isAuthenticated()) {
        return next();
    }
    passport.authenticate('cas')(req, res, next);
});

```

## Surcouches

Afin de simplifier toute cette mise en place et l'instanciation des différents middleware, une surcouche a été mise en place. Elle s'appuit sur un objet static pour la configuration et un middleware unique gérant les différentes phases de connexion.

La couche d'authentification s'appuie sur un objet de configuration simple pour gérer les phases de connexion, contenant l'url de connexion et de déconnexion :

* appLoginPath : url relative de l'application déclenchant le process de connexion.
* appLogoutPath : url relative de l'application déclenchant le process de déconnexion.

On instancie le module d'authentification et on lui ajoute les stratégies d'authentification.

### Les Stratégies

#### SAML

Cette stratégie s'appuie sur la classe de configuration *hornet-js-passport/src/cas/cas-configuration*, et l'initialisation des différents attributs est faite lors de l'instanciation de l'objet de configuration :

- **`logoutCallbackUrl`**: Page de déconnexion de l'application
- **`hostUrlReturnTo`**: Nom du serveur applicatif par défaut
- **`callbackUrl`**: URL Identity Provider (IDP) -> Service Provider (SP)
- **`issuer`**: Chaîne permettant à l'application d'être identifiée par l'IDP (url de l'application)
- **`certSignature`**: Certificat de l'application
- **`decryptionPvk`**: Clé privée optionnelle utilisée pour tenter de décrypter toutes les assertions chiffrées
- **`privateCert`**: Certificat de fournisseur de services
- **`availableIdp`**: IDPs déclarés au sein de l'application: objet de type `IdentityProviderProps` ou tableau d'objet de type `IdentityProviderProps`
- **`verifyFunction`**: Fonction de callback permettant de traiter la réponse du flux SAML

##### Propriétés de l'/des IDP(s): `availableIdp`

Le module `passport-saml` permet la gestion d'un ou plusieurs IDP. Lors de sa déclaration, il peut être de la forme d'un objet ou d'un tableau d'objets:

- **`name`**: Nom de l'IDP
- **`shibbolethUrl`**: URL pointant vers le fichier des metadata liés à l'IDP
- **`httpsCert`**: Certificat de l'IDP

Ces 3 propriétés sont suffisantes pour la configuration d'un IDP.
Un Parser SAML permet ensuite de récupérer les informations utiles à la connexion/déconnexion auprès de l'IDP. Ces informations sont présentes dans le fichier metadata mis à disposition depuis l'url `shibbolethUrl`. Le parser permet alors de récupérer:

- **`entryPoint`**: adresse de redirection vers l'IDP lors de l'authentification
- **`logoutUrl`**: adresse de redirection vers l'IDP lors de la déconnexion
- **`certSignature`**: Certificat de chiffrement pour la signature de l'IDP
- **`certChiffrement`**: Certificat de chiffrement de l'IDP

##### Certificat (`certSignature`) et clé applicatifs (`privateCert`)

ils peuvent être générés via la commande:

```shell

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900

```


Ensuite on instancie simplement la stratégie avec cette objet de configuration.

##### Exemple d'utilisation pour une application

Dans le fichier de configuration de l'application **default.json** :

```javascript

"saml": {
  "enabled": true,
  "configuration": {
    "hostUrlReturnTo": "http://localhost:8888",
    "callbackUrl": "/login",
    "logoutCallbackUrl": "/logout",
    "issuer": "http://localhost:8888/applitutoriel",
    "idp": [
      {
        "name": "toto",
        "shibbolethUrl": "{metadata-idp.xml}",
      }
    ,{
        "name": "titi",
        "shibbolethUrl": "{metadata-idp.xml}",
      }
    ]
  }
}

```

il faut rajouter également au niveau de la sécurité csp, la configuration suivante:

```js
"formAction": [
  "'self'",
  "{hostName de l'IDP}"
],

```

Dans le fichier **server.ts** :

```javascript

// Authent passport
import { PassportAuthentication } from "hornet-js-passport/src/passport-authentication";
import { AuthenticationtConfiguration } from "hornet-js-passport/src/authentication-configuration";
// Cas
import { SamlConfiguration } from "hornet-js-passport/src/strategy/saml/saml-configuration";
import { SamlStrategy } from "hornet-js-passport/src/strategy/saml/saml-strategy";

let configAuth = new AuthenticationtConfiguration(
Utils.config.get("authentication.loginUrl"),
Utils.config.get("authentication.logoutUrl"));

let authent = new PassportAuthentication(configAuth);

// Ajout du middleware d'authentification (passport-saml)
let configuration = new SamlConfiguration(
    Utils.config.get("authentication.saml.configuration.callbackUrl"),
    Utils.config.get("authentication.saml.configuration.logoutCallbackUrl"),
    // Page de retour par défaut
    Utils.config.get("authentication.saml.configuration.hostUrlReturnTo"),
    // Usually specified as `/shibboleth` from site root
    Utils.config.get("authentication.saml.configuration.issuer"),
    // Certificat applicatif
    fs.readFileSync(__dirname + "/../config/cert/cert.pem", "utf8"),
    // Clé privée de décryptage
    fs.readFileSync(__dirname + "/../config/cert/key.pem", "utf8"),
    Utils.config.get("authentication.saml.configuration.idp")
);

authent.initStrategy(new SamlStrategy(configuration));


var server = new Server(configServer, hornetMiddlewareList);
server.start();

```

#### CAS (Deprecated)

Cette stratégie s'appuie sur la classe de configuration *hornet-js-passport/src/cas/cas-configuration*, et l'initialisation des différents attributs est faite lors de l'instanciation de l'objet de configuration :

* appLoginPath : url relative de l'application déclenchant le process de connexion.
* appLogoutPath : url relative de l'application déclenchant le process de déconnexion.
* hostUrlReturnTo : url de retour après authentification sur le CAS.
* casValidateUrl : url absolue du service de validation des tichets CAS.
* casLoginUrl : url absolue de connexion du CAS.
* casLogoutUrl : url absolue de déconnexion du CAS.
* verifyFunction (facultatif) : fonction à utiliser pour la récupération/vérification des infos de l'utilisateur (par défaut, c'est celle qui est définie dans la stratégie (getUserInfo) qui s'applique

Cette stratégie reprend les principes de connexion à CAS, elle est donc réutilisable pour n'importe quel serveur CAS.

1. Vérifie la présence d'un ticket à valider, sinon appelle la méthode 'pass' de la stratégie (PassportJs), qui appelle le middleware suivant et fin.
2. Lance la validation du ticket avec l'url fournie dans la configuration.
3. Réception de la réponse CAS. Si il y a eu une erreur, appel du middleware de gestion des erreurs.
4. Utilise la fonction verifyAuthentication pour vérifier l'utilisateur (ne fait rien par défaut), puis appelle 'success' sur la stratégie (PassportJs).


Ensuite on instancie simplement la stratégie avec cette objet de configuration.

##### Exemple d'utilisation pour une application

Dans le fichier de configuration de l'application **default.json** :

```javascript

  "authentication": {
    "loginUrl": "/login",
    "logoutUrl": "/logout",
    "cas": {
      "configuration": {
        "hostUrlReturnTo": "http://localhost:8888",
        "urls": {
          "casValidate": "http://cas-server-dns/cas-server/serviceValidate",
          "casLogin": "http://cas-server-dns/cas-server/login",
          "casLogout": "http://cas-server-dns/cas-server/logout"
        }
      }
    }
  }

```


Dans le fichier **server.ts** :

```javascript

// Authent passport
import { PassportAuthentication } from "hornet-js-passport/src/passport-authentication";
import { AuthenticationtConfiguration } from "hornet-js-passport/src/authentication-configuration";
// Cas
import { CasConfiguration } from "hornet-js-passport/src/strategy/cas/cas-configuration";
import { CasStrategy } from "hornet-js-passport/src/strategy/cas/cas-strategy";

let configAuth = new AuthenticationtConfiguration(
Utils.config.get("authentication.loginUrl"),
Utils.config.get("authentication.logoutUrl"));

let authent = new PassportAuthentication(configAuth);

let configuration = new CasConfiguration(
    Utils.config.get("authentication.loginUrl"),
    Utils.config.get("authentication.logoutUrl"),
    Utils.config.get("authentication.cas.configuration.hostUrlReturnTo"),
    Utils.config.get("authentication.cas.configuration.urls.casValidate"),
    Utils.config.get("authentication.cas.configuration.urls.casLogin"),
    Utils.config.get("authentication.cas.configuration.urls.casLogout"),
    (login, done) => {
        // mock d'un user avec role ADMIN
        return done(null, {name: login, roles: [{name: Roles.ADMIN_STR}]});
    }
);

authent.initStrategy(new CasStrategy(configuration));
hornetMiddlewareList.addAfter(authent.getMiddleware(), HornetMiddlewares.SessionMiddleware);


var server = new Server(configServer, hornetMiddlewareList);
server.start();

```


## Licence


`hornet-js-passport` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)