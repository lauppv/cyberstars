Some shops sell hundreds of things. Others sell one: a bakery sells bread, a key shop makes keys. You don't ask the key shop for "the key-making service", you just go there for a key. Some files are like that shop: they have one main thing.

## `export default`

`export default` marks the **main thing** of a file. A file has at most one:

```js
export default function makeBadge(name) {
  const badge = document.createElement("p");
  badge.textContent = `Hello, my name is ${name}`;
  return badge;
}
```

Importing it needs no curly brackets, and you choose the name:

```js
import makeBadge from "./badge.js";

document.body.append(makeBadge("Mia"));
```

`import makeBadge` takes the file's default, whatever its name was inside the file. You could call it `newBadge`, and it would be the same function. Named exports, in curly brackets, must keep their names. A default doesn't have to.

When to use which? A file with one main thing, a function or a class, gives it as its default. A file with several things of the same weight, like `api.js`, names them.

## Break it on purpose

Write `export function makeBadge` without `default`, and keep `import makeBadge from ...`. The module stops: the file has no default. Then import with curly brackets, `import { makeBadge } from ...`, for a default export: the same error the other way round. The brackets go with named exports only.

---

## Mission: A card maker

Making a starship card is one job, done the same way every time. It deserves a file of its own.

**Example**: the cards look exactly as before. A new file, `ship-card.js`, gives one thing by default: a function that takes a starship and returns its card. And if `ship-card.js` made other cards, the tracker would show those: the tests try it with a `ship-card.js` of their own.

- `ship-card.js` exports by default a function that takes a starship and returns a copy of the template `ship-template`, filled in as before: name, class, status, crew, and its title.
- `tracker.js` imports it, puts the cards it returns in the list, and doesn't make cards itself any more.
- Dock them all and Undo still work.

Psst, the function returns the card: the tracker puts it in the list :)
