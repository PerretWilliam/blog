---
title: "Le Test Ultime du Rendu Markdown"
date: "2026-01-17"
description: "Un fichier de test exhaustif pour vérifier la coloration syntaxique, les tables GFM, les vidéos et la typographie Tailwind."
tags: ["test", "nextjs", "markdown", "informatique"]
---

Ce post est conçu pour tester tous les plugins que nous avons installés : **Remark-GFM**, **Rehype-Pretty-Code (Shiki)**, et le rendu HTML direct.

## 1. Typographie et Éléments de base

Voici un paragraphe standard avec du **gras**, de l'_italique_, et du ~~texte barré~~. On peut aussi tester les `abréviations` en ligne.

> **Note importante :** En tant qu'étudiant en BUT Informatique, la rigueur du rendu est aussi importante que la qualité du code. Ce bloc de citation (blockquote) permet de mettre en avant des conseils clés.

### Listes à puces et ordonnées

- Premier élément important.
- Deuxième élément avec une sous-liste :
  - Sous-élément A.
  - Sous-élément B.
- [x] Tâche terminée (Plugin GFM).
- [ ] Tâche en attente.

---

## 2. Coloration Syntaxique (Shiki)

Voici un bloc de code TypeScript pour tester le thème `one-dark-pro`.

```typescript
// Un petit algorithme de tri pour le plaisir
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
```

## 3. Tableaux GFM (GitHub Flavored Markdown)

Vérifie ici l'alignement, les bordures et le style "prose" de ton tableau.

| Technologie    |   Type    | Performance |          Usage |
| :------------- | :-------: | :---------: | -------------: |
| **Next.js**    | Framework |   ⚡⚡⚡    | Frontend / SSR |
| **Rust**       |  Langage  | ⚡⚡⚡⚡⚡  | Système / WASM |
| **PostgreSQL** |    BDD    |   ⚡⚡⚡    |        Données |
| **Tailwind**   |    CSS    |  ⚡⚡⚡⚡   |        Styling |

---

## 4. Coloration Syntaxique Multi-langages

### Rust (Gestion de la mémoire et types)

On teste ici la coloration des macros (`!`), des types et des structures.

```rust
#[derive(Debug)]
struct Student {
    name: String,
    but_year: u8,
}

fn main() {
    let me = Student {
        name: String::from("William"),
        but_year: 2,
    };
    // Test de la macro println
    println!("Profil: {:?}", me);
}
```

## 5. Tests Vidéos & Médias

### Vidéo YouTube (Iframe Responsive)

Voici une intégration YouTube. Grâce à la classe `aspect-video`, la vidéo gardera son format 16/9 même sur mobile.

<div class="aspect-video my-8">
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
</div>

### Vidéo Locale (HTML5 Video)

Si tu as un fichier `.mp4` dans ton dossier `/public/videos/`, tu peux l'afficher ainsi. C'est parfait pour des petites démos de tes projets de BUT.

<video controls class="w-full rounded-xl my-8 bg-black shadow-md">
  <source src="/videos/demo-projet.mp4" type="video/mp4" />
  Votre navigateur ne supporte pas la lecture de vidéos.
</video>

## 6. Test du sommaire (Table of Contents)

### Section Niveau 3

#### Section Niveau 4

##### Section Niveau 5
