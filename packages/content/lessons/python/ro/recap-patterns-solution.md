```py
jurnal = "citire sonda citire analiza sonda citire start"

def contor_cuvant(jurnal, cuvant):
    contor = 0
    for c in jurnal.split(" "):
        if c == cuvant:
            contor += 1
    return contor

def cel_mai_lung_cuvant(jurnal):
    cel_mai_lung = ""
    for c in jurnal.split(" "):
        if len(c) > len(cel_mai_lung):
            cel_mai_lung = c
    return cel_mai_lung

def are_duplicate(jurnal):
    vazute = set()
    for c in jurnal.split(" "):
        if c in vazute:
            return True
        vazute.add(c)
    return False

cuvinte = jurnal.split(" ")
print(f"Total cuvinte: {len(cuvinte)}")
print(f"Aparitii citire: {contor_cuvant(jurnal, 'citire')}")
print(f"Cel mai lung cuvant: {cel_mai_lung_cuvant(jurnal)}")
print(f"Are duplicat: {are_duplicate(jurnal)}")
print(f"Cuvinte unice: {sorted(set(cuvinte))}")
```
