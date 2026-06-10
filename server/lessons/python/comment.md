**Comments** are used to **explain** code or to **disable** certain parts of the code
In Python, a comment starts with the **#**sign

```py
# this is a comment
a = 1 + 2 + 3
print(a) # display variable a
```

This program works as we expected

```py
# now I want to disable something in the program
# without deleting it
a = 1 + 2 + 3
# print(a)
```

We can see that now the program doesn’t display anything because we commented out print(), meaning we disabled it

We often use comments to disable pieces of code without deleting them

There are also multi-line comments

```py
'''
This is a
multi-line
comment
1
2
3
'''
```

However, in future lessons we will use comments with **#**, even if they span multiple lines

```py
# this is how we will write
# our comments
# to give hints
# and to explain from now on
```

---

## Mission: Redact the Log

The code at the right prints four lines about the rocket. But the **wind speed** is classified — you must hide it **without deleting it**.

**Comment** the single line that prints `wind_speed` so that the program shows only the **ship name**, **mission name**, and **maximum power**. Don't delete anything, just add a `#`.

**Example**

After commenting the right line, your program should print

```text
Laniakea-Explorer
MARS-IX-5000
804225
```
