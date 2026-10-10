def calculator(x, y, op):
    ops = {
        "+": lambda p, q: p + q,
        "-": lambda p, q: p - q,
        "*": lambda p, q: p * q,
        "/": lambda p, q: p / q,
    }
    if op in ops:
        print(x, op, y, "=", ops[op](x, y))
    else:
        print("Invalid operator")


n1 = int(input())
n2 = int(input())
sign = input()
calculator(n1, n2, sign)
