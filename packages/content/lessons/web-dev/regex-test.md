In a group chat, you can tell your phone: "let me know when someone writes my name". It doesn't matter if they write `Sofia`, `sofia` or `SOFIA`. The phone looks for a pattern, not for exactly one text. JavaScript has a small language for patterns like that.

## A regular expression

A **regular expression** (people often say **regex**) is a pattern that a text can match or not. You write it between two slashes, `/`, without quotes:

```js
const pizza = /pizza/;
```

This pattern means "the letters `pizza`, one after the other, anywhere in the text".

## `test`

A regex has a method, `test`, that takes a text and answers `true` or `false`: does the text match the pattern?

```js
console.log(/pizza/.test("Pizza after the game?"));
console.log(/pizza/.test("I want pizza"));
console.log(/pizza/.test("A movie tonight"));
```

```text
false
true
false
```

The first one is `false` because of the capital `P`. Like `includes`, a pattern compares letter by letter.

## `i`: any capitals

A letter after the last slash changes how the pattern works. The `i` lets capitals and small letters match each other:

```js
console.log(/pizza/i.test("Pizza after the game?"));
console.log(/pizza/i.test("PIZZA!"));
```

```text
true
true
```

So `/pizza/i.test(message)` does the same job as `message.toLowerCase().includes("pizza")`, in a shorter way.

## In a page

A coach reads the team's messages and wants to see at once which ones are about the next game:

```html preview
<label for="message">Message</label>
<input id="message" />
<p>About the game: <span id="game">no</span></p>
<script>
  const message = document.querySelector("#message");
  const game = document.querySelector("#game");

  message.addEventListener("input", () => {
    if (/game/i.test(message.value)) {
      game.textContent = "yes";
    } else {
      game.textContent = "no";
    }
  });
</script>
```

Type `Is the Game at 5?`: the page says `About the game: yes`. Delete it: `no`.

So far, a pattern is only fixed letters, and `includes` could do the same. Next lesson, a pattern learns to say things like "any digit" or "exactly four of them", and that's where regex really helps.

## Break it on purpose

Test the box instead of what is in it:

```js
if (/game/i.test(message)) {
```

Type `Game today`: the page still says `no`. No error. `test` turns what it gets into a text first, and the box becomes `[object HTMLInputElement]`, which has no `game` in it. Test the text: `message.value`.

---

## Mission: Help at the gate

Some passengers write in their notes that they use a wheelchair. The crew at the gate wants to see it on the pass, to have help ready.

**Example**: when the page opens, the pass says `Help at the gate: no`. Type `I use a Wheelchair` in the notes box: it says `Help at the gate: yes`.

- On the pass, an element with the id `pass-help` says `yes` while the notes have the word `wheelchair` in them, written with any capitals, and `no` otherwise, as the notes are typed.
- It says `no` when the page opens, and after Escape empties the notes.

Psst, test what is in the box, not the box :)
