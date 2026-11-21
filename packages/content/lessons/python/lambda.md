Some functions are so small that writing `def`, a name and `return` feels like too much. For them Python has **lambda**: a function in one short line, often without a name

---

A lambda has the word `lambda`, its parameters, a colon, and one expression. The value of that expression is what it returns, without the word `return`

```py
double = lambda x: x * 2
print(double(5))

def double_too(x):
    return x * 2
print(double_too(5))
```

Output

```text
10
10
```

Both do the same thing. A lambda can't hold several lines, loops or `if` blocks: only one expression

---

A lambda can take more than one parameter, or none

```py
add = lambda a, b: a + b
hello = lambda: "hello"
print(add(2, 3))
print(hello())
```

Output

```text
5
hello
```

---

The real power of a lambda is that we can give it to another function, like any other value. Here `apply_twice` gets a function and calls it two times

```py
def apply_twice(rule, value):
    return rule(rule(value))

print(apply_twice(lambda x: x + 10, 1))
print(apply_twice(lambda x: x * x, 3))
```

Output

```text
21
81
```

`rule` is a parameter like any other, but what's inside it is a function, so we can call it: `rule(value)`. We write the lambda right where we need it, without giving it a name first

---

The one expression can choose between two values with `if` and `else`, as we saw in If/Else

```py
label = lambda t: "hot" if t > 30 else "fine"
print(label(35))
print(label(20))
```

Output

```text
hot
fine
```

When the logic needs more than that, use `def`. A lambda is for the short, clear cases

---

## Mission: Price Rules

The station shop changes its prices with simple rules: half price for a sale, a delivery fee, or prices rounded up to the next ten. The shop wants one function that applies any rule to every price

1. Write a function **change_all(prices, rule)** that returns a new list: `rule` applied to each price, in the same order. Don't change the list it gets
2. Start your program with two variables: **prices**, a list of whole numbers, and **fee**, a whole number. For example `prices = [23, 40, 7]` and `fee = 5`
3. Print `Half price: ` and the prices cut in half, rounded down to a whole number
4. Print `With fee: ` and the prices with the fee added
5. Print `Rounded up: ` and each price rounded up to the next ten. A price that is already a ten stays the same
6. Print `Original: ` and the prices list, to show it didn't change

For steps 3 to 5, call `change_all()` with a lambda each time. **prices** has from 1 to 20 prices, each from 0 to 1000, and **fee** is from 0 to 100

**Example** for prices = [23, 40, 7] and fee = 5

```text
Half price: [11, 20, 3]
With fee: [28, 45, 12]
Rounded up: [30, 40, 10]
Original: [23, 40, 7]
```
