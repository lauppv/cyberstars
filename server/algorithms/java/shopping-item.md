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

### Hints

- `getTotal()` should return a `double` — multiply price by quantity.
- Use `String.format("%.2f", total)` to format the output to two decimal places.
- Accumulate the grand total by summing `getTotal()` for each item.
- Each `ShoppingItem` is its own object — this is OOP in action!
