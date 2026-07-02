# Easy · Shopping Item

Create a **ShoppingItem** class with three fields: `name` (String), `price` (double), and `quantity` (int). Add a `getTotal()` method that returns `price * quantity`.

Read N items from stdin. For each item, create a `ShoppingItem` object. At the end, print the grand total cost of all items, formatted to two decimal places.

### Input

- Line 1: an integer N — the number of items
- Next N lines: a string, a double, and an integer separated by spaces — name, price, quantity

### Output

- Line 1: `Total: X` (X formatted to two decimal places)

### Examples

```
Input:
2
Apple 1.50 3
Bread 2.00 2

Output:
Total: 8.50
```

```
Input:
3
Milk 3.99 1
Eggs 2.50 2
Butter 4.00 1

Output:
Total: 12.99
```

```
Input:
1
Water 0.99 1

Output:
Total: 0.99
```

A single item with quantity 1 — the total is just its price.
