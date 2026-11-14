The cookie cutter has been waiting in its drawer since the tracker's first lesson. The dough is here now: five starships. Time to press out a cookie for each one.

## The template's content

A `<template>` keeps what's inside it in a separate place, its `content`. You find the template like any element, and its `content` holds the card:

```js
const mold = document.querySelector("#card-template");
console.log(mold.content);
```

The card isn't on the page, so you can't put the same card on the page five times. You need a **copy** for each one.

## `cloneNode(true)`

`cloneNode(true)` makes a copy of an element, with everything inside it (`true` means "with everything inside"). Copy the template's content, fill in the copy, and add it to the list:

```html preview
<ul id="pets"></ul>
<template id="pet-template">
  <li class="pet"><strong class="pet-name">Name</strong>, <span class="pet-kind">kind</span></li>
</template>
<script>
  const pets = [
    { name: "Rex", kind: "dog" },
    { name: "Tom", kind: "cat" },
  ];
  const mold = document.querySelector("#pet-template");
  const list = document.querySelector("#pets");

  for (const pet of pets) {
    const card = mold.content.cloneNode(true);
    card.querySelector(".pet-name").textContent = pet.name;
    card.querySelector(".pet-kind").textContent = pet.kind;
    list.append(card);
  }
</script>
```

Two list items: "**Rex**, dog" and "**Tom**, cat". Add a third pet to the array, and a third item appears. The HTML of a card is written once, in the template, and the script only fills in the words.

`card.querySelector` looks only inside that copy, so each copy gets its own name. And `textContent`, not `innerHTML`: the names come from another computer, and you know from the crew directory what `innerHTML` does with text you don't control.

## Break it on purpose

Leave out `cloneNode(true)` and append `mold.content` itself. The first card appears, then the next ones don't: the content **moved** into the list, and the template is empty now. Always copy. Then forget one `querySelector` line: every card keeps the template's own text there, like "kind".

---

## Mission: The starships arrive

The tracker knows how many starships there are. Now show them, with the template you wrote.

**Example**: under the loading line, a card for each starship, in the API's order: Aurora, Cargo, Docked, then Comet Runner, Explorer, On the way, and so on. The line says `5 starships near the station`.

- For each starship the API sent, `loadShips` adds a copy of the template `ship-template` to the list `ships`.
- Each card shows the starship's name in `.ship-name`, its class in `.ship-class` and its status in `.ship-status`.
- The template stays as it was, so the next starship gets a card too.

Psst, `append` moves what you give it: give it a copy :)
