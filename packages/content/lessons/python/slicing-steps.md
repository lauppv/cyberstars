In String Methods we took a piece of a string with `name[0:5]`. Now we learn two more tricks: counting from the end, and jumping over characters

---

Every character has a position, counted from 0. But Python also counts from the end, with negative numbers. The last character is at position **-1**, the one before it at **-2**, and so on

```text
 S   a   t   u   r   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

```py
planet = "Saturn"
print(planet[-1])
print(planet[-2])
```

Output

```text
n
r
```

Why is this useful? Without it, to get the last character we need the length: `planet[len(planet) - 1]`. With it, `planet[-1]` is enough, and it works for a word of any length

---

Negative positions work in slices too

```py
planet = "Saturn"
print(planet[-3:])
print(planet[:-1])
```

Output

```text
urn
Satur
```

`planet[-3:]` means "from the third character from the end, to the end", so the last three characters. `planet[:-1]` means "from the start, up to the last one, without it", so everything except the last character

---

A slice can take a third number: the **step**. It says how far to jump each time. The full form is `text[start:end:step]`

```py
code = "ABCDEFGH"
print(code[0:8:2])
print(code[::2])
print(code[1::2])
```

Output

```text
ACEG
ACEG
BDFH
```

With a step of 2, Python takes one character, jumps over the next one, takes the one after, and so on. When we leave out the start and the end, the slice covers the whole string. `code[1::2]` starts at position 1, so it takes the other half

---

The step can be negative. Then Python walks from the end to the start

```py
planet = "Saturn"
print(planet[::-1])
```

Output

```text
nrutaS
```

That's the string backwards, in one short line. With `[::-2]` Python walks backwards and also jumps over every second character

---

All of this works on lists too, in the same way

```py
numbers = [10, 20, 30, 40, 50]
print(numbers[-1])
print(numbers[::2])
print(numbers[::-1])
```

Output

```text
50
[10, 30, 50]
[50, 40, 30, 20, 10]
```

---

## Mission: Hidden Message

The station receives radio signals full of noise. The real message is hidden inside: read the signal from the end to the start, and keep only every second character, starting with the last one. The last three characters of the signal are its check code

1. Start your program with a variable **signal**, a string. For example `signal = "S7R2A9T4S"`
2. Print `Check: ` and the last three characters of the signal
3. Print `Message: ` and the hidden message

Use slices, not a loop. **signal** has from 3 to 40 characters, letters and digits only

**Example** for signal = "S7R2A9T4S"

```text
Check: T4S
Message: STARS
```

**Example** for signal = "o9l5l1e8h"

```text
Check: e8h
Message: hello
```

**Example** for signal = "x1y2z3"

```text
Check: 2z3
Message: 321
```
