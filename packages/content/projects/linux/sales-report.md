Green Corner sells house plants online and sends them all over Europe. The shop's website saves every order of the month in a CSV file. At the end of October the owner, Sara, wants answers: how much money came in, which plants sell, and which cities order the most. The shop's server has no spreadsheet program, only a terminal. That is enough.

**What you start with.** `~/shop/orders.csv`, October's orders. The first line names the columns. Every other line is one order, with commas between its fields. `price` is the price of one plant, and `qty` is how many were bought.

**What you make.**

| File             | What it holds                          |
| ---------------- | -------------------------------------- |
| `data.csv`       | the orders, without the first line     |
| `clean.csv`      | the orders with a typing mistake fixed |
| `by-city.txt`    | how much money each city brought       |
| `by-product.txt` | how many of each plant were sold       |
| `report.txt`     | the month's numbers, in five lines     |

Some words you will meet:

| Word        | What it means                                               |
| ----------- | ----------------------------------------------------------- |
| CSV file    | a text file where commas separate the values on each line   |
| header      | the first line of a CSV file, with the names of the columns |
| field       | one value of a line, like the city or the price             |
| revenue     | all the money that came in                                  |
| best seller | the product sold the most                                   |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when you have its numbers, or when its file holds what the step asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Look at the export

You start in `~/shop`. Look at the first lines of `orders.csv`. How many orders did October have?

## Only the orders

The header would get in the way of every count. Save every line except the first one to `data.csv`.

A new idea: `tail` can print a file from a given line to the end, instead of counting lines from the end. `tail --help` says how.

## Fix the typo

Count the orders for each plant. One of the plant names is not a plant: someone typed it wrong when they took an order by phone. Save `data.csv`, with that name fixed, to `clean.csv`. Change only that field, never the same letters inside another field. Count again to check.

Every next step reads `clean.csv`.

## What came in

How much money did October bring? An order brings its quantity times its price. And how many plants did Green Corner send in all?

A new idea: `awk` cuts lines at spaces, unless you give it another separator with `-F`.

## The biggest orders

Which three orders brought the most money, and who made them? Sara will send a thank-you card to the customer at the top.

## Money per city

Save to `by-city.txt` how much money each city brought: one city on each line, first the amount and then the city, the biggest first.

A new idea: an `awk` variable can keep one value for each name, like a dictionary, and the `END` block can go through every name it saw. For example, this keeps each player's last score:

```bash
awk '{last[$1] = $2} END {for (p in last) print p, last[p]}' scores.txt
```

`awk` goes through the names in no fixed order.

## Plants that sell

Do the same for each plant, but add up the plants sold instead of the money, and save it to `by-product.txt`: first the number of plants and then the plant, the most sold first.

Counting orders and counting plants don't give the same order of winners. Which one should Sara use when she buys plants for November?

## First half, second half

Did sales grow during the month? Add up the money of the orders up to October 15th, then of the orders after it. Dates written like `2026-10-15` can be compared like text, so `awk` can compare them as text.

Then write the month's numbers to `report.txt` from the terminal, one on each line, with what you found:

```text
Orders: <how many orders>
Plants shipped: <how many plants in all>
Revenue: <how much money came in>
Best city: <the city that brought in the most>
Best seller: <the plant sold the most, counted in plants>
```
