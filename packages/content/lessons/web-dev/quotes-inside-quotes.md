In a book, when someone speaks, their words go in quotation marks: Sam said, "I'm hungry." Now try to put that whole sentence in a JavaScript string. The string starts and ends with quotes... and has quotes inside it. Which quote ends the string?

## The problem

```js
console.log("Sam said, "I'm hungry."");
```

JavaScript reads `"Sam said, "` as the whole string, because the second `"` closes it. Then it finds `I'm` sitting outside any string, makes no sense of it, and stops with a `SyntaxError`.

## Use the other kind of quote

A string in double quotes can hold single quotes, and the other way round:

```js
console.log("It's raining");
console.log('Sam said, "Hello"');
```

```text
It's raining
Sam said, "Hello"
```

The quotes inside are just characters, as long as they're not the kind that started the string.

## Both kinds at once: backticks

"Sam said, "I'm hungry."" has both kinds. A template literal, in backticks, can hold both:

```js
console.log(`Sam said, "I'm hungry."`);
```

```text
Sam said, "I'm hungry."
```

## Or escape it

A backslash, `\`, before a quote means "this one is just a character, it doesn't end the string":

```js
console.log("Sam said, \"I'm hungry.\"");
```

The same output. The backslash doesn't show. It's handy, but backticks are easier to read.

## Break it on purpose

Write an apostrophe in a single-quoted string:

```js
console.log('It's raining');
```

A `SyntaxError`: the `'` in "It's" ends the string early. Switch to double quotes or backticks.

---

## Mission: Lena says hello

Lena Park sends a message to the whole crew, and the directory logs it word for word.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Lena says: "Hi everyone, I'm so happy to be here!"
```

- The console shows exactly that line, with both kinds of quotes.
- The console shows no errors.

Psst, which kind of string can hold both kinds of quotes? :)
