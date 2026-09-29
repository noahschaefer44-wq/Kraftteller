# Kraftteller

Statische Seite (HTML, CSS, JS ohne Build) mit optionaler Supabase-Anbindung.

## Ordner

- `index.html`, `css/app.css`: Oberfläche
- `js/data.js`, `js/recipes2.js`: Zutaten und 650+ Rezepte (Nährwerte und Preise werden aus den Zutaten berechnet)
- `js/util.js`, `js/app.js`, `js/features.js`: App-Logik (Filter, Korb, Plan, Tagebuch, Vorrat, Kochmodus, Community)
- `js/backend.js`, `config.js`: Supabase (Konto, Sync, Bewertungen, Community-Rezepte)
- `supabase/schema.sql`: Tabellen mit Row Level Security, Präfix `kt_`

## Lokal starten

`npx serve .` oder jeder andere statische Server.

## Veröffentlichen (Netlify)

```
npx netlify-cli login
npx netlify-cli deploy --prod --dir . --create-site kraftteller
```

## Supabase

- Die Seite läuft auch ohne Supabase (alles bleibt im Browser).
- In Supabase unter Authentication > URL Configuration die Netlify-Adresse als Site URL oder Redirect URL eintragen, damit der Link in der Bestätigungs-Mail hierher führt.
