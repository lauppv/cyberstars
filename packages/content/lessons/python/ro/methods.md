Un obiect ține date și poate și să facă lucruri. O funcție scrisă într-o clasă e o **metodă**. Folosim metode de mult, ca `nume.upper()` sau `echipaj.append()`. Acum le scriem pe ale noastre

---

O metodă arată ca `__init__`: stă în clasă, iar primul ei parametru e `self`, obiectul pe care a fost apelată. Prin `self` citește și schimbă atributele acelui obiect

```py
class Numarator:
    def __init__(self):
        self.numar = 0

    def adauga(self):
        self.numar += 1

clickuri = Numarator()
clickuri.adauga()
clickuri.adauga()
print(clickuri.numar)
```

Rezultat

```text
2
```

`clickuri.adauga()` rulează `adauga` cu `clickuri` drept `self`. Ca la `__init__`, nu dăm niciodată noi `self`

---

Metodele pot primi mai multe valori și pot da înapoi un rezultat, ca orice funcție

```py
class Portofel:
    def __init__(self, bani):
        self.bani = bani

    def plateste(self, pret):
        if pret > self.bani:
            return False
        self.bani -= pret
        return True

portofel = Portofel(10)
print(portofel.plateste(4), portofel.bani)
print(portofel.plateste(20), portofel.bani)
```

Rezultat

```text
True 6
False 6
```

Metoda ține regula într-un singur loc: nimeni nu poate cheltui mai mult decât are portofelul, cât timp plătește prin `plateste()`

---

Fiecare obiect are datele lui, așa că aceeași metodă lucrează separat pe fiecare. Iar o metodă poate apela alta prin `self`

```py
class Portofel:
    def __init__(self, bani):
        self.bani = bani

    def plateste(self, pret):
        if pret > self.bani:
            return False
        self.bani -= pret
        return True

    def plateste_de_doua_ori(self, pret):
        return self.plateste(pret) and self.plateste(pret)

ada = Portofel(10)
alan = Portofel(3)
print(ada.plateste_de_doua_ori(4), ada.bani)
print(alan.plateste_de_doua_ori(2), alan.bani)
```

Rezultat

```text
True 2
False 1
```

Prima plată a lui Alan merge, a doua nu: `and` se oprește la primul False

---

## Misiune: Rezervorul

Rezervorul unei nave ține combustibil până la capacitatea lui. Piloții îl umplu și îl folosesc, iar rezervorul nu trebuie să treacă niciodată peste capacitate sau sub gol

1. Scrie o clasă **Rezervor** cu un `__init__` care primește o `capacitate` și pornește cu `combustibil` la 0, și trei metode:
   - **umple(cantitate)** adaugă cât încape din cantitate și returnează cât a adăugat de fapt
   - **foloseste(cantitate)** scoate cantitatea dacă e destul combustibil și returnează True, sau nu schimbă nimic și returnează False
   - **procent()** returnează cât de plin e rezervorul, în procente, ca număr întreg rotunjit în jos. Înmulțește cu 100 înainte să împarți: `29 / 100 * 100` dă `28.999999999999996`, nu 29
2. Începe programul cu două variabile: **capacitate**, un număr întreg, și **actiuni**, o listă de string-uri ca `"umple 50"` sau `"foloseste 20"`. De exemplu `capacitate = 80` și `actiuni = ["umple 50", "foloseste 20", "umple 70", "foloseste 100"]`
3. Pentru fiecare acțiune, apelează metoda și afișează acțiunea, `: ` și ce a returnat metoda
4. Afișează `Plin: `, procentul și `%`

**capacitate** e de la 1 la 1000, iar fiecare cantitate de la 0 la 1000

**Exemplu** pentru valorile de mai sus

```text
umple 50: 50
foloseste 20: True
umple 70: 50
foloseste 100: False
Plin: 100%
```
