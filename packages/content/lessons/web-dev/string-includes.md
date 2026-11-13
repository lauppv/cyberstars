Your phone's photo app knows that `beach.png` is a picture and `notes.txt` isn't. It only looks at the end of the file's name. Many questions about a text are like that: does it start with this, does it end with that, is this word somewhere in it?

## `includes`

`includes` answers `true` when the text holds the piece you give it, anywhere:

```js
const message = "Pizza after the game?";
console.log(message.includes("game"));
console.log(message.includes("movie"));
```

```text
true
false
```

## `startsWith` and `endsWith`

`startsWith` looks only at the start of the text, and `endsWith` only at its end:

```js
const file = "beach.png";
console.log(file.endsWith(".png"));
console.log(file.startsWith("beach"));
console.log(file.startsWith("png"));
```

```text
true
true
false
```

`png` is in the text, but not at its start, so `startsWith("png")` is `false`.

## Each one asks its own question

Our school's club accepts only school emails, the ones that end with `@school.example`:

```html preview
<label for="mail">Email</label>
<input type="email" id="mail" />
<p>Member: <span id="member">no</span></p>
<script>
  const mail = document.querySelector("#mail");
  const member = document.querySelector("#member");

  mail.addEventListener("input", () => {
    if (mail.value.endsWith("@school.example")) {
      member.textContent = "yes";
    } else {
      member.textContent = "no";
    }
  });
</script>
```

Type `sofia@school.example`: the page says `Member: yes`. Type `sofia@school.example.net`: `no`. The text holds `@school.example`, but it doesn't end with it. With `includes`, that email would get in too. Pick the method that asks exactly your question.

## Capitals count

All three compare letter by letter, and a capital letter is a different letter:

```js
console.log("Pizza after the game?".includes("pizza"));
```

```text
false
```

`Pizza` starts with a capital `P`, and `"pizza"` doesn't. When capitals don't matter, make the text small first: `message.toLowerCase().includes("pizza")` is `true`.

## Break it on purpose

Forget the `@`:

```js
if (mail.value.endsWith("school.example")) {
```

Type `sofia@myschool.example`: the page says `Member: yes`. That email ends with `school.example` too, but it belongs to another school. The `@` makes sure the whole name after it is `school.example`.

---

## Mission: Crew or guest

Members of the station's crew fly home too. They book with their station email, which ends with `@station.example`, like `mara@station.example`. The crew at the gate wants to see who is crew.

**Example**: when the page opens, the pass says `Traveling as: guest`. Type `mara@station.example` in the email box: it says `Traveling as: crew`.

- On the pass, an element with the id `pass-role` says `crew` while the email ends with `@station.example`, and `guest` for any other email, as it's typed.
- When the page opens, it says `guest`.
- An email like `ines@station.example.com` or `ines@mystation.example` isn't a station email.

Psst, the email must end with the station's address, `@` and all :)
