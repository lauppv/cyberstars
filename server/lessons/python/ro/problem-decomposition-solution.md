```py
jurnal = "alpha beta alpha gamma beta alpha"

def desparte_coduri(jurnal):
    return jurnal.split(" ")

def numara_coduri(coduri):
    contor = {}
    for cod in coduri:
        if cod in contor:
            contor[cod] = contor[cod] + 1
        else:
            contor[cod] = 1
    return contor

def cel_mai_frecvent(contor):
    cel_mai_bun = ""
    cel_mai_mare = 0
    for cod, numar in contor.items():
        if numar > cel_mai_mare:
            cel_mai_mare = numar
            cel_mai_bun = cod
    return cel_mai_bun

coduri = desparte_coduri(jurnal)
contor = numara_coduri(coduri)
print(f"Coduri: {len(coduri)}")
for cod, numar in contor.items():
    print(f"{cod}: {numar}")
print(f"Cel mai frecvent: {cel_mai_frecvent(contor)}")
```
