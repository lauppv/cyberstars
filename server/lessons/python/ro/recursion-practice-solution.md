```py
coduri = [1234, 999, 5, 4070, 88]

def suma_cifre(n):
    if n < 10:
        return n
    return n % 10 + suma_cifre(n // 10)

cea_mai_mare = 0
for cod in coduri:
    suma = suma_cifre(cod)
    print(f"{cod}: {suma}")
    if suma > cea_mai_mare:
        cea_mai_mare = suma
print(f"Cea mai mare suma de control: {cea_mai_mare}")
```
