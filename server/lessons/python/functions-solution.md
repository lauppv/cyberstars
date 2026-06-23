```py
def calculator(a, b, operator):
    if operator == "+":
        print(f"{a} + {b} = {a + b}")
    elif operator == "-":
        print(f"{a} - {b} = {a - b}")
    elif operator == "*":
        print(f"{a} * {b} = {a * b}")
    elif operator == "/":
        print(f"{a} / {b} = {a / b}")
    else:
        print("Invalid operator")

calculator(14, 12, "+")
calculator(20, 8, "-")
calculator(6, 7, "*")
calculator(20, 4, "/")
calculator(5, 2, "%")
```
