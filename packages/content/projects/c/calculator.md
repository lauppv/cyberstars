Mr. Radu runs a hardware store, and his till's calculator only does one operation at a time: to work out a discount on three boxes of screws plus delivery, he writes intermediate results on a scrap of paper. He wants to type the whole thing, brackets and all, like `(3 * 45 - 20) * 2 + 15`, and get the answer. You'll write that calculator, the way real ones work inside: two stacks, one for numbers and one for operators.

You build it one step at a time, in one C file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests type sums your program has never seen. Passing them finishes the project.

Every line is a sum to work out, so read whole lines with `fgets`, until the input ends or a line says `quit`; then print `Bye`. Skip empty lines.

## Numbers and the answer

Start with the simplest sums: whole numbers, `+` and `-`, spaces anywhere. Walk through the line character by character: a run of digits is a number (build it digit by digit, `v = v * 10 + (c - '0')`), a `+` or `-` an operator. Work them out left to right and print the result after `= `:

```text
8 - 3 - 2
= 3
```

Numbers are whole, and can grow large: keep them in `long long` (`%lld`).

## Two stacks

`2 + 3 * 4` is 14, not 20: `*` comes first. To get that right, keep two stacks: an array of numbers and an array of operators, each with a counter of how many it holds. Reading the line:

- a number goes on the number stack
- an operator first works out every operator on top of its stack that comes **before or together with it** (`*`, `/` and `%` before `+` and `-`; equals left to right), then goes on the stack itself

To work out an operator, take it off its stack, take two numbers off theirs, and put the result back. At the end of the line, work out whatever is left; the one number on the stack is the answer.

```text
2 + 3 * 4
= 14
100 / 7
= 14
100 % 7
= 2
```

`/` divides whole numbers and drops the rest, like C does, and `%` is the rest.

## Brackets

A `(` goes on the operator stack as it is. A `)` works out operators until it reaches the `(`, then throws the `(` away. And no operator works out past a `(` sitting on the stack:

```text
(2 + 3) * 4
= 20
```

## Negative numbers

A `-` where a number should come, at the start, after an operator or after a `(`, isn't a subtraction: it makes what follows negative. Give it a symbol of its own on the operator stack, say `u`, that comes before everything else and only takes one number:

```text
2 * -3
= -6
-(4 + 1) * 2
= -10
```

## Mistakes

When the line isn't a proper sum, print an error instead of a result, and go on with the next line:

- an operator or a `)` where a number should come, or a line ending after an operator: `Error: missing number`
- a number, a name or a `(` right after a number: `Error: missing operator`
- a `)` with no `(` before it, or a `(` never closed: `Error: unbalanced brackets`
- a character that isn't a digit, a letter, a space, an operator or a bracket: `Error: unexpected character`
- dividing by 0, with `/` or `%`: `Error: division by zero`

Knowing whether a number or an operator should come next, one variable you flip as you go, catches the first two.

## Remember things

Mr. Radu reuses results:

- `ans` in a sum is the last answer the calculator gave (0 at the start; a line with an error doesn't change it)
- a line like `p = 12 * 3` saves the result in a variable, a single small letter, and prints `p = 36`; it's also the new `ans`
- a variable used later stands for its value: `q = p / 4 + 1` gives `q = 10`

A name that isn't `ans` or a saved variable prints `Error: unknown name`. Mr. Radu threw away his scraps of paper.
