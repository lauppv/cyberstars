Green Corner sells house plants online and ships them across the country. The shop's website exports every order of the month to a CSV file, and at the end of October the owner, Sara, wants answers: how much came in, which plants sell, which cities order the most. She has no spreadsheet program on the shop's server, only a terminal. That's enough.

You build the report one step at a time, in the terminal on the right. Tick a step off once you get its numbers, or its file holds what the step asks; you can always come back and untick it.

The terminal starts fresh every time you open the page or press Reset, with only `orders.csv`. Each step is a command or two, so redo the ones you had done.

## Look at the export

You start in `~/shop`. Look at the first lines of `orders.csv`:

```text
order,date,customer,city,product,qty,price
1001,2026-10-01,Ioana,Iasi,Ficus,2,30
1002,2026-10-01,Paul,Cluj,Cactus,3,12
1003,2026-10-02,Elena,Timisoara,Monstera,2,45
```

The first line names the seven columns; every other line is an order, its fields separated by commas. `price` is the price of one plant, `qty` how many were bought.

`wc -l` counts 39 lines, so October had 38 orders.

## Only the orders

The header line would get in the way of every count. `tail -n +2` prints a file from its second line on; save that to `data.csv`. `wc -l data.csv` prints `38`.

## Fix the typo

Count the orders per plant: the product is the fifth field, so `cut -d, -f5`, then `sort` and `uniq -c`:

```text
     12 Cactus
      2 Fern
      8 Ficus
      2 Fikus
      8 Monstera
      5 Orchid
      1 Snake Plant
```

`Fikus` isn't a plant: someone mistyped it when adding orders by phone. Replace it with `Ficus` using `sed` and save the result to `clean.csv`. Put the commas around the word in the pattern, `s/,Fikus,/,Ficus,/`, so only a whole field changes. Count again, from the most ordered:

```text
     12 Cactus
     10 Ficus
      8 Monstera
      5 Orchid
      2 Fern
      1 Snake Plant
```

Every step from here reads `clean.csv`.

## What came in

`awk -F,` splits lines on commas instead of spaces. An order brings in its quantity times its price, fields 6 and 7. Add them up over every line and print the sum at the end:

```bash
awk -F, '{sum += $6 * $7} END {print sum}' clean.csv
```

October brought in `1898`. Add up only the quantities the same way: Green Corner shipped `69` plants.

## The biggest orders

For each order, print what it brought in, then its number and the customer. Sort the lines by that first number, largest first, and keep the top three:

```text
135 1020 Dan
135 1004 Dan
114 1030 Irina
```

Dan placed the two biggest orders of the month: Sara will send him a thank-you card.

## Money per city

Here's one new thing about `awk`: a variable can hold a value per name, like a dictionary. `total[$4] += $6 * $7` adds each order to the total of its city, and in the `END` block `for (c in total)` goes through every city that came up:

```bash
awk -F, '{total[$4] += $6 * $7} END {for (c in total) print total[c], c}' clean.csv
```

`awk` lists the cities in no particular order, so sort the lines by their number, largest first, and save them to `by-city.txt`:

```text
665 Cluj
513 Bucharest
398 Timisoara
268 Iasi
54 Brasov
```

## Plants that sell

Do the same per plant, adding up quantities instead of money, and save it to `by-product.txt`:

```text
23 Cactus
18 Ficus
13 Monstera
11 Orchid
3 Fern
1 Snake Plant
```

Counting orders said Cactus 12; counting plants says 23, since people buy cacti by the handful. Sara will order more cacti and fewer snake plants for November.

## First half, second half

Did sales pick up during the month? Dates written as `2026-10-15` sort like text, so `awk` can compare them as text. Add up what came in on orders up to the 15th, then on the orders after it:

```bash
awk -F, '$2 <= "2026-10-15" {sum += $6 * $7} END {print sum}' clean.csv
```

```text
908
990
```

The second half brought in a little more. Write the month's facts to `report.txt` with `echo` and `>>`, one per line, as Sara would like to read them:

```text
Orders: 38
Plants shipped: 69
Revenue: 1898
Best city: Cluj
Best seller: Cactus
```
