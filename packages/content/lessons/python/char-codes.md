A computer stores only numbers. So every character, a letter, a digit or a space, has its own number, called its **code**. Python gives us two functions to move between a character and its code: `ord()` and `chr()`

---

`ord()` takes one character and gives back its code

```py
print(ord("A"))
print(ord("B"))
print(ord("a"))
print(ord(" "))
```

Output

```text
65
66
97
32
```

The capital letters have the codes 65 to 90, in the order of the alphabet. The small letters have the codes 97 to 122. That's why `"A"` and `"a"` are different for Python: they are different numbers

---

`chr()` does the opposite: it takes a code and gives back the character

```py
print(chr(72) + chr(105))
```

Output

```text
Hi
```

---

Since the letters are in order, we can do math with them. To get the letter after `"c"`, we take its code, add 1, and turn it back into a character

```py
letter = "c"
print(chr(ord(letter) + 1))
```

Output

```text
d
```

How far is a letter from the start of the alphabet? Take away the code of `"a"`

```py
for letter in "cab":
    print(letter, ord(letter) - ord("a"))
```

Output

```text
c 2
a 0
b 1
```

`"a"` is at 0, `"b"` at 1, and `"z"` at 25. This trick works for any small letter, and we don't need to remember a single code

---

We can also check what kind of character we have, by looking at its code

```py
for character in "R2d2":
    code = ord(character)
    if code >= ord("0") and code <= ord("9"):
        print(character, "is a digit")
    else:
        print(character, "is not a digit")
```

Output

```text
R is not a digit
2 is a digit
d is not a digit
2 is a digit
```

---

## Mission: Mirror Code

The crew sends secret words in mirror code: each letter is swapped with the letter at the same place from the other end of the alphabet. `a` becomes `z`, `b` becomes `y`, `c` becomes `x`, and so on, up to `z`, which becomes `a`

1. Start your program with a variable **word**, a string. For example `word = "moon"`
2. Print `Codes: ` and the code of each letter of the word, with one space between the codes
3. Print `Mirror: ` and the word in mirror code

Work it out with `ord()` and `chr()`, not with a string of the whole alphabet. **word** has from 1 to 20 letters, all small letters from `a` to `z`

**Example** for word = "moon"

```text
Codes: 109 111 111 110
Mirror: nllm
```

**Example** for word = "abz"

```text
Codes: 97 98 122
Mirror: zya
```
