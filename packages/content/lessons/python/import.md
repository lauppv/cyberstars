Python comes with a big box of ready tools: functions and values for math, random numbers, dates, files and much more. They are kept in **modules**, files of Python code with a name. To use one, we bring it into our program with `import`

---

`import` and the module's name bring the whole module in. Then we reach what's inside with a dot, like a method

```py
import string

print(string.ascii_uppercase)
print(string.digits)
```

Output

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789
```

The module `string` holds handy strings: all the capital letters, all the small ones in `string.ascii_lowercase`, the digits, and the symbols in `string.punctuation`. We put our imports at the top of the program, so anyone reading it sees right away what it uses

---

`from` brings in only the names we need, and then we use them without the module's name in front

```py
from string import digits, ascii_lowercase

print("7" in digits)
print(len(ascii_lowercase))
```

Output

```text
True
26
```

This is shorter, but the reader doesn't see anymore where `digits` comes from. With `import string` and `string.digits`, it's always clear

---

`as` gives a module or a name a shorter name of our own

```py
import string as s

print(s.digits[:3])
```

Output

```text
012
```

---

Why keep things in modules at all, instead of having everything ready? Because names would clash. Many modules have a function called `choice` or `sqrt`, and our own program may have a variable with the same name. The module's name in front, like `string.digits`, keeps them apart. One trap comes from this: never name your own file like a module, for example `string.py`. Then `import string` finds your file instead of Python's module

---

## Mission: Password Check

The station's computer only lets crew members pick a strong password. A strong password has at least 8 characters, and at least one capital letter, one digit and one symbol

1. Start your program with a variable **password**, a string. For example `password = "Orbit7!x"`
2. Print `Capitals: `, `Digits: ` and `Symbols: `, each on its own line, followed by `yes` if the password has at least one of that kind of character, or `no`
3. Print `Strong: ` and `yes` if the password is strong, or `no`

Use the module `string` for the kinds of characters: `ascii_uppercase`, `digits` and `punctuation`. **password** has from 1 to 30 characters, with no spaces

**Example** for password = "Orbit7!x"

```text
Capitals: yes
Digits: yes
Symbols: yes
Strong: yes
```

**Example** for password = "moon2"

```text
Capitals: no
Digits: yes
Symbols: no
Strong: no
```
