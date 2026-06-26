```py
def analizeaza(citire):
    parti = citire.split(" ")
    a = int(parti[0])
    b = int(parti[1])
    c = int(parti[2])
    return a + b + c, max(a, b, c), min(a, b, c)

citire = input()
total, cel_mai_mare, cel_mai_mic = analizeaza(citire)
print(f"Total: {total}")
print(f"Cel mai mare: {cel_mai_mare}")
print(f"Cel mai mic: {cel_mai_mic}")
```
