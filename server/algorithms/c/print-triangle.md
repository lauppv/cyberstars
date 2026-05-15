# Easy · Print a Star Triangle

Read an integer **N** and print a right-aligned triangle of `*` characters. Line 1 has 1 star, line 2 has 2 stars, and so on up to line N.

This exercise practices nested loops and printing patterns.

### Input
- A single integer `N` (1 ≤ N ≤ 20)

### Output
`N` lines. Line `i` (starting from 1) contains exactly `i` asterisks (`*`), with no trailing spaces.

### Examples

```
Input:
3
Output:
*
**
***
```

```
Input:
5
Output:
*
**
***
****
*****
```

### Hints
- Use a `for` loop from `1` to `N` for the rows.
- Inside, use another `for` loop to print `i` stars on row `i`.
- Use `printf("\n")` after each row to move to the next line.