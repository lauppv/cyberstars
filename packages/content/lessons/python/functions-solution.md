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

a = int(input())
b = int(input())
operator = input()
calculator(a, b, operator)
```
