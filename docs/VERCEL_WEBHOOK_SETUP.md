# 🚀 Configuration Webhook Vercel - Guide Complet

## ✅ Ce qui est déjà fait

- ✅ `export const revalidate = 60` sur `/artists` et `/work`
- ✅ API Route `/api/revalidate` avec sécurité par secret
- ✅ Variables d'environnement préparées

---

## 📋 Étapes de configuration

### 1. Préparer ton secret

Tu peux utiliser celui qui est déjà dans `.env.local` :

```bash
REVALIDATION_SECRET="mysupersecretkey"
```

Ou en générer un nouveau plus sécurisé :

```bash
openssl rand -base64 32
```

**Important** : Ce secret doit être le même dans :
1. `.env.local` (local)
2. Vercel Environment Variables (production)
3. L'URL du webhook Sanity

---

### 2. Configurer les variables d'environnement sur Vercel

#### 2.1 Aller sur ton projet Vercel
```
https://vercel.com/[ton-username]/particlesphere-site-test2
```

#### 2.2 Settings → Environment Variables

Ajouter ces 3 variables :

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `2ta5gb4t` | Production, Preview, Development |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview, Development |
| `REVALIDATION_SECRET` | `mysupersecretkey` (ou ton secret) | Production, Preview, Development |

**⚠️ Important** : Le `REVALIDATION_SECRET` ne doit PAS avoir le préfixe `NEXT_PUBLIC_` car c'est un secret serveur.

#### 2.3 Sauvegarder et Redeploy

Après avoir ajouté les variables :
1. Clique sur **Save**
2. Va sur **Deployments**
3. Clique sur le dernier déploiement
4. Clique sur les 3 points → **Redeploy**

---

### 3. Configurer le Webhook Sanity

#### 3.1 Aller dans Sanity Management

```
https://www.sanity.io/manage/personal/project/2ta5gb4t
```

#### 3.2 API → Webhooks → Add Webhook

**Configuration du webhook :**

| Champ | Valeur |
|-------|--------|
| **Name** | `Vercel Production Revalidation` |
| **URL** | `https://TON-DOMAINE.vercel.app/api/revalidate?secret=mysupersecretkey` |
| **Dataset** | `production` |
| **Trigger on** | ☑️ Create<br>☑️ Update<br>☑️ Delete |
| **Filter** | (optionnel) `_type in ["artist", "work", "post", "category"]` |
| **Projection** | Voir ci-dessous ⬇️ |
| **HTTP method** | `POST` |
| **HTTP Headers** | (vide) |
| **API version** | `v2021-06-07` ou latest |
| **Include drafts** | ☐ Non (décoché) |
| **Status** | ☑️ Enabled |

**Projection (optionnel mais recommandé) :**
```json
{
  "_type": _type,
  "slug": slug
}
```

#### 3.3 Exemple d'URL complète

Remplace `TON-DOMAINE` par ton vrai domaine Vercel :

```
https://particlesphere-site-test2.vercel.app/api/revalidate?secret=mysupersecretkey
```

**⚠️ Remplace `mysupersecretkey` par ton vrai secret !**

#### 3.4 Sauvegarder

Clique sur **Save** ou **Create Webhook**

---

### 4. Tester le Webhook

#### 4.1 Test manuel dans Sanity

1. Va dans Sanity Studio : `https://TON-DOMAINE.vercel.app/studio`
2. Modifie un artiste ou une œuvre
3. Publie les changements
4. Attends 1-2 secondes
5. Va sur la page correspondante → le contenu devrait être à jour !

#### 4.2 Test avec curl (optionnel)

```bash
curl -X POST "https://TON-DOMAINE.vercel.app/api/revalidate?secret=mysupersecretkey" \
  -H "Content-Type: application/json" \
  -d '{"_type": "artist", "slug": {"current": "test"}}'
```

Réponse attendue :
```json
{
  "ok": true,
  "revalidated": true,
  "timestamp": "2025-10-17T...",
  "type": "artist"
}
```

#### 4.3 Vérifier les logs du webhook

Dans Sanity :
1. API → Webhooks → Ton webhook
2. Clique sur le nom
3. Regarde l'onglet **Deliveries**
4. Tu devrais voir les appels réussis (code 200)

---

## 🔍 Vérification

### Checklist finale

- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Site redéployé après ajout des variables
- [ ] Webhook créé dans Sanity avec la bonne URL
- [ ] Secret identique partout (Vercel + URL webhook)
- [ ] Test : modifier un contenu → webhook déclenché → page mise à jour

---

## 🎯 Comment ça fonctionne

### Sans Webhook (ISR normal)
1. Page générée au build
2. Page servie depuis le cache
3. Après 60 secondes → Next.js régénère la page en arrière-plan
4. Nouvelle version disponible

### Avec Webhook (ISR + On-Demand)
1. Tu modifies du contenu dans Sanity
2. Sanity appelle `/api/revalidate?secret=...`
3. Next.js revalide immédiatement les pages concernées
4. Nouvelle version disponible en ~1 seconde ⚡

---

## 🐛 Troubleshooting

### Le webhook retourne 401 (Unauthorized)
➡️ Le secret ne correspond pas
- Vérifie que `REVALIDATION_SECRET` est bien défini dans Vercel
- Vérifie que le `?secret=...` dans l'URL du webhook correspond

### Le webhook retourne 500 (Error)
➡️ Erreur dans l'API
- Va dans Vercel → Project → Logs
- Regarde les logs de la fonction serverless

### Le contenu ne se met pas à jour
➡️ Le webhook ne s'est pas déclenché
- Vérifie les **Deliveries** dans Sanity Webhooks
- Vérifie que le webhook est **Enabled**
- Vérifie le **Filter** si tu en as mis un

### Le webhook est appelé mais la page ne change pas
➡️ Cache du navigateur
- Fais un hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)
- Ouvre en navigation privée

---

## 📚 Ressources

- **Sanity Webhooks** : https://www.sanity.io/docs/webhooks
- **Next.js Revalidation** : https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- **Vercel Env Vars** : https://vercel.com/docs/projects/environment-variables

---

## ✨ C'est prêt !

Une fois configuré, ton site se mettra à jour automatiquement à chaque modification dans Sanity ! 🎉

**Workflow final :**
1. Tu modifies dans Sanity Studio
2. Tu cliques sur Publish
3. Webhook → Vercel
4. Page mise à jour en ~1 seconde
5. C'est en ligne ! 🚀
