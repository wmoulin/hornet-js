# hornet-js-cas

hornet-js-cas fournit un module pour la gestion des droits d'accès pour les applications HornetJS utilisant CAS.

Ce module est basé sur *PassportJs* qui est un Middleware d'authentification pour NodeJs, il propose donc des stratégies, ainsi que des middlewares Express pour simplifier son utilisation.

Le mode à mettre en place pour une utilisation avec un serveur CAS est **CAS générique (accès direct à un serveur CAS)**.

### PassportJs et Stratégies

PassportJS s'appuie sur des stratégies d'authentification. Une même instance de ce Middleware peut gérer plusieurs stratégies, dés qu'une a pû permettre de s'authentifier, les suivantes ne sont pas exécutées.

#### Présentation et mise en place

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

Dans cette exemple aucune sérialisation/désérialisation est faite, le user est complet dans la session, mais nous aurions pu, par exemple, sauvegarder l'utilisateur en base et ne mettre que son id dans la session lors de la sérialisation, et le récupérer de la base pour le mettre dans la session lors de la désérialisation.

Ensuite il faut préciser la ou les stratégies à utiliser, exemple :

```javascript

passport.use(new authentication.Strategy());

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

### Surcouches

Afin de simplifier toute cette mise en place et l'instanciation des différents middleware, une surcouche a été mise en place. Elle s'appuit sur un objet static pour la configuration et un middleware unique gérant les différentes phases de connexion.

#### CAS générique (accès direct à un serveur CAS)

La stratégie et la surcouche s'appuient sur la classe de configuration *hornet-js-cas/src/cas-configuration*, et l'initialisation des différents attributs est faite lors de l'instanciation de l'objet de configuration :

* appLoginPath : url relative de l'application déclenchant le process de connexion.
* appLogoutPath : url relative de l'application déclenchant le process de déconnexion.
* hostUrlReturnTo : url de retour après authentification sur le CAS.
* casValidateUrl : url absolue du service de validation des tichets CAS.
* casLoginUrl : url absolue de connexion du CAS.
* casLogoutUrl : url absolue de déconnexion du CAS.
* verifyFunction (facultatif) : fonction à utiliser pour la récupération/vérification des infos de l'utilisateur (par défaut, c'est celle qui est définie dans la stratégie (getUserInfo) qui s'applique


##### Statégie (cas-strategy.ts)

Cette stratégie reprend les principes de connexion à CAS, elle est donc réutilisable pour n'importe quel serveur CAS.

1. Vérifie la présence d'un ticket à valider, sinon appelle la méthode 'pass' de la stratégie (PassportJs), qui appelle le middleware suivant et fin.
2. Lance la validation du ticket avec l'url fournie dans la configuration.
3. Réception de la réponse CAS. Si il y a eu une erreur, appel du middleware de gestion des erreurs.
4. Utilise la fonction verifyAuthentication pour vérifier l'utilisateur (ne fait rien par défaut), puis appelle 'success' sur la stratégie (PassportJs).

##### Middlewares (passport-cas.ts)

1. Si c'est une déconnexion qui est demandée, déconnexion du l'utilisateur et redirection vers l'url de de déconnexion CAS.
2. Si aucun utilisateur de connecté, si pas de ticket, redirection vers l'url de connexion CAS.
2. Si aucun utilisateur de connecté, mais présence d'un ticket, lancement de l'authentification avec la stratégie *cas-strategy*.

##### Exemple d'utilisation pour une application

Dans le fichier de configuration de l'application **default.json** :

```javascript

  "authentication": {
    "loginUrl": "/login",
    "logoutUrl": "/logout",
    "cas": {
      "enabled": true,
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

// middleware pour passport CAS generique
import { PassportCas } from "hornet-js-cas/src/passport-cas";
import { CasConfiguration } from "hornet-js-cas/src/cas-configuration";

let configuration = new CasConfiguration(
    utils.config.get("authentication.loginUrl"),
    utils.config.get("authentication.logoutUrl"),
    utils.config.get("authentication.cas.configuration.hostUrlReturnTo"),
    utils.config.get("authentication.cas.configuration.urls.casValidate"),
    utils.config.get("authentication.cas.configuration.urls.casLogin"),
    utils.config.get("authentication.cas.configuration.urls.casLogout"),
    (login, done) => {
        // mock d'un user avec role ADMIN
        return done(null, {name: login, roles: [{name: Roles.ADMIN_STR}]});
    }
);
hornetMiddlewareList.addMiddlewareAfter(new PassportCas(configuration).getMiddleware(), HornetMiddlewares.SessionMiddleware);

var server = new Server(configServer, hornetMiddlewareList);
server.start();

```

`hornet-js-cas` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)