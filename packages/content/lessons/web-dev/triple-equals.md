"Is your name Sam?" You don't answer "kind of". Either it is or it isn't. Checking whether two things are **the same** is one of the most common questions a program asks.

## `===`: the same

```js
console.log(3 === 3);
console.log("Sam" === "Sam");
console.log("Sam" === "sam");
```

```text
true
true
false
```

Three equals signs ask "are these exactly the same?". Strings must match letter for letter, capitals included.

The opposite is `!==`: "are these different?".

```js
console.log("Sam" !== "Lea");
```

```text
true
```

## `=` is not `===`

One `=` doesn't ask anything: it **puts** a value in a name. `score = 3` changes `score`. `score === 3` asks whether it's 3. Mixing them up is a classic mistake.

## `==`: almost the same

There's also `==`, with two signs. It tries to make the two sides the same kind first:

```js
console.log(5 == "5");
console.log(5 === "5");
```

```text
true
false
```

`==` turns the string `"5"` into a number before comparing, so it says "yes". `===` sees a number and a string, and says "no". That sounds helpful, but `==` has odd rules: `0 == ""` is `true`, for example. Always use `===`. If the two sides should be the same kind, make them so yourself, with `Number()`.

## Break it on purpose

Compare text from the page with a different capital letter:

```js
console.log(status === "on time");
```

The page says `On time`, so it's `false`. `===` is exact: check what the page really says.

---

## Mission: Boarding?

The schedule's script checks whether the first flight on the board is boarding.

**Example**: when `schedule.html` opens, the console shows:

```text
First flight boarding: true
```

- The console shows `First flight boarding: ` followed by `true` or `false`.
- The answer comes from the status in the first row of the flight table, compared with `===` to `Boarding`.

Psst, `===` is exact, capitals included :)
