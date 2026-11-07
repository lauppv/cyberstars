Green Corner sells house plants online and ships them across the country. The shop's website exports every order of the month to a CSV file, and at the end of October the owner, Sara, wants answers: how much came in, which plants sell, which cities order the most. She has no spreadsheet program on the shop's server, only a terminal. That's enough.

You build the report one step at a time, in the terminal on the right. Tick a step off once you get its numbers, or its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Look at the export

You start in `~/shop`, where `orders.csv` holds October's orders. Look at its first lines: the first one names the columns, and every other line is an order, its fields separated by commas. `price` is the price of one plant, `qty` how many were bought. How many orders did October have?

## Only the orders

The header line would get in the way of every count. Save every line but the first to `data.csv`.

New idea: `tail` can print a file from a given line on, instead of counting lines from the end. `tail --help` says how.

## Fix the typo

Count the orders per plant. One of the plant names isn't a plant: someone mistyped it when adding orders by phone. Save `data.csv` with that name corrected to `clean.csv`, changing only that field, never the same letters inside another field. Count again to check.

Every step from here reads `clean.csv`.

## What came in

How much money did October bring in? An order brings in its quantity times its price. And how many plants did Green Corner ship in all?

New idea: `awk` splits lines on spaces unless you give it another separator with `-F`.

## The biggest orders

Which three orders brought in the most, and who placed them? Sara will send the customer who comes out on top a thank-you card.

## Money per city

Save to `by-city.txt` how much each city brought in, one city a line, the amount and then the city, the largest first.

New idea: an `awk` variable can hold one value per name, like a dictionary, and the `END` block can go through every name it saw. For example, this keeps each player's last score:

```bash
awk '{last[$1] = $2} END {for (p in last) print p, last[p]}' scores.txt
```

`awk` goes through the names in no particular order.

## Plants that sell

Do the same per plant, adding up the plants sold instead of the money, and save it to `by-product.txt`: the number of plants and then the plant, the most sold first.

Counting orders and counting plants don't give the same winner order. Which one should Sara go by when she orders for November?

## First half, second half

Did sales pick up during the month? Add up what came in on orders up to October 15th, then on the orders after it. Dates written as `2026-10-15` compare like text, so `awk` can compare them as text.

Then write the month's facts to `report.txt` from the terminal, one per line, with the numbers you found:

```text
Orders: <how many orders>
Plants shipped: <how many plants in all>
Revenue: <how much money came in>
Best city: <the city that brought in the most>
Best seller: <the plant sold the most, counted in plants>
```
