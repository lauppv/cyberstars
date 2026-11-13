In a message to a friend, you may write "tmrw" for "tomorrow". Same meaning, fewer letters. JavaScript has a shorter way to write a function too: the **arrow function**. You have used it already, in `addEventListener("click", () => { ... })`.

## An arrow function in a variable

Here is a function you know how to write:

```js
function double(number) {
  return number * 2;
}
```

The same function, written with an arrow:

```js
const double = (number) => {
  return number * 2;
};

console.log(double(21));
```

```text
42
```

Read it from left to right:

- `const double =` makes a variable, as always. What goes in it is a function;
- `(number)` holds the parameters, as after a function's name;
- `=>` is the arrow: "this goes to". Type it as `=` and `>`;
- between `{` and `}`: the steps, with `return`, as before.

You call it the same way: `double(21)`. The line ends with `;`, as every line that makes a `const` does.

## The short one that returns

Many functions only work out one value and hand it back. For those, the arrow has a short form: no braces, and no `return`.

```js
const double = (number) => number * 2;

console.log(double(5));
```

```text
10
```

With no braces after the arrow, the function gives back the value after `=>`, all by itself. It works for a text too:

```html preview
<p id="price"></p>
<script>
  const priceLine = (tickets) => `${tickets} tickets cost ${tickets * 4} euros`;

  document.querySelector("#price").textContent = priceLine(3);
</script>
```

The page says:

```text
3 tickets cost 12 euros
```

Change `priceLine(3)` to `priceLine(5)`, and it says `5 tickets cost 20 euros`. A function with no parameters keeps its empty brackets: `const hello = () => "Hello!";`.

## Break it on purpose

Keep the braces, but leave out `return`:

```js
const double = (number) => {
  number * 2;
};

console.log(double(21));
```

```text
undefined
```

No error, but no answer. With braces, the steps are a normal block, and a block hands back nothing without `return`. So pick one of the two forms: no braces and no `return`, or braces with `return`.

---

## Mission: How many articles?

The wiki's front page, `wiki.html`, has no script yet. The editor has a new, empty file for it, `wiki.js`. Load it from the head of `wiki.html`, with `defer`, as your other pages load theirs.

**Example**: under the wiki's first paragraph, the page says:

```text
3 articles in the wiki
```

- Under the wiki's first paragraph, an element with the id `article-count` says how many articles the list `.wiki-list` holds, followed by ` articles in the wiki`.
- The script counts the articles on the page. When a writer adds an article to the list, the line is right, with no change to `wiki.js`.
- An arrow function, kept in a variable, takes the number and returns the whole line.

Psst, an arrow with braces needs its `return` :)
