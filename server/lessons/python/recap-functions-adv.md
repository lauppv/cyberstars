Combine **scope**, **default parameters**, **multiple return values**, and **try/except**

---

Build a **safe math toolkit**. Write these functions:

**safe_divide(a, b, decimals=2)** — divides a by b, rounded to **decimals** decimal places (use **round()**). If b is 0, **return None** instead of crashing. The **decimals** parameter has a **default value** of 2

**stats(numbers)** — takes a list of numbers and returns **three values**: the min, max, and average. Use **multiple return**

**process(expression)** — takes a string like "10 / 3" and uses **try/except** to handle errors. Split the string, convert to numbers, and call safe_divide. If anything goes wrong, print "Error: invalid expression"

Test with:

```python
print(safe_divide(10, 3))
print(safe_divide(10, 3, 4))
print(safe_divide(10, 0))

lo, hi, avg = stats([4, 8, 15, 16, 23, 42])
print(f"Min: {lo}, Max: {hi}, Avg: {avg}")

process("10 / 3")
process("hello / world")
```

Expected output

```text
3.33
3.3333
None
Min: 4, Max: 42, Avg: 18.0
3.33
Error: invalid expression
```
