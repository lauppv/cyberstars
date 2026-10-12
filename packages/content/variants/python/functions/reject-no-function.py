a = int(input())
b = int(input())
operator = input()
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
