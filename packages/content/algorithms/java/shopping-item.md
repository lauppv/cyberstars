Create an **Item** class with three fields: `name` (String), `price` (double), and `quantity` (int). Add a `getTotal()` method that returns `price * quantity`.

Read N items from stdin. For each item, create an `Item` object. At the end, print the grand total cost of all items, formatted to two decimal places.

### Input

- Line 1: an integer N, the number of items (0 <= N <= 2·10^4)
- For each item, three lines:
  - Line 1: the name (a single word, at most 20 characters)
  - Line 2: the price (decimal number, 0.01 <= price <= 10^4, at most 2 digits after the decimal point)
  - Line 3: the quantity (integer, 0 <= quantity <= 10^5)

### Output

- Line 1: `Total: X` (X formatted to two decimal places)

### Examples

```
Input:
2
Apple
1.50
3
Bread
2.00
2

Output:
Total: 8.50
```

```
Input:
3
Milk
3.99
1
Eggs
2.50
2
Butter
4.00
1

Output:
Total: 12.99
```

```
Input:
1
Water
0.99
1

Output:
Total: 0.99
```

A single item with quantity 1: the total is just its price.
