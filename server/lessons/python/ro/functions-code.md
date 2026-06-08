def calculator(number1, number2, operator):
    if operator == "+":
        rezultat = number1 + number2
        print(f"{number1} {operator} {number2} = {rezultat}") # adaugă aici cazurile -, \*, și /
    else:
        print("Operator invalid")

# --- aceste apeluri testează funcția ta (schimbă-le și pe ele) ---

calculator(14, 12, "+")
calculator(20, 8, "-")
calculator(6, 7, "\*")
calculator(20, 4, "/")
