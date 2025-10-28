# Hébergement audio: Sanity vs Cloudflare R2

Ce projet supporte désormais un champ `externalUrl` par piste (schema `work.tracks[].externalUrl`). Si ce champ est renseigné, le lecteur utilisera cette URL (prioritaire). Sinon, il retombera sur le fichier audio téléversé dans Sanity (`audioFile`).

## Quand choisir quoi ?

- Sanity (assets):
  - Simplicité totale (upload depuis Studio)
  - CDN mondial intégré
  - Parfait pour des démos, volumes modestes
- Cloudflare R2 (ou équivalent S3):
  - Coût stockage/egress optimisé
  - Contrôle avancé (domaines, signatures, règles)
  - Adapté à des bibliothèques audio plus lourdes / trafic élevé

## Intégration Cloudflare R2 (public bucket)

1. Créez un bucket R2 et activez un accès public (Public Bucket / Static site)
2. Définissez CORS pour autoriser:
   - Méthodes: GET, HEAD
   - En-têtes de requête: Range (important pour le streaming/seek)
   - En-têtes de réponse exposés: Accept-Ranges, Content-Range, Content-Length
3. Servez les fichiers avec types corrects (`Content-Type: audio/mpeg`, `audio/wav`, etc.)
4. Notez l’URL publique (ex: `https://<r2-domain>/<bucket>/<path>/track.mp3`)
5. Dans Sanity Studio, ouvrez un document `Work` → ajoutez/éditez une piste et collez l’URL dans `URL externe (prioritaire)`

C’est tout: le front coalesce l’URL externe sinon l’asset Sanity.

## Bonnes pratiques

- Nommer les fichiers proprement (artiste-titre.mp3) pour un meilleur SEO.
- Vérifier les en-têtes:
  - `Accept-Ranges: bytes` pour permettre le seek.
  - `Cache-Control` adapté (ex: `public, max-age=31536000, immutable`).
- Si vous préférez un domaine custom (ex: `cdn.votresite.com`), utilisez Cloudflare DNS + R2/Workers/Cache Rules.

## Dépannage

- Le seek ne marche pas: vérifier que `Range` est autorisé en CORS et que R2 renvoie `Accept-Ranges`.
- Pas de son: vérifier `Content-Type` de l’objet.
- 403/401: bucket non public; pour un accès privé, il faudra générer des URLs signées côté serveur.
