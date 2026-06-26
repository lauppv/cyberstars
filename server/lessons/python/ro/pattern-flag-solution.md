```py
cod = input()
are_majuscula = False
are_cifra = False

for caracter in cod:
    if caracter.isupper():
        are_majuscula = True
    elif caracter.isdigit():
        are_cifra = True

suficient_de_lung = len(cod) >= 6

print(f"Are majuscula: {are_majuscula}")
print(f"Are cifra: {are_cifra}")
print(f"Suficient de lung: {suficient_de_lung}")
if are_majuscula and are_cifra and suficient_de_lung:
    print("Cod de acces valid")
else:
    print("Cod de acces invalid")
```
