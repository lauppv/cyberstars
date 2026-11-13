When a contact in your phone has no photo, the phone shows a circle with letters in it: Sofia Lind becomes `SL`. The phone takes the first letter of the name, finds the space, and takes the letter after it. A script can cut a text into pieces the same way.

## Each letter has a place

Each letter of a text has a number, its place, starting from `0`, as the items of an array do. Dots, spaces and digits count as letters here too:

```text
 b  e  a  c  h  .  p  n  g
 0  1  2  3  4  5  6  7  8
```

## `slice`: a piece of the text

`slice(start, end)` gives back the piece from the place `start` up to the place `end`, **without** the letter at `end`:

```js
const file = "beach.png";
console.log(file.slice(0, 5));
console.log(file.slice(0, 1));
console.log(file.slice(6));
```

```text
beach
b
png
```

`slice(0, 5)` takes the places 0, 1, 2, 3 and 4: five letters. `slice(0, 1)` takes only the first one. With no `end`, `slice(6)` goes to the end of the text. Like `trim()`, `slice` doesn't change the text: it gives back a new one.

## `indexOf`: where is it?

`indexOf` gives the place where a piece first shows up in the text:

```js
const file = "beach.png";
console.log(file.indexOf("."));
console.log(file.indexOf("x"));
```

```text
5
-1
```

The dot is at place 5. There's no `x` in the text, so `indexOf` gives `-1`: "not found".

## Together

`indexOf` finds the place, and `slice` cuts there. The name of the file is everything before the dot, and its type is everything after it:

```html preview
<label for="file">File name</label>
<input id="file" />
<p>Name: <span id="name"></span></p>
<p>Type: <span id="type"></span></p>
<script>
  const file = document.querySelector("#file");

  file.addEventListener("input", () => {
    const dot = file.value.indexOf(".");
    if (dot === -1) {
      document.querySelector("#name").textContent = file.value;
      document.querySelector("#type").textContent = "none";
    } else {
      document.querySelector("#name").textContent = file.value.slice(0, dot);
      document.querySelector("#type").textContent = file.value.slice(dot + 1);
    }
  });
</script>
```

Type `beach.png`: the page says `Name: beach` and `Type: png`. The type starts one place **after** the dot, so it's `dot + 1`. Type `notes`, with no dot: `indexOf` gives `-1`, and the page says `Type: none`.

## Break it on purpose

Forget the `+ 1`:

```js
document.querySelector("#type").textContent = file.value.slice(dot);
```

Type `beach.png`: the page says `Type: .png`. The piece starts at the dot itself. Being one place off is the most common slip with `slice`: count the places on paper when you're not sure.

And forget the `-1` check: type `notes`. The name says `note`, without its last letter. `slice(0, -1)` reads `-1` as "one place from the end", so it cuts the last letter.

---

## Mission: Initials

The crew at the gate writes each passenger's initials on their bags. Your pass can show them.

**Example**: type `Ida Moreau` in the name box. The pass says `Initials: IM`. Type `Noah` alone: `Initials: N`.

- On the pass, an element with the id `pass-initials` shows the first letter of the name and the first letter after its first space, as the name is typed: `Clara Diaz Lopez` gives `CD`.
- A name of one word gives its first letter only. With no name, `#pass-initials` is empty.
- Spaces at the start and the end of the name don't count, as on the rest of the pass.

Psst, the letter after the space is one place after it :)
