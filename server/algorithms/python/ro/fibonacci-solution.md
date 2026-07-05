```py
n = int(input())

# Pornim cu primele doua valori cunoscute din sir.
fib = [0, 1]

# Construim urmatoarele numere: fiecare = suma ultimelor doua.
while len(fib) < n:
    urmator = fib[-1] + fib[-2]
    fib.append(urmator)

# Cazul n == 1: fib are 2 elemente, dar avem nevoie doar de primul.
rezultat = []
i = 0
while i < n:
    rezultat.append(fib[i])
    i = i + 1

# Construim output-ul manual, separat prin spatii.
out = ""
i = 0
while i < len(rezultat):
    out = out + str(rezultat[i])
    if i < len(rezultat) - 1:
        out = out + " "
    i = i + 1

print(out)
```
