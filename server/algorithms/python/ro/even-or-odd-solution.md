```py
n = int(input())

# Un numar este par daca restul impartirii la 2 este 0.
# Restul negativ nu este o problema: -3 % 2 este 1 in Python.
if n % 2 == 0:
    print("Par")
else:
    print("Impar")
```
