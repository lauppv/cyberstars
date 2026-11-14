Mr. Noah has a hardware shop, and the calculator at his till does only one operation at a time. To work out three boxes of screws with a discount, plus delivery, he writes the results in between on a piece of paper. He wants to type the whole calculation at once, with brackets, like `(3 * 45 - 20) * 2 + 15`, and get the answer. You will write this calculator in C, the way real calculators work inside: with two stacks, one for numbers and one for operators.

**How it works.** Each line is one calculation, and the program answers it at once. Here is a session as you see it in the output box when you run a finished program. Each line you type is followed by the program's answer:

```text
2 + 3 * 4
= 14
(2 + 3) * 4
= 20
100 / 7
= 14
100 % 7
= 2
ans * 2
= 4
8 - 3 - 2
= 3
2 * -3
= -6
-(4 + 1) * 2
= -10
p = 12 * 3
p = 36
q = p / 4 + 1
q = 10
p - q
= 26
z + 1
Error: unknown name
7 / (3 - 3)
Error: division by zero
(1 + 2
Error: unbalanced brackets
1 + 2)
Error: unbalanced brackets
4 +
Error: missing number
3 4
Error: missing operator
12 $ 3
Error: unexpected character
quit
Bye
```

Some words you will meet:

| Word     | What it means                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| operator | a sign that does something with numbers: `+ - * / %`                                                                                        |
| stack    | a pile: you put things on top, and you take them off the top, the last one first. In C, an array and a counter of how many things are in it |
| `ans`    | the last answer the calculator gave                                                                                                         |
| variable | a small letter that keeps a result, like `p`                                                                                                |

**To try your program**, press Run and type the calculations in the output box, one on each line. `quit` ends the program.

Build the program one step at a time, in one C file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests type other calculations. Passing them finishes the project.

## Numbers and the answer

Read whole lines with `fgets`, until the input ends or a line is `quit`. Then print `Bye`. Skip empty lines.

Start with the easiest calculations: whole numbers, `+` and `-`, and spaces anywhere. Go through the line one character at a time:

- digits one after the other make a number. Build it digit by digit: `v = v * 10 + (c - '0')`
- a `+` or `-` is an operator

Work them out from left to right, and print the result after `= `:

```text
8 - 3 - 2
= 3
```

Numbers are whole, and they can get big: keep them in `long long` and print them with `%lld`.

## Two stacks

`2 + 3 * 4` is 14, not 20, because `*` comes first. To get this right, keep two stacks: an array of numbers and an array of operators, each with a counter. While you read the line:

- a number goes on top of the number stack
- an operator first works out every operator on top of its stack that comes **before it or at the same time**, then it goes on the stack itself. `*`, `/` and `%` come before `+` and `-`, and operators of the same kind go from left to right

To work out an operator, take it off its stack, take two numbers off the number stack, and put the result back on it. At the end of the line, work out all the operators that are left. The one number left on the stack is the answer.

```text
2 + 3 * 4
= 14
100 / 7
= 14
100 % 7
= 2
```

`/` divides whole numbers and drops what is left over, like C does. `%` gives what is left over.

## Brackets

A `(` goes on the operator stack as it is. A `)` works out the operators until it gets to the `(`, then throws the `(` away. And no operator is worked out past a `(` on the stack:

```text
(2 + 3) * 4
= 20
```

## Negative numbers

A `-` where a number should come is not a subtraction: it makes what comes after it negative. That is a `-` at the start, after an operator, or after a `(`. Give it a sign of its own on the operator stack, like `u`. It comes before every other operator, and it takes only one number:

```text
2 * -3
= -6
-(4 + 1) * 2
= -10
```

## Mistakes

When a line is not a correct calculation, print an error in place of the result, and go on with the next line:

| Error                         | When                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `Error: missing number`       | an operator or a `)` where a number should come, or a line that ends with an operator |
| `Error: missing operator`     | a number, a name or a `(` right after a number                                        |
| `Error: unbalanced brackets`  | a `)` with no `(` before it, or a `(` that is never closed                            |
| `Error: unexpected character` | a character that is not a digit, a letter, a space, an operator or a bracket          |
| `Error: division by zero`     | dividing by 0, with `/` or `%`                                                        |

One variable that says if a number or an operator should come next, changed as you go, finds the first two.

## Remember things

Mr. Noah uses his results again:

- `ans` in a calculation is the last answer (0 at the start). A line with an error doesn't change it
- a line like `p = 12 * 3` keeps the result in a variable, one small letter, and prints `p = 36`. It is also the new `ans`
- a variable used later means its value: `q = p / 4 + 1` gives `q = 10`

For a name that is not `ans` or a kept variable, print `Error: unknown name`. Mr. Noah threw his pieces of paper away.
