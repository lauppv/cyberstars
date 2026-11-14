A town has one water tower, and every house gets its water from it. Nobody builds a water tower of their own. If the water needs cleaning, it's cleaned once, at the tower, and every tap in town gets clean water. A module many pages use is the site's water tower.

## A module, more than one page

A module isn't tied to a page. Any page can load a module of its own that imports the same file:

```js
// news.js, on the home page
import { getJson } from "./api.js";

// scores.js, on the games page
import { getJson } from "./api.js";
```

Both pages now ask in the same way, with the same checks and the same errors. Change how `getJson` works, say to add a time limit, and both pages get it, without touching either of them.

The browser loads `api.js` once per page, however many modules of that page import it. And each module still keeps its own names: `news.js` and `scores.js` can both have a `showList` without a clash.

## A module of its own for each page

Each page keeps its own module for its own job, and imports what it shares. That's the shape of a tidy site: small files with one job each, and a few shared ones in the middle.

## Break it on purpose

Load the home page's module without `type="module"`. The browser reads its first line, `import`, as an error: `Cannot use import statement outside a module`. Then, in the home page's module, write the address and `fetch` again instead of importing them. It works, until the address changes: then the home page is the one place you forgot.

---

## Mission: Starships on the home page

Visitors who open the home page should see at once how busy the sky is.

**Example**: at the end of the home page's main part, a line:

```text
5 starships near the station right now
```

When the tracker can't be reached, it says `The tracker can't be reached right now.`

- In the home page's main part, a paragraph with the id `nearby`.
- A new module, `nearby.js`, loaded by the home page only, gets the starships with `getJson` from `api.js` and writes their number, then ` starships near the station right now` in `#nearby`.
- When it can't get them, `#nearby` says `The tracker can't be reached right now.`, and nothing is thrown.

Psst, `import` works only in a script loaded as a module :)
