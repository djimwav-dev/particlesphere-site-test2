# 🎨 Quick Start - Sanity CMS

## ✅ Setup complet !

Tout est configuré. Voici comment utiliser :

## 🚀 Démarrage rapide

### 1. Studio Sanity (déjà ouvert)
```
http://localhost:3000/studio
```

### 2. Créer du contenu
1. Categories (ex: Photography, Digital Art)
2. Artists (avec photos et bio)
3. Works (œuvres liées aux artistes)

### 3. Voir les pages
- `/artists` - Liste artistes
- `/artists/[slug]` - Profil artiste
- `/work` - Liste œuvres
- `/work/[slug]` - Détail œuvre

## 📁 Structure

```
sanity/
├── lib/
│   ├── client.ts      # Client Sanity
│   ├── queries.ts     # Requêtes GROQ
│   ├── types.ts       # Types TS
│   └── image.ts       # Helper images
└── schemaTypes/
    ├── artistType.ts  # Schéma Artist
    └── workType.ts    # Schéma Work

app/
├── artists/           # Pages artistes
├── work/              # Pages œuvres
└── api/revalidate/    # Webhook
```

## 📖 Documentation

- **Guide complet** : `docs/SANITY_SETUP.md`
- **Checklist** : `docs/TODO_CMS.md`
- **Récap rapide** : `SANITY_RECAP.md`

## ⚡ Features

✅ Studio intégré  
✅ ISR (auto-refresh 60s)  
✅ Images optimisées  
✅ Rich text  
✅ SEO  
✅ TypeScript  
✅ Webhook revalidation  

## 🎯 C'est prêt !

Va sur `/studio` et crée du contenu → ça apparaîtra automatiquement sur les pages ! 🎉
