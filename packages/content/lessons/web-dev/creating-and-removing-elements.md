So far your scripts change the text of elements already on the page. They can also **make** new elements and **take** elements away.

## Making an element

```js
const item = document.createElement("li");
item.textContent = "Spare bolts";
document.querySelector("#manifest").append(item);
```

1. `document.createElement("li")` makes a new `li`. It exists, but it isn't on the page yet.
2. Fill it, as you would any element.
3. `append` puts it inside another element, after what's already there. Only now does the visitor see it.

`prepend` puts it first instead.

## Taking one away

```js
document.querySelector("#manifest li:last-child").remove();
```

`remove()` takes an element off the page, with everything inside it. `:last-child` in a selector means "the one that is the last inside its parent": the list's last item. Part 3 tells you about more selectors like it.

## Lists you read earlier are old

`querySelectorAll` gives back the elements that match **at that moment**. Add an item later, and a list you read before doesn't have it. So when the page changes, read it again. A function makes that easy: put the reading and the writing in one, and call it after every change.

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

- On `crew.html`, after the roster paragraph, add two buttons, with the ids `add-rookie` and `remove-last`, that say **Add a rookie** and **Remove the last**.
- **Add a rookie** adds an item at the end of the crew list: `Rookie 1` the first time, `Rookie 2` the next, and so on.
- **Remove the last** removes the crew list's last item.
- After each change, the roster paragraph says how many crew members there are now, and the new first and last names.
