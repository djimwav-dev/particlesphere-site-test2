# ⚡ Quick Reference - Webhook Setup

## 🔑 Variables Vercel (à ajouter)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=2ta5gb4t
NEXT_PUBLIC_SANITY_DATASET=production
REVALIDATION_SECRET=mysupersecretkey
```

**⚠️ Change `mysupersecretkey` par un vrai secret !**

---

## 🔗 URL Webhook Sanity

```
https://TON-DOMAINE.vercel.app/api/revalidate?secret=mysupersecretkey
```

**Remplace :**
- `TON-DOMAINE` → ton domaine Vercel
- `mysupersecretkey` → ton vrai secret

---

## ⚙️ Configuration Webhook Sanity

| Champ | Valeur |
|-------|--------|
| URL | `https://TON-DOMAINE.vercel.app/api/revalidate?secret=TON-SECRET` |
| Dataset | `production` |
| Events | ☑️ Create, Update, Delete |
| Method | POST |
| Status | ☑️ Enabled |

---

## ✅ Checklist

- [ ] Variables ajoutées dans Vercel
- [ ] Site redéployé
- [ ] Webhook créé dans Sanity
- [ ] Test : modifier un contenu → page mise à jour

---

## 🧪 Test rapide

```bash
curl -X POST "https://TON-DOMAINE.vercel.app/api/revalidate?secret=TON-SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type": "artist"}'
```

Réponse attendue : `{"ok": true, "revalidated": true, ...}`

---

**Guide complet** : `docs/VERCEL_WEBHOOK_SETUP.md`
