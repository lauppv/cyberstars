Irina just moved into her first flat, and by the 20th of every month her money is gone without her knowing where. She wants a small program to type every purchase into: it tells her what is left, warns her before a category runs over the limit she set, and shows at the end of the month where the money went.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## The month's money

The first line is what Irina has for the month. Print it back with two decimals, `Budget for the month: 3000.00`. Then keep reading commands, one per line, until she types `done`, and print `See you next month` then. Every other command can be ignored for now.

## Spend

`spend <category> <amount>` records a purchase. A category is one word she makes up as she goes (`food`, `rent`, `fun`), and amounts can have decimals. Say what is left of the month's money after it:

```text
spend food 45.50
Spent 45.50 on food, 2954.50 left
```

Keep a running total per category, since later steps need them.

## Limits

`limit <category> <amount>` sets how much Irina wants to spend on a category this month:

```text
limit food 300
Limit for food: 300.00
```

From then on `spend` can add a second line about that category:

- once its spending passes the limit, every purchase in it warns: `Warning: food is 35.50 over its limit`
- the purchase that takes it to 80% of the limit or more, without passing it, says once: `Careful: food is at 85% of its limit`, the percentage rounded to a whole number

```text
spend food 210
Spent 210.00 on food, 2744.50 left
Careful: food is at 85% of its limit
spend food 80
Spent 80.00 on food, 2664.50 left
Warning: food is 35.50 over its limit
```

The careful line only comes on the purchase that crosses 80%, so remember where the category stood before the purchase. A limit can be set before or after the first purchase in its category, and setting it again replaces it.

## Extra money

`earn <amount>` adds money to the month (a birthday gift, a weekend job):

```text
earn 200
Earned 200.00, 1604.50 left
```

## Where it went

`categories` lists what was spent in each category, the most first; two with the same amount go by name. A category with a limit shows it too:

```text
categories
rent: 1200.00
food: 335.50 of 300.00
fun: 60.00
```

Before anything is spent, print `Nothing spent yet`.

## Undo

Irina sometimes types a purchase twice. `undo` takes back the last `spend` or `earn` that went through, and saying `undo` again takes back the one before it, all the way to the start of the month:

```text
undo
Undid earning 200.00, 1404.50 left
undo
Undid spending 60.00 on fun, 1464.50 left
```

With nothing left to undo, print `Nothing to undo`. A category whose spending is all undone disappears from `categories`. Decimal numbers don't always add up exactly in Python (`0.1 + 0.2` isn't quite `0.3`), so round a total to two decimals before checking whether it's zero. `limit` isn't undone.

## End of the month

`summary` shows the month at a glance:

```text
summary
Income: 3000.00
Spent: 1565.50
Left: 1434.50
Biggest: rent (77% of spending)
Over the limit: food
```

- **Income** is the starting money plus what was earned.
- **Biggest** is the category she spent most on (on a tie, the first by name) and its share of all spending, rounded to a whole percentage; before any spending, `Biggest: none`.
- **Over the limit** lists every category past its limit, sorted, separated by commas, or `none`.

## Survive bad input

Your program must never stop with an error, whatever Irina types:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: spnd`
- a known command with the wrong number of words prints how to use it: `Usage: spend <category> <amount>`, `Usage: earn <amount>`, `Usage: limit <category> <amount>`, and `Usage: categories`, `Usage: undo` or `Usage: summary` when words follow them
- an amount that isn't a number prints the same usage line
- an amount of zero or less prints `Amounts must be positive` and records nothing

Use `try` / `except` around the conversion rather than checking the characters yourself.
