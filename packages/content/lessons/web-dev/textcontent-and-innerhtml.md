There's a second way to put content in an element, and it's the one you'll see most online. It's also the most dangerous line a beginner writes.

## innerHTML

```js
const note = document.querySelector("#note");
note.innerHTML = "Bay 2 is <strong>closed</strong>";
```

`textContent` puts **text** in, exactly as written: the visitor would see `<strong>` with its angle brackets. `innerHTML` reads what you give it as **HTML**: the visitor sees **closed** in bold. Handy, for markup you wrote yourself.

## Why it's dangerous

Now imagine the text comes from somewhere else: a name a visitor typed, a list another person edited, an answer from a server. Someone types this as their name:

```html
<img src="x" onerror="alert('Your account is mine')" />
```

Put that through `textContent` and the page shows those characters, harmless. Put it through `innerHTML` and the browser builds a real picture, fails to load it, and runs the `onerror` code: **someone else's JavaScript runs on your page**, with everything your page can do. On a real site, it can read what the visitor types, send their data away, act as them. This attack is called **cross-site scripting**, XSS, and it is one of the most common holes on the web.

## The safe way

Text from anywhere but your own code goes in with `textContent`. When it needs markup around it, build the markup with `createElement` and drop the text in with `textContent`:

```js
const name = document.querySelector("#manifest li").textContent;
const strong = document.createElement("strong");
strong.textContent = name; // never parsed as HTML
note.textContent = "First crate: ";
note.append(strong);
```

The rule to keep: **`innerHTML` only with HTML you wrote yourself, never with text that came from anywhere else.**

---

## Mission: Latest Arrival

- On `crew.html`, after the two crew buttons, add an empty paragraph with the id `latest`.
- In it, the script writes `Latest arrival: ` followed by the last name of the crew list, that name in bold as important text, built the safe way.
- It follows the list: after **Add a rookie**, it names the new rookie.

The names come from the page, so treat them as text from anywhere: whatever a name holds, the page shows it as written.
