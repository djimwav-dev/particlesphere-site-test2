# 🎨 Sanity CMS Setup Guide - Particle Sphere

## ✅ Ce qui est configuré

### 1. Sanity Studio
- ✅ Studio accessible via `/studio`
- ✅ Schémas configurés : `artist`, `work`, `post`, `category`
- ✅ Dataset : `production`
- ✅ Vision Tool activé pour les requêtes GROQ

### 2. Frontend Next.js
- ✅ Client Sanity configuré (`sanity/lib/client.ts`)
- ✅ Helper d'images configuré (`sanity/lib/image.ts`)
- ✅ Types TypeScript (`sanity/lib/types.ts`)
- ✅ Requêtes GROQ (`sanity/lib/queries.ts`)

### 3. Pages créées
- ✅ `/artists` - Liste tous les artistes
- ✅ `/artists/[slug]` - Page détail artiste + ses œuvres
- ✅ `/work` - Liste toutes les œuvres
- ✅ `/work/[slug]` - Page détail œuvre avec galerie

### 4. ISR & Revalidation
- ✅ ISR configuré (revalidate: 60s)
- ✅ API route webhook : `/api/revalidate`

---

## 🚀 Étapes suivantes

### Étape 1 : Générer un secret pour le webhook

```bash
# Générer un secret sécurisé
openssl rand -base64 32
```

Ajouter ce secret dans `.env.local` :
```bash
SANITY_REVALIDATE_SECRET="votre-secret-généré"
```

### Étape 2 : Configurer le webhook dans Sanity

1. Aller sur https://sanity.io/manage/personal/project/2ta5gb4t
2. Cliquer sur **API** → **Webhooks**
3. Créer un nouveau webhook :
   - **Name** : `Production Revalidation`
   - **URL** : `https://votre-domaine.vercel.app/api/revalidate`
   - **Dataset** : `production`
   - **Trigger on** : Create, Update, Delete
   - **Filter** : 
     ```groq
     _type in ["artist", "work", "post", "category"]
     ```
   - **HTTP method** : POST
   - **Secret** : Coller le secret généré à l'étape 1
   - **HTTP Headers** : (vide)
   - **Projection** : 
     ```json
     {
       "_type": _type,
       "slug": slug
     }
     ```

4. Sauvegarder

### Étape 3 : Déployer sur Vercel

1. **Push vers GitHub** :
   ```bash
   git add .
   git commit -m "feat: Add Sanity CMS integration"
   git push origin feat/sanity-pages
   ```

2. **Configurer Vercel** :
   - Aller sur vercel.com
   - Importer le repository
   - Ajouter les variables d'environnement :
     ```
     NEXT_PUBLIC_SANITY_PROJECT_ID=2ta5gb4t
     NEXT_PUBLIC_SANITY_DATASET=production
     SANITY_REVALIDATE_SECRET=<votre-secret>
     ```

3. **Déployer** !

### Étape 4 : Ajouter du contenu

1. Aller sur `http://localhost:3000/studio`
2. Créer des **Categories** (ex: Photography, Digital Art, Painting)
3. Créer des **Artists** :
   - Nom
   - Slug (auto-généré)
   - Image de profil
   - Bio
   - Liens (Instagram, website)
4. Créer des **Works** :
   - Titre
   - Image principale
   - Artiste (référence)
   - Description
   - Année, médium, dimensions
   - Tags
   - Prix si disponible

---

## 📁 Structure des fichiers

```
app/
├── api/
│   └── revalidate/
│       └── route.ts          # Webhook endpoint
├── artists/
│   ├── page.tsx              # Liste des artistes
│   └── [slug]/
│       └── page.tsx          # Détail artiste
├── work/
│   ├── page.tsx              # Liste des œuvres
│   └── [slug]/
│       └── page.tsx          # Détail œuvre
└── studio/
    └── [[...tool]]/
        └── page.tsx          # Sanity Studio

sanity/
├── env.ts                    # Variables d'environnement Sanity
├── structure.ts              # Structure du Studio
├── lib/
│   ├── client.ts            # Client Sanity
│   ├── image.ts             # Helper d'images
│   ├── queries.ts           # Requêtes GROQ
│   └── types.ts             # Types TypeScript
└── schemaTypes/
    ├── index.ts
    ├── artistType.ts        # Schéma Artist
    ├── workType.ts          # Schéma Work
    ├── blockContentType.ts  # Rich text
    ├── categoryType.ts      # Catégories
    └── postType.ts          # Posts
```

---

## 🎯 Fonctionnalités

### ISR (Incremental Static Regeneration)
- Chaque page est régénérée toutes les 60 secondes max
- Les pages sont pré-générées au build pour tous les slugs existants
- Les nouveaux contenus déclenchent une revalidation via webhook

### Génération statique
```typescript
// Dans chaque page [slug]
export async function generateStaticParams() {
  const items = await client.fetch(slugsQuery)
  return items.map((item) => ({ slug: item.slug }))
}
```

### Métadonnées SEO dynamiques
```typescript
export async function generateMetadata({ params }) {
  const item = await client.fetch(query, { slug: params.slug })
  return {
    title: `${item.title} | Particle Sphere`,
    description: item.excerpt,
    openGraph: { images: [imageUrl] }
  }
}
```

---

## 🔄 Workflow de mise à jour

1. **Contenu modifié dans Sanity Studio**
2. **Webhook déclenché automatiquement**
3. **Next.js revalide les pages concernées**
4. **Nouvelle version disponible en ~1 seconde**

---

## 📝 Requêtes GROQ utiles

### Tous les artistes avec nombre d'œuvres
```groq
*[_type == "artist"] {
  name,
  slug,
  "workCount": count(*[_type == "work" && references(^._id)])
}
```

### Œuvres récentes avec artiste
```groq
*[_type == "work"] | order(publishedAt desc) [0...10] {
  title,
  slug,
  mainImage,
  artist->{name, slug},
  year
}
```

### Artistes featured
```groq
*[_type == "artist" && featured == true] | order(name asc)
```

---

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer Sanity Studio
npm run dev
# puis aller sur http://localhost:3000/studio

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Générer les types Sanity (optionnel)
npx sanity schema extract
npx sanity typegen generate
```

---

## 🎨 Personnalisation

### Ajouter un nouveau type de contenu

1. **Créer le schéma** :
   ```typescript
   // sanity/schemaTypes/eventType.ts
   export const eventType = defineType({
     name: 'event',
     title: 'Event',
     type: 'document',
     fields: [...]
   })
   ```

2. **Ajouter à l'index** :
   ```typescript
   // sanity/schemaTypes/index.ts
   import {eventType} from './eventType'
   
   export const schema = {
     types: [..., eventType]
   }
   ```

3. **Créer le type TypeScript** :
   ```typescript
   // sanity/lib/types.ts
   export interface Event { ... }
   ```

4. **Créer la requête GROQ** :
   ```typescript
   // sanity/lib/queries.ts
   export const eventsQuery = `*[_type == "event"] ...`
   ```

5. **Créer les pages** :
   - `app/events/page.tsx`
   - `app/events/[slug]/page.tsx`

6. **Ajouter au webhook** :
   ```typescript
   // app/api/revalidate/route.ts
   case 'event':
     revalidatePath('/events')
     if (body.slug?.current) {
       revalidatePath(`/events/${body.slug.current}`)
     }
     break
   ```

---

## ⚠️ Troubleshooting

### Les images ne s'affichent pas
- Vérifier que le `projectId` est correct dans `.env.local`
- Vérifier les permissions CORS dans Sanity (https://sanity.io/manage)
- Ajouter le domaine Vercel dans les origines autorisées

### Le webhook ne fonctionne pas
- Vérifier que le secret est identique dans `.env.local` et Sanity
- Vérifier les logs dans Sanity → Webhooks
- Tester le webhook manuellement avec un curl

### Les pages ne se revalidate pas
- Vérifier que `revalidate` est bien défini
- Vérifier que le webhook pointe vers la bonne URL
- Vérifier les logs Vercel

---

## 📚 Ressources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Image URLs](https://www.sanity.io/docs/image-url)

---

## 🎉 Prêt à utiliser !

Votre setup Sanity est maintenant complet et prêt pour la production.
Ajoutez du contenu dans le Studio et regardez-le apparaître automatiquement sur le site !
