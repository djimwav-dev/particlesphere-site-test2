# 🎨 Sanity CMS - Aide-mémoire

## 🔗 URLs

```
Studio       : http://localhost:3000/studio
Artists      : http://localhost:3000/artists
Works        : http://localhost:3000/work
API Webhook  : http://localhost:3000/api/revalidate
```

## 📝 Commandes

```bash
# Développement
npm run dev

# Build
npm run build

# Générer secret webhook
openssl rand -base64 32
```

## 🗂️ Schémas disponibles

### Artist
- name (string) *required*
- slug (slug) *required*
- image (image)
- bio (blockContent)
- excerpt (text)
- website (url)
- instagram (string)
- featured (boolean)

### Work
- title (string) *required*
- slug (slug) *required*
- mainImage (image) *required*
- gallery (array of images)
- artist (reference to artist) *required*
- excerpt (text)
- description (blockContent)
- year (number)
- medium (string)
- dimensions (string)
- tags (array of strings)
- categories (array of references)
- featured (boolean)
- available (boolean)
- price (number)

## 🔍 Requêtes GROQ utiles

```groq
// Tous les artistes
*[_type == "artist"] | order(name asc)

// Artistes featured
*[_type == "artist" && featured == true]

// Œuvres d'un artiste
*[_type == "work" && references($artistId)]

// Œuvres par tag
*[_type == "work" && $tag in tags]

// Œuvres récentes
*[_type == "work"] | order(publishedAt desc) [0...10]
```

## ⚙️ Variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID="2ta5gb4t"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_REVALIDATE_SECRET="..." # À générer
```

## 🔄 Workflow

1. **Créer/modifier** contenu dans Studio
2. **Webhook** déclenché automatiquement
3. **Pages revalidées** en ~1 seconde
4. **Nouveau contenu** visible

## 📖 Docs

- **Guide complet** : `docs/SANITY_SETUP.md`
- **Checklist** : `docs/TODO_CMS.md`
- **Résumé** : `SANITY_RECAP.md`

## 💡 Tips

### Images optimisées
```typescript
import { urlFor } from '@/sanity/lib/image'

const imageUrl = urlFor(image)
  .width(800)
  .height(600)
  .format('webp')
  .url()
```

### Fetching data
```typescript
import { client } from '@/sanity/lib/client'
import { artistsQuery } from '@/sanity/lib/queries'

const artists = await client.fetch(artistsQuery)
```

### ISR
```typescript
// Dans page.tsx
export const revalidate = 60 // Secondes
```

## 🛠️ Troubleshooting

### Images ne chargent pas
→ Vérifier CORS dans Sanity settings

### Webhook ne fonctionne pas
→ Vérifier le secret dans .env.local et Sanity

### Types TypeScript
→ Tout est dans `sanity/lib/types.ts`

## ✅ Checklist déploiement

- [ ] Contenu de test créé
- [ ] Pages testées localement
- [ ] Secret webhook généré
- [ ] Variables env ajoutées dans Vercel
- [ ] Webhook configuré dans Sanity
- [ ] CORS configuré
- [ ] Déployé et testé en production

---

**Project ID** : `2ta5gb4t`  
**Dataset** : `production`  
**Studio** : `/studio`  
**ISR** : 60s

**C'est prêt ! 🚀**
