```py
sir = input()
deplasare = int(input())

rezultat = []
for litera in sir:
    if litera.isalpha():
        baza = ord('A') if litera.isupper() else ord('a')
        rezultat.append(chr((ord(litera) - baza + deplasare) % 26 + baza))
    else:
        rezultat.append(litera)

print(''.join(rezultat))
```
