A microwave has a "popcorn" button. You don't type in the power and the minutes each time: someone set it up once, gave it a name, and now one press does it all. In a program, a set of steps with a name of its own is a **function**.

## Making a function

```js
function showWelcome() {
  document.querySelector("#note").textContent = "Welcome to the club!";
  console.log("Welcome shown");
}
```

- `function` says "here's a new function";
- `showWelcome` is its name, made like a variable's name, in camelCase. Function names usually start with a verb: they **do** something;
- `()` after the name: always there;
- between `{` and `}`: the steps.

Making a function doesn't run it. It's like setting up the popcorn button: nothing pops yet.

## Calling it

To run the steps, you **call** the function, with its name and brackets:

```js
showWelcome();
```

Now the note says "Welcome to the club!" and the console says "Welcome shown". Call it again, and the steps run again.

## A function for a click

Remember `() => { ... }` in `addEventListener`? That was a function too, one with no name. You can give the click a named function instead:

```js
document.querySelector("#hello").addEventListener("click", showWelcome);
```

No brackets after `showWelcome` here: you're handing the function to the button, for it to call **later**, on each click. With brackets, `showWelcome()` would run it right now instead.

## Break it on purpose

Hand it over with brackets:

```js
button.addEventListener("click", showWelcome());
```

The welcome shows at once, when the page opens, and clicks do nothing. The brackets called it immediately, and the button got nothing to call later.

---

## Mission: The alarm

The crew directory gets an alarm button.

**Example**: under the oxygen line, a button says `Sound the alarm`. Click it, and a paragraph under it says:

```text
Alarm! All crew to the bridge
```

And the console shows `Alarm sounded`.

- A button with the id `alarm`, and under it an empty paragraph with the id `intercom`.
- A function, named by you, writes `Alarm! All crew to the bridge` in `#intercom` and logs `Alarm sounded`.
- A click on the button calls that function. Before the click, nothing is written.

Psst, hand the function to the button without brackets :)
