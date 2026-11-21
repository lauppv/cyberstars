```py
def verifica_cod(cod):
    if len(cod) < 4:
        raise ValueError("prea scurt")
    if not cod.isdigit():
        raise ValueError("doar cifre")
    if len(set(cod)) == 1:
        raise ValueError("toate la fel")
    in_sir = True
    for i in range(1, len(cod)):
        if int(cod[i]) != int(cod[i - 1]) + 1:
            in_sir = False
    if in_sir:
        raise ValueError("in sir")
    return cod


coduri = ["12", "4a21", "7777", "3456", "9071"]

for cod in coduri:
    try:
        verifica_cod(cod)
        print(f"{cod}: ok")
    except ValueError as e:
        print(f"{cod}: {e}")
```
