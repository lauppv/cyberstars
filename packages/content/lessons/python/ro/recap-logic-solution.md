```py
lansare_ok = True

while True:
    nivel = int(input())
    if nivel == 0:
        break
    if nivel < 0:
        continue
    if nivel < 50:
        print("Sistem critic")
        lansare_ok = False
    else:
        print("Sistem OK")

if lansare_ok:
    print("Lansare autorizata")
else:
    print("Lansare anulata")
```
