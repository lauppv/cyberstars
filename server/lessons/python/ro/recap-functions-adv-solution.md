```py
citiri = ["10", "bad", "25", "7", "x"]

def int_sigur(text, valoare_implicita=0):
    try:
        return int(text)
    except ValueError:
        return valoare_implicita

def sumeaza(numere):
    return sum(numere), max(numere), min(numere)

numere = []
for citire in citiri:
    numere.append(int_sigur(citire))

print(f"Numere: {numere}")
total, cel_mai_mare, cel_mai_mic = sumeaza(numere)
print(f"Total: {total}")
print(f"Cel mai mare: {cel_mai_mare}")
print(f"Cel mai mic: {cel_mai_mic}")
```
