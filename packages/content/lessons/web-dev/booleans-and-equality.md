"Is it raining?" "Are you older than 12?" "Is the shop open?" Some questions only have two answers: yes or no. Programs ask questions like that all the time, and JavaScript has a value for each answer: `true` and `false`.

## Booleans

`true` and `false` are values, like numbers and strings. They're called **booleans**. No quotes: `true` is a boolean, `"true"` is just a word.

```js
const doorOpen = true;
console.log(doorOpen);
```

```text
true
```

## Comparisons give a boolean

A comparison asks a question, and its answer is `true` or `false`:

```js
console.log(12 > 8);
console.log(12 < 8);
console.log(12 >= 12);
console.log(5 <= 3);
```

```text
true
false
true
false
```

- `>` bigger than, `<` smaller than;
- `>=` bigger than or equal, `<=` smaller than or equal.

You've already used them in `for` loops: `i <= 3` is a question asked before every lap.

## Comparing strings

Strings can be compared too, letter by letter, like words in a dictionary:

```js
console.log("apple" < "banana");
console.log("08:30" < "10:00");
```

```text
true
true
```

Times written as two digits, a colon and two digits compare just like the clock: `"08:30"` comes before `"10:00"`. That only works when every time has its leading zero: `"8:30"` would come **after** `"10:00"`, because the character `8` comes after `1`.

## Break it on purpose

Compare a number from the page without `Number()`:

```js
console.log("9" > "10");
```

```text
true
```

As strings, `"9"` comes after `"1"`, so `"9"` is "bigger". Numbers from the page must become numbers before they're compared.

---

## Mission: Before ten

Your site gets one more script, `schedule.js`, for the schedule page. Its first job: tell whether the first flight on the board leaves before 10:00.

**Example**: when `schedule.html` opens, the console shows:

```text
First flight leaves before 10:00: true
```

- `schedule.html` loads `schedule.js` from its head, with `defer`.
- The console shows `First flight leaves before 10:00: ` followed by `true` or `false`.
- The answer comes from the departure time in the first row of the flight table: change it to `11:15`, and the console says `false`.

Psst, the times have their leading zeros, so they compare like the clock :)
