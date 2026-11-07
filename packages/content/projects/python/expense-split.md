Four friends share a flat, and every week someone buys the groceries, someone pays the internet, two of them order a pizza. They keep the sums on a sticky note on the fridge, and by the end of the month nobody knows who owes whom. You'll write the program that does: it records every expense, keeps everyone's balance and says, at the end, the few transfers that make everyone even.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## The flatmates

The program starts by reading who lives in the flat: the first line is how many, then one name per line. Print them on one line in that order:

```text
Flat of 4: Ana, Dan, Ioana, Vlad
```

Then keep reading commands, one per line, until someone types `quit`, and print `Goodbye` then.

Money has two decimals, and decimal numbers don't always add up exactly in Python (`0.1 + 0.2` isn't quite `0.3`). Keep every amount as a whole number of cents instead (12.50 is 1250), and divide by 100 only when you print. Then every sum is exact.

## Shared by everyone

`paid <name> <amount> <what>` records something one flatmate paid for everyone, split equally between all of them, the payer included. The `<what>` is one word.

```text
paid Ana 120 groceries
Ana paid 120.00 for groceries, 30.00 each
```

An amount that doesn't split evenly to the cent, such as 10.00 between three, gives everyone the share rounded down, 3.33, and the payer covers the cent left over. A name that isn't a flatmate prints `No flatmate named Mara` and records nothing.

## Balances

`balances` shows what each flatmate is owed (`+`) or owes (`-`), sorted by name. A balance goes up by what someone pays and down by their share of every expense:

```text
balances
Ana: +90.00
Dan: -30.00
Ioana: -30.00
Vlad: -30.00
```

Every balance has its sign, `+0.00` included. The balances always add up to zero: that's a good check of your program.

## Shared by some

Not everything is for everyone. `paidfor <name> <amount> <what> <name> <name> ...` records an expense split only between the names after `<what>`, who may or may not include the payer:

```text
paidfor Dan 45.50 pizza Dan Vlad
Dan paid 45.50 for pizza, split between Dan, Vlad: 22.75 each
```

Refuse it, and record nothing, when a name (the payer's or one of the group's) isn't a flatmate, `No flatmate named Mara`, checking them in the order typed; or when a name is in the group twice, `Name each person once`.

## Paying back

`gave <name> <name> <amount>` records money handed from the first flatmate to the second, to pay back what they owe:

```text
gave Vlad Ana 30
Vlad gave Ana 30.00
```

Vlad's balance goes up by 30 and Ana's down by 30. Giving to yourself prints `Giving money to yourself changes nothing`; an unknown name the usual line.

## Getting even

`settle` says who should give whom how much, so everyone ends at zero, without recording anything. Repeat until everyone is even:

- the flatmate who owes the most gives to the one who is owed the most (on a tie, the first by name)
- as much as the smaller of the two amounts, so at least one of them ends at zero

```text
settle
Vlad gives Ioana 45.00
Dan gives Ana 32.25
Vlad gives Ana 2.75
```

When everyone is already even, print `Everyone is even`. Work on a copy of the balances, so that `settle` changes nothing.

## Who was in on what

`history <name>` lists every expense and payment a flatmate took part in, paying, sharing, giving or receiving, in the order they were recorded:

```text
history Dan
Ana paid 120.00 for groceries
Dan paid 45.50 for pizza
Ioana paid 100.00 for internet
```

A flatmate with nothing yet prints `Nothing for Dan yet`, and an unknown name `No flatmate named Mara`.

## Survive bad input

Your program must never stop with an error, whatever gets typed:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: pay`
- a known command with the wrong number of words prints how to use it: `Usage: paid <name> <amount> <what>`, `Usage: paidfor <name> <amount> <what> <name> ...` (it needs at least one name in the group), `Usage: gave <name> <name> <amount>`, `Usage: history <name>`, and `Usage: balances` or `Usage: settle` when words follow them
- an amount that isn't a number, or isn't more than zero, prints the usage line of its command

Use `try` / `except` around the conversion rather than checking the characters yourself.
