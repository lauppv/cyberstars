Selma started her first job two months ago, and she doesn't know where her salary goes. Her bank's app can save all her payments in a CSV file: a text file where each line is one row and commas separate the values. But it's just a long list of numbers.

So Selma writes a few rules of her own, like "anything with Lidl in it is food". She wants a program that puts every payment into a group by these rules, and then tells her how much went where, which month cost more, and which payments come back every month.

**The input** has two parts. First Selma's rules, one on each line: a word to look for, `=`, and the name of a group (we call the group a category). An empty line ends the rules. Then the bank's file: a first line with the column names, then one payment on each line: the date, the description and the amount. Money that came in is positive, money spent is negative:

```text
fresh market=food
lidl=food
netflix=fun
spotify=fun
cinema=fun
salary=income
rent=home
enel=home
uber=transport

date,description,amount
2026-09-01,Salary ACME Ltd,4500.00
2026-09-02,Rent September,-1500.00
2026-09-03,"Fresh Market, Main St. 12",-212.40
2026-09-05,Netflix,-49.99
2026-09-10,Uber trip,-23.50
2026-09-14,Lidl Park Road,-180.10
2026-09-20,Enel invoice,-161.00
2026-09-25,Spotify,-25.99
2026-10-01,Salary ACME Ltd,4500.00
2026-10-02,Rent October,-1500.00
2026-10-04,Corner Pharmacy,-64.25
2026-10-05,Netflix,-49.99
2026-10-09,"Cinema City, Mall",-58.00
2026-10-25,Spotify,-25.99
2026-10-28,Gift from mom,300.00
```

**The output** for this input, when the program is finished:

```text
Rules: 9, transactions: 15
In: 9300.00
Out: 3851.21
Left: 5448.79

Spending by category:
  home         3161.00   82%
  food          392.50   10%
  fun           209.96    5%
  other          64.25    2%
  transport      23.50    1%

Spending by month:
  2026-09    2152.98
  2026-10    1698.23

Biggest expenses:
  2026-09-02  Rent September  1500.00
  2026-10-02  Rent October  1500.00
  2026-09-03  Fresh Market, Main St. 12  212.40

Subscriptions:
  Netflix  49.99 a month (2 months)
  Spotify  25.99 a month (2 months)
```

Some words you will meet:

| Word         | What it means                                                               |
| ------------ | --------------------------------------------------------------------------- |
| transaction  | one line of the bank's file: money that came in or went out                 |
| category     | the group a transaction goes in, like `food` or `home`                      |
| expense      | a transaction where money went out (a negative amount)                      |
| subscription | the same payment, with the same amount, in two months or more, like Netflix |

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D). This tells your program that there are no more lines, so it can print its report.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other people's files. Passing them finishes the project.

## Read the rules and the statement

Read the rules first, until the empty line. Then read the line with the column names and don't keep it. Then read the transactions until the input ends: when there are no more lines, `input()` stops with an error called `EOFError`. Catch it and leave the loop.

Print how many rules and how many transactions you read:

```text
Rules: 9, transactions: 15
```

## Commas inside a description

Look at the Fresh Market line. Its description has a comma of its own, so the bank put it in quotes:

```text
2026-09-03,"Fresh Market, Main St. 12",-212.40
```

If you cut this line at every comma, you get four pieces, not three. But the date never has a comma, and the amount never has one. So cut only at the first comma and at the last one:

- `line.split(',', 1)` cuts once, from the left
- `rest.rsplit(',', 1)` cuts once, from the right
- `strip('"')` takes the quotes off the description

Keep the amounts as whole cents, not as decimals: `round(float(amount) * 100)` turns `-212.40` into `-21240`. Sums of whole numbers are always exact, and sums of decimals sometimes are not.

## Put each one in a category

A transaction goes in the category of the **first** rule whose word is in its description. Small and capital letters don't matter: `Fresh Market` matches `fresh market`. When no rule matches, the category is `other`.

Then print what came in, what went out (as a positive number) and what is left, with two digits after the point:

```text
In: 9300.00
Out: 3851.21
Left: 5448.79
```

## Where the money went

Print an empty line and `Spending by category:`. Then one line for every category that has expenses: the biggest amount first, and on equal amounts by name, from A to Z. Only money that went out counts here, never money that came in. Each line also shows the category's part of all the money spent, in percent:

```text
Spending by category:
  home         3161.00   82%
  food          392.50   10%
  fun           209.96    5%
  other          64.25    2%
  transport      23.50    1%
```

Each line is made like this:

| Part                                        | Width                     | Side  |
| ------------------------------------------- | ------------------------- | ----- |
| two spaces                                  |                           |       |
| the category                                | the longest category name | left  |
| two spaces                                  |                           |       |
| the amount, two digits after the point      | 9                         | right |
| two spaces                                  |                           |       |
| the percent, rounded with `round`, then `%` | 3                         | right |

## Month by month

Print an empty line and `Spending by month:`. Then the money spent in each month, the oldest month first. The month is the first seven characters of the date (`2026-09`). Each line is two spaces, the month, two spaces and the amount right-aligned in 9 characters:

```text
Spending by month:
  2026-09    2152.98
  2026-10    1698.23
```

## The biggest expenses

Print an empty line and `Biggest expenses:`. Then the three biggest expenses, the biggest first. If two are equal, the one with the earlier date comes first. Each line is two spaces, the date, two spaces, the description, two spaces and the amount:

```text
Biggest expenses:
  2026-09-02  Rent September  1500.00
  2026-10-02  Rent October  1500.00
  2026-09-03  Fresh Market, Main St. 12  212.40
```

If there are fewer than three expenses, list the ones there are.

## Subscriptions

A subscription is an expense with the same description and the same amount in two different months or more. Print an empty line and `Subscriptions:`, then one line for each: the biggest amount first, and on equal amounts by description. Say in how many different months it came:

```text
Subscriptions:
  Netflix  49.99 a month (2 months)
  Spotify  25.99 a month (2 months)
```

If there are none, print `Subscriptions: none` in place of all this.

A dictionary helps here: the key is the pair (description, amount), and the value is the set of months where it came. One pass over the expenses fills it. Selma stopped one of her subscriptions the same evening.
