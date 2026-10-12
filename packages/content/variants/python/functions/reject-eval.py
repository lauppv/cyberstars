def calculator(a, b, operator):
    print(f"{a} {operator} {b} = {eval(str(a) + operator + str(b))}")


a = int(input())
b = int(input())
operator = input()
calculator(a, b, operator)
