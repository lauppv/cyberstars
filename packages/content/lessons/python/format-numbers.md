We already print numbers with f-strings: `f"Fuel: {fuel}"`. But a number like `2.3456789` or `1250000` is hard to read. Inside the braces we can add a **format spec**, a short code after a colon that tells Python how the number should look

---

`:.2f` shows a number with exactly 2 digits after the dot. The number is rounded, not cut

```py
price = 2.3456789
print(f"{price:.2f}")
print(f"{price:.1f}")
print(f"{7:.2f}")
```

Output

```text
2.35
2.3
7.00
```

The `f` at the end means "a number with a fixed count of decimals". The variable itself doesn't change: only the way it's printed. A whole number like 7 also gets its decimals

---

`:,` puts a comma between the thousands, so big numbers are easy to read. It works together with the decimals too

```py
distance = 384400000
print(f"{distance:,}")
print(f"{1234567.891:,.2f}")
```

Output

```text
384,400,000
1,234,567.89
```

---

A number in a format spec before the dot sets the **width**: how many characters the value takes at least. Spaces fill the rest. `>` pushes the value to the right, `<` to the left. Right side for numbers, left side for names, and our columns line up

```py
print(f"{'Mars':<8}|{12.5:>8.1f}|")
print(f"{'Jupiter':<8}|{318:>8.1f}|")
```

Output

```text
Mars    |    12.5|
Jupiter |   318.0|
```

`'Mars'` takes 8 characters, the name on the left and spaces after it. `12.5` takes 8 characters too, with spaces in front of it, so the dots of the two numbers stand one under the other

---

A `0` before the width fills with zeros instead of spaces. That's how codes like `007` are made

```py
for number in range(1, 4):
    print(f"Room {number:03}")
```

Output

```text
Room 001
Room 002
Room 003
```

---

## Mission: Fuel Report

The station has a row of fuel tanks, and the engineers want a report they can read at a glance

1. Start your program with a variable **tanks**, a list of numbers: the liters in each tank. For example `tanks = [1250.5, 87.25, 30000]`
2. Print one line for each tank: `Tank `, the tank's number with 2 digits (the first tank is `01`), `: `, then the liters in a column 10 characters wide, pushed to the right, with a comma between the thousands and 2 decimals, then ` L`
3. Print a last line: `Total:` and three spaces, then the total of all the tanks in the same column, the same way, then ` L`

`Tank 01: ` and `Total:` with its three spaces are both 9 characters wide, so the numbers of the total line stand right under the others

**tanks** has from 1 to 20 tanks, each from 0 to 40,000 liters, with at most 2 decimals

**Example** for tanks = [1250.5, 87.25, 30000]

```text
Tank 01:   1,250.50 L
Tank 02:      87.25 L
Tank 03:  30,000.00 L
Total:    31,337.75 L
```
