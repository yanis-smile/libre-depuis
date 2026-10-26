# Libre depuis

Petite appli web pour compter le temps depuis l’arrêt d’une addiction et suivre les bienfaits étape par étape.
Chaque personne crée un compte (e-mail + mot de passe) ; ses compteurs sont privés et synchronisés sur tous ses appareils.

- Site statique (HTML, CSS, JavaScript), sans étape de compilation, hébergé sur GitHub Pages.
- Comptes et données : [Supabase](https://supabase.com) (offre gratuite).
- Installable sur l’écran d’accueil du téléphone (fonctionne comme une appli).

## Mise en route de Supabase (une seule fois)

1. Créez un compte sur supabase.com, puis un nouveau projet (offre « Free »). Choisissez une région en Europe.
2. **Base de données** : ouvrez *SQL Editor*, collez le contenu de [`supabase/schema.sql`](supabase/schema.sql), puis cliquez sur *Run*.
   Cela crée la table des compteurs et les règles qui empêchent chacun de voir les données des autres.
3. **Connexion par e-mail et mot de passe** : ouvrez *Authentication → Sign In / Providers → Email* et **désactivez « Confirm email »**, puis enregistrez.
   Sans ce réglage, Supabase essaierait d’envoyer un e-mail de confirmation, et son service d’envoi gratuit n’écrit qu’aux membres du projet.
4. **Clés** : ouvrez *Project Settings → API* et copiez :
   - l’adresse du projet (*Project URL*, de la forme `https://xxxx.supabase.co`) ;
   - la clé publique (*Publishable key*, ou l’ancienne *anon public key*).

   Collez-les dans [`config.js`](config.js). Cette clé est faite pour être publique ; ne mettez jamais la clé *secret* / *service_role* dans ce fichier.

## Bon à savoir

- **Mot de passe oublié** : non disponible tant qu’aucun service d’envoi d’e-mails (SMTP) n’est branché à Supabase.
  Pour l’ajouter plus tard : *Authentication → Emails → SMTP Settings* avec un service comme Brevo ou Resend.
- **Mise en pause** : un projet Supabase gratuit se met en pause après 7 jours sans aucune utilisation.
  Il suffit alors de le relancer depuis le tableau de bord Supabase.
- Les repères santé sont des informations générales et ne remplacent pas l’avis d’un médecin.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure de la page et formulaires |
| `styles.css` | Apparence (thème clair et sombre) |
| `app.js` | Logique : connexion, compteurs, bienfaits, objectifs |
| `config.js` | Adresse et clé publique Supabase |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installation sur l’écran d’accueil et usage hors ligne |
| `supabase/schema.sql` | Table et règles de sécurité de la base |
