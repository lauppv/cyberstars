Imagine a school notice board where anyone can pin a note. Most people pin "Lost: blue scarf". But one day someone pins a note that says "everyone's homework is cancelled", signed with the head teacher's name. The board can't tell. `innerHTML` has the same problem.

## The danger

`innerHTML` turns **any** text into HTML, including HTML that runs a script. Most of the time the text is yours, so it's fine. But often it comes from somewhere else: a name someone typed into a form, a message from another user. And people can type tags:

```js
const name = '<img src="x" onerror="alert(1)">';
document.querySelector("#note").innerHTML = `${name} joined the club`;
```

That "name" is a picture that doesn't load, with an `onerror` attribute: code that runs when a picture fails. The browser builds the picture, it fails, and the code runs. Here it only shows a box. A real attacker's code could read what's on the page, or act as the visitor. This kind of attack is called **XSS**.

## The safe way

Never put text you didn't write yourself into `innerHTML`. Build the elements yourself, and put the text in with `textContent`:

```js
const strong = document.createElement("strong");
strong.textContent = name;
const note = document.querySelector("#note");
note.textContent = "";
note.append(strong, " joined the club");
```

`textContent` never reads tags: the name shows as plain characters, angle brackets and all, and nothing runs. `append` can take several things at once, elements and plain strings, and adds them in order. `note.textContent = ""` empties the note first.

## Break it on purpose

Use the dangerous version with a name like `<b>Sam</b>`. Sam shows in bold, so a visitor could change your page just by choosing their name. With the safe version, the same name shows as `<b>Sam</b>`, tags and all: odd, but harmless.

---

## Mission: Bold names, safely

The crew directory shows a welcome list: every name of the crew list, in bold. The names come from the page, and one day they'll come from a form anyone can fill in. Build it the safe way.

**Example**: under `#latest`, the page shows:

```text
Welcome: Mara Vega! Tomas Okafor! Ines Lindqvist! Kenji Arano!      (each name in bold)
```

- A paragraph with the id `welcome-list`, which shows `Welcome: `, then every name of the crew list in a `<strong>`, each followed by `! `.
- A name that holds tags shows them as plain characters, and never runs anything.

Psst, `textContent` and `createElement`, never `innerHTML`, for names :)
