def calculator(numar1, numar2, operator):
    if operator == "+":
        rezultat = numar1 + numar2
        print(f"{numar1} {operator} {numar2} = {rezultat}")
    else:
        print("Operator invalid")

calculator(14, 12, "+")
calculator(20, 8, "-")
calculator(6, 7, "\*")
calculator(20, 4, "/")
