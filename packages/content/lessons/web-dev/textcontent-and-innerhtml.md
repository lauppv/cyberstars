There's a second way to put content in an element, and it's the one you'll see most online. It's also the most dangerous line a beginner can write.

## innerHTML

```js
const note = document.querySelector("#note");
note.innerHTML = "Bay 2 is <strong>closed</strong>";
```

`textContent` puts **text** in, exactly as written: the visitor would see `<strong>` with its angle brackets. `innerHTML` reads what you give it as **HTML**: the visitor sees **closed** in bold. That's handy for HTML you wrote yourself.

## Why it's dangerous

Now imagine the text comes from somewhere else: a name a visitor typed, a list someone else edited, an answer from a server. Someone types this as their name:

```html
<img src="x" onerror="alert('Your account is mine')" />
```

With `textContent`, the page just shows those characters, and nothing bad happens. With `innerHTML`, the browser builds a real picture, fails to load it, and runs the `onerror` code: **someone else's JavaScript runs on your page**, and it can do anything your page can do. On a real site, it can read what the visitor types, send their data away, or pretend to be them. This attack is called **cross-site scripting**, or XSS, and it's one of the most common security holes on the web.

## The safe way

Any text that doesn't come from your own code goes in with `textContent`. When it needs HTML around it, build that HTML with `createElement`, and put the text in with `textContent`:

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

The crew page welcomes whoever joined last.

- On `crew.html`, after the two crew buttons, add an empty paragraph with the id `latest`.
- It says `Latest arrival: ` followed by the last name of the crew list, with that name marked as important.
- It follows the list: after **Add a rookie**, it names the new rookie.

The names come from the page, and one day anyone may be able to edit that list. So treat them like text from a stranger: whatever a name holds, the page must show it exactly as written, and never run it.
