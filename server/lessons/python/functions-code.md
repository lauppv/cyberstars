def calculator(number1, number2, operator):
    if operator == "+":
        result = number1 + number2
        print(f"{number1} {operator} {number2} = {result}")
    else:
        print("Invalid operator")

calculator(14, 12, "+")
calculator(20, 8, "-")
calculator(6, 7, "\*")
calculator(20, 4, "/")
