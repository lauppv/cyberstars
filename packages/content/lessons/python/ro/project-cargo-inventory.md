În acest proiect construim inventarul cargoului: o clasă care știe ce e în cală, refuză să dea ce nu există și se salvează într-un fișier JSON, ca nimic să nu se piardă când se termină programul. Pune împreună clasele, excepțiile tale, sortarea, fișierele și JSON

---

Inventarul ține un dicționar: pentru fiecare produs, câte bucăți sunt și cât cântărește una. Dacă adaugi un produs care e deja acolo, i se adună numărul de bucăți

```py
class Inventar:
    def __init__(self):
        self.produse = {}

    def adauga(self, nume, bucati, kg):
        if nume in self.produse:
            self.produse[nume]["bucati"] += bucati
        else:
            self.produse[nume] = {"bucati": bucati, "kg": kg}

cala = Inventar()
cala.adauga("orez", 10, 2)
cala.adauga("orez", 5, 2)
cala.adauga("unelte", 1, 30)
print(cala.produse)
```

Rezultat

```text
{'orez': {'bucati': 15, 'kg': 2}, 'unelte': {'bucati': 1, 'kg': 30}}
```

---

Scoaterea produselor poate da greș în două feluri: produsul nu există sau nu sunt destule bucăți. O singură clasă de eroare le acoperă pe amândouă, cu un mesaj care spune care e

```py
class EroareInventar(Exception):
    pass

class Inventar:
    def __init__(self):
        self.produse = {}

    def adauga(self, nume, bucati, kg):
        if nume in self.produse:
            self.produse[nume]["bucati"] += bucati
        else:
            self.produse[nume] = {"bucati": bucati, "kg": kg}

    def scoate(self, nume, bucati):
        if nume not in self.produse:
            raise EroareInventar("nu exista produsul")
        ramase = self.produse[nume]["bucati"]
        if bucati > ramase:
            raise EroareInventar(f"au ramas doar {ramase}")
        self.produse[nume]["bucati"] -= bucati

cala = Inventar()
cala.adauga("orez", 10, 2)
for nume, bucati in [("orez", 4), ("orez", 9), ("ceai", 1)]:
    try:
        cala.scoate(nume, bucati)
        print(nume, bucati, "ok")
    except EroareInventar as e:
        print(nume, bucati, e)
```

Rezultat

```text
orez 4 ok
orez 9 au ramas doar 6
ceai 1 nu exista produsul
```

---

Dicționarul e date simple, așa că `json` îl poate salva așa cum e și îl poate încărca înapoi mai târziu. O funcție construiește un inventar nou din fișier

```py
import json

class Inventar:
    def __init__(self):
        self.produse = {}

    def salveaza(self, cale):
        with open(cale, "w") as f:
            json.dump(self.produse, f)

def incarca_inventar(cale):
    cala = Inventar()
    with open(cale) as f:
        cala.produse = json.load(f)
    return cala

vechi = Inventar()
vechi.produse = {"orez": {"bucati": 6, "kg": 2}}
vechi.salveaza("cargo.json")
nou = incarca_inventar("cargo.json")
print(nou.produse["orez"]["bucati"])
```

Rezultat

```text
6
```

---

Raportul trece prin produse în ordinea numelor și calculează greutatea fiecărei linii și totalul

```py
produse = {"unelte": {"bucati": 1, "kg": 30}, "orez": {"bucati": 6, "kg": 2}}
total = 0
for nume in sorted(produse):
    bucati = produse[nume]["bucati"]
    kg = produse[nume]["kg"]
    total += bucati * kg
    print(f"{nume}: {bucati} x {kg} kg = {bucati * kg} kg")
print(f"Total: {total} kg")
```

Rezultat

```text
orez: 6 x 2 kg = 12 kg
unelte: 1 x 30 kg = 30 kg
Total: 42 kg
```

---

## Misiune: Cala cargoului

Scrie inventarul, rulează o zi din cala cargoului de la tastatură, apoi salvează-l, încarcă-l înapoi și fă raportul din ce s-a încărcat

1. Scrie o clasă **EroareInventar** care moștenește din `Exception` și o clasă **Inventar** cu metodele **adauga(nume, bucati, kg)**, **scoate(nume, bucati)** și **salveaza(cale)** ca mai sus, și o funcție **incarca_inventar(cale)** care returnează un `Inventar` nou citit din fișier
2. Citește comenzi până la o linie care spune `end`. O comandă e `adauga`, un nume, un număr de bucăți și kilogramele unei bucăți, ca `adauga orez 10 2`, sau `scoate`, un nume și un număr de bucăți, ca `scoate orez 4`. Un produs adăugat din nou își păstrează prima greutate
3. Pentru un `scoate` care dă greș, afișează comanda, `: ` și mesajul erorii. Nu afișa nimic pentru comenzile care merg
4. După `end`, salvează inventarul în `cargo.json`, încarcă-l înapoi cu `incarca_inventar()` și, din cel încărcat, afișează o linie de raport pentru fiecare produs cu mai mult de 0 bucăți, în ordinea numelor, apoi `Total: `, greutatea totală și ` kg`, apoi `Cel mai greu: ` și produsul a cărui linie cântărește cel mai mult, primul în ordinea numelor dacă mai multe cântăresc la fel, sau `niciunul` dacă cala e goală

Numele sunt dintr-un cuvânt cu litere mici. Bucățile sunt de la 1 la 100 și greutățile de la 1 la 50. Sunt între 0 și 20 de comenzi

**Intrare**

```text
adauga orez 10 2
adauga unelte 1 30
scoate orez 4
scoate orez 9
scoate ceai 1
adauga orez 5 9
end
```

**Rezultat**

```text
scoate orez 9: au ramas doar 6
scoate ceai 1: nu exista produsul
orez: 11 x 2 kg = 22 kg
unelte: 1 x 30 kg = 30 kg
Total: 52 kg
Cel mai greu: unelte
```
