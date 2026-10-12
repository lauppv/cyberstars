```py
puncte_tari = [30, 65, 20, 90, 50]
cod = "ORBIT"

suma = 0
for putere in puncte_tari:
    suma += putere

puternice = []
for putere in puncte_tari:
    if putere > 50:
        puternice.append(putere)

inversat = ""
for caracter in cod:
    inversat = caracter + inversat

print(f"Suma: {suma}")
print(f"Puternice: {puternice}")
print(f"Inversat: {inversat}")
```
