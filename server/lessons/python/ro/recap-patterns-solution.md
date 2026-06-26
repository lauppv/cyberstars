```py
log = "scan probe scan analyze probe scan boot"

def contor_cuvant(log, cuvant):
    contor = 0
    for c in log.split(" "):
        if c == cuvant:
            contor += 1
    return contor

def cel_mai_lung_cuvant(log):
    cel_mai_lung = ""
    for c in log.split(" "):
        if len(c) > len(cel_mai_lung):
            cel_mai_lung = c
    return cel_mai_lung

def are_duplicate(log):
    vazute = set()
    for c in log.split(" "):
        if c in vazute:
            return True
        vazute.add(c)
    return False

cuvinte = log.split(" ")
print(f"Total cuvinte: {len(cuvinte)}")
print(f"Aparitii scan: {contor_cuvant(log, 'scan')}")
print(f"Cel mai lung cuvant: {cel_mai_lung_cuvant(log)}")
print(f"Are duplicat: {are_duplicate(log)}")
print(f"Cuvinte unice: {sorted(set(cuvinte))}")
```
