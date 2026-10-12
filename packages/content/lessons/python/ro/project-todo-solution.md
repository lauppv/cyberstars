```py
def adauga_sarcina(sarcini, nume):
    sarcini.append({"nume": nume, "terminat": False})

def finalizeaza_sarcina(sarcini, index):
    if 0 <= index < len(sarcini):
        sarcini[index]["terminat"] = True

def numara_finalizate(sarcini):
    terminate = 0
    for sarcina in sarcini:
        if sarcina["terminat"]:
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
    stare = "terminat" if sarcina["terminat"] else "in asteptare"
    print(f"{i}. [{stare}] {sarcina['nume']}")
print(f"Finalizat: {numara_finalizate(sarcini)}/{len(sarcini)}")
```
