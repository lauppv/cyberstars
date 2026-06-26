```py
def adauga_sarcina(sarcini, nume):
    sarcini.append({"nume": nume, "done": False})

def finalizeaza_sarcina(sarcini, index):
    if 0 <= index < len(sarcini):
        sarcini[index]["done"] = True

def numara_finalizate(sarcini):
    terminate = 0
    for sarcina in sarcini:
        if sarcina["done"]:
            terminate += 1
    return terminate

sarcini = []
n = int(input())
for i in range(n):
    nume = input()
    adauga_sarcina(sarcini, nume)

for index in input().split():
    finalizeaza_sarcina(sarcini, int(index))

for i, sarcina in enumerate(sarcini):
    stare = "terminat" if sarcina["done"] else "in asteptare"
    print(f"{i}. [{stare}] {sarcina['nume']}")
print(f"Finalizat: {numara_finalizate(sarcini)}/{len(sarcini)}")
```
