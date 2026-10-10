def compute(a, b, operator):
    if operator == "+":
        return a + b
    if operator == "-":
        return a - b
    if operator == "*":
        return a * b
    return a / b


def calculator(a, b, operator):
    if operator not in ("+", "-", "*", "/"):
        print("Invalid operator")
        return
    print(f"{a} {operator} {b} = {compute(a, b, operator)}")


values = [int(input()) for _ in range(2)]
calculator(values[0], values[1], input().strip())
