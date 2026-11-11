Gluing a sentence together with `+` gets messy fast: `"Hi " + name + ", you have " + count + " messages"`. All those quotes and pluses, and it's easy to forget a space. There's a neater way: write the sentence once, and leave holes for the values.

## Template literals

A **template literal** is a string written between **backticks**, `` ` ``, instead of quotes. The backtick is usually under the Esc key, left of 1.

Inside it, `${...}` is a hole: whatever is in the curly brackets is put into the text right there:

```js
const name = "Sam";
const count = 3;
console.log(`Hi ${name}, you have ${count} new messages`);
```

```text
Hi Sam, you have 3 new messages
```

You write the sentence as you'd say it, spaces and all, and the values drop into their places.

## Anything in the hole

The hole can hold any value, not just a name: a number, or even a little sum:

```js
console.log(`Next year you'll be ${12 + 1}`);
```

```text
Next year you'll be 13
```

Notice the `'` in "you'll": inside backticks, quotes are just characters, no problem at all.

## Break it on purpose

Use normal quotes instead of backticks:

```js
console.log("Hi ${name}, you have ${count} new messages");
```

```text
Hi ${name}, you have ${count} new messages
```

The holes stay holes: only backticks fill them in. If you see `${` in your output, check your quote marks.

---

## Mission: A welcome message

Welcome Lena Park properly, with one sentence written as a template.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Welcome aboard, Lena Park! You are crew member 7.
```

- The console shows `Welcome aboard, Lena Park! You are crew member 7.`
- The sentence is one template literal: her first name, her last name and the number 7 each go in through a `${...}`, the number from a name of its own.

Psst, backticks, not quotes :)
