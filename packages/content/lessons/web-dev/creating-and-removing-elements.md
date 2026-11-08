So far your scripts change the text of elements that are already on the page. They can also **make** new elements and **take** elements away.

## Making an element

```js
const item = document.createElement("li");
item.textContent = "Spare bolts";
document.querySelector("#manifest").append(item);
```

1. `document.createElement("li")` makes a new `li`. It exists, but it isn't on the page yet.
2. Fill it, like any other element.
3. `append` puts it inside another element, after what's already there. Only now can the visitor see it.

`prepend` puts it first instead.

## Taking one away

```js
document.querySelector("#manifest li:last-child").remove();
```

`remove()` takes an element off the page, with everything inside it. `:last-child` in a selector means "the one that comes last inside its parent": here, the list's last item. Part 3 shows you more selectors like it.

## Lists you read earlier are old

`querySelectorAll` gives you the elements that match **at that moment**. If you add an item later, a list you read before doesn't have it. So when the page changes, read it again. A function makes that easy: put the reading and the writing in one function, and call it after every change.

```js
function showCount() {
  const items = document.querySelectorAll("#manifest li");
  document.querySelector("#count").textContent = `${items.length} items`;
}

showCount(); // once when the page opens
// ...and again after every append or remove
```

---

## Mission: New Arrivals

New crew members arrive, and others leave. The crew list should keep up.

- On `crew.html`, after the roster paragraph, add two buttons, with the ids `add-rookie` and `remove-last`, that say **Add a rookie** and **Remove the last**.
- **Add a rookie** adds a new name at the end of the crew list: `Rookie 1` the first time, `Rookie 2` the next time, and so on.
- **Remove the last** takes the crew list's last name away.
- After every change, the roster tells the truth again: how many crew members there are now, and the first and last names.
