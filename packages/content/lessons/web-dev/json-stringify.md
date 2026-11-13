You can't send a toy car by text message. But you can describe it: "red car, 4 wheels, a 7 on the door". Your friend reads the words and knows exactly which car it is. To keep data or send it somewhere, programs often turn it into words too, in a format called JSON.

## JSON

**JSON** is a way to write data as a text. It looks almost like a JavaScript object:

```text
{"name":"Mia","age":12,"pets":["cat","fish"]}
```

The differences: every key is in double quotes, texts are in double quotes too (never single ones), and there are no functions, only data: texts, numbers, `true` and `false`, `null`, arrays and objects. Almost every language and website can read it, which makes it the usual way to save and send data.

## `JSON.stringify`

`JSON.stringify` turns a value into a JSON text:

```js
const player = { name: "Mia", score: 12, done: false };
const text = JSON.stringify(player);

console.log(text);
console.log(typeof text);
```

```text
{"name":"Mia","score":12,"done":false}
string
```

The object became one text. `typeof` says what kind of value something is: here `string`, a text, no longer an object. You can't write `text.name` any more: it's just letters now.

Arrays work too: `JSON.stringify([1, 2, 3])` gives the text `[1,2,3]`.

## What JSON leaves out

A function isn't data, so `JSON.stringify` leaves it out. A property whose value is `undefined` is left out too:

```js
const pet = { name: "Rex", age: undefined, bark() {} };
console.log(JSON.stringify(pet));
```

```text
{"name":"Rex"}
```

To keep only some properties, make a small object with just those, and turn that into JSON.

## Break it on purpose

Put the object straight into a text: `` `Saved: ${player}` ``. You get `Saved: [object Object]`, as with any object in a text. Only `JSON.stringify` writes out what's inside. Then call it on an object that has a property you didn't want: it ends up in the text too. JSON writes everything the object holds, apart from functions.

---

## Mission: The settings as a text

Soon the settings will be saved in the browser, as a text. To see what will be saved, the page should show it.

**Example**: under the settings, the page says:

```text
As text: {"theme":"system","motion":"full"}
```

Click Dark, and it says `As text: {"theme":"dark","motion":"full"}`.

- After the box of settings, a paragraph with the id `settings-text`.
- It says `As text: `, then a JSON text of an object with two properties, `theme` and `motion`, which hold the chosen theme and motion.
- It shows when the page opens, with the motion too, and changes each time a theme is chosen.

Psst, make a small object with the two properties, and turn that one into JSON :)
