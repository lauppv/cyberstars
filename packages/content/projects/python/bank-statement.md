Selma has been working for two months and has no idea where her salary goes. Her bank's app can export every transaction to a CSV file, but it's a wall of numbers. She writes a few rules of her own, like "anything with Lidl in it is food", and wants a program that sorts every transaction by them and tells her how much went where, which month was expensive, and which subscriptions quietly take money every month.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests feed your program other people's statements. Passing them finishes the project.

The program reads everything first and then prints its report.

## Read the rules and the statement

The input starts with Selma's rules, one per line as `keyword=category`, and an empty line after the last one. Then comes the bank's export: a header line, then one transaction per line, the date, the description and the amount, separated by commas. Money that came in is positive, money spent negative:

```text
fresh market=food
lidl=food
netflix=fun
salary=income
rent=home

date,description,amount
2026-09-01,Salary ACME Ltd,4500.00
2026-09-02,Rent September,-1500.00
2026-09-03,"Fresh Market, Main St. 12",-212.40
```

Read the rules until the empty line, skip the header, then read transactions until the input ends (`input()` raises `EOFError` then). Print how many of each: `Rules: 9, transactions: 15`.

## Commas inside a description

Look at the Fresh Market line: its description has a comma of its own, so the bank put it in quotes. Splitting the whole line on commas would cut it in four. But the date never has a comma and neither does the amount, so cut only the first comma and the last: `line.split(',', 1)` splits once from the left, `rest.rsplit(',', 1)` once from the right. Then take the quotes off the description with `strip('"')`.

Amounts like `-212.40` are money: keep them as whole cents (`round(float(amount) * 100)`), so the sums come out exact.

## Sort by the rules

A transaction belongs to the category of the **first** rule whose keyword appears in its description, ignoring capitals (`Fresh Market` matches `fresh market`). A transaction no rule matches is `other`.

Then print what came in, what went out (as a positive number) and what's left, with two decimals:

```text
In: 9300.00
Out: 3851.21
Left: 5448.79
```

## Where the money went

After an empty line, list the spending of every category that has any, the most first (ties by name), each with its share of all spending:

```text
Spending by category:
  home         3161.00   82%
  food          392.50   10%
  fun           209.96    5%
  other          64.25    2%
  transport      23.50    1%
```

Each line is two spaces, the category left-aligned as wide as the longest category name, two spaces, the amount right-aligned in 9, two spaces, and the share right-aligned in 3 followed by `%`, rounded with `round`. Only money spent counts here, never money that came in.

## Month by month

After an empty line, the spending of each month, the date's first seven characters, oldest first:

```text
Spending by month:
  2026-09    2152.98
  2026-10    1698.23
```

The amount is right-aligned in 9, as above.

## The biggest ones

After an empty line, the three biggest expenses, the biggest first (on a tie, the earlier date first):

```text
Biggest expenses:
  2026-09-02  Rent September  1500.00
  2026-10-02  Rent October  1500.00
  2026-09-03  Fresh Market, Main St. 12  212.40
```

With fewer than three expenses, list the ones there are.

## Subscriptions

Subscriptions hide well: the same description and the same amount, spent in two months or more. After an empty line, list each one, the biggest amount first (then by description), with how many different months it appeared in:

```text
Subscriptions:
  Netflix  49.99 a month (2 months)
  Spotify  25.99 a month (2 months)
```

With none, print `Subscriptions: none` instead. A dictionary keyed by the pair (description, amount), holding the set of months it appeared in, finds them in one pass. Selma cancelled one of them the same evening.
