Unele feluri de lucruri sunt cazuri speciale ale altora. Un panou solar e un modul al stației cu ceva în plus: face curent din lumina soarelui. În loc să scriem aceeași clasă de două ori, o clasă poate **moșteni** de la alta, poate lua tot ce are ea și poate adăuga ce are a ei

---

Pune clasa părinte între paranteze după numele clasei noi. Clasa nouă, copilul, primește toate metodele părintelui

```py
class Modul:
    def __init__(self, nume):
        self.nume = nume

    def raport(self):
        return f"{self.nume} e pornit"

class PanouSolar(Modul):
    pass

panou = PanouSolar("Panoul A")
print(panou.raport())
```

Rezultat

```text
Panoul A e pornit
```

`PanouSolar` nu are `__init__` sau `raport` ale lui, așa că Python le ia pe ale părintelui. De asta `PanouSolar("Panoul A")` are nevoie de un nume, ca un `Modul`

---

Copilul poate adăuga metode pe care părintele nu le are. Un modul simplu nu le are, un panou solar da

```py
class Modul:
    def __init__(self, nume):
        self.nume = nume

    def raport(self):
        return f"{self.nume} e pornit"

class PanouSolar(Modul):
    def energie(self, ore):
        return ore * 5

panou = PanouSolar("Panoul A")
doc = Modul("Doc")
print(panou.raport(), panou.energie(4))
print(doc.raport())
print(hasattr(doc, "energie"))
```

Rezultat

```text
Panoul A e pornit 20
Doc e pornit
False
```

`hasattr()` întreabă dacă un obiect are un atribut sau o metodă cu acel nume

---

`isinstance(obiect, Clasa)` ne spune ce fel de obiect avem. Un copil contează și ca părintele lui: fiecare panou solar e un modul, dar nu fiecare modul e un panou solar

```py
class Modul:
    pass

class PanouSolar(Modul):
    pass

panou = PanouSolar()
doc = Modul()
print(isinstance(panou, PanouSolar), isinstance(panou, Modul))
print(isinstance(doc, PanouSolar))
```

Rezultat

```text
True True
False
```

Așa că o listă de module le poate ține pe amândouă felurile, iar programul se poate purta cu fiecare după ce este

---

## Misiune: Verificarea curentului

Stația are multe module, iar unele dintre ele sunt panouri solare. Fiecare modul poate raporta, iar panourile solare pot spune și câtă energie fac

1. Scrie o clasă **Modul** cu un `__init__` care primește un `nume` și o `putere` (kilowații pe care îi folosește) și o metodă **raport()** care returnează `nume foloseste putere kW`
2. Scrie o clasă **PanouSolar** care moștenește din `Modul` și adaugă o metodă **energie(ore)** care returnează puterea înmulțită cu orele
3. Începe programul cu patru variabile: **nume**, o listă de string-uri, **puteri**, o listă de numere întregi, și **solar**, o listă de True sau False, toate în aceeași ordine, și **ore**, un număr întreg. De exemplu `nume = ["Doc", "Panoul A"]`, `puteri = [40, 5]`, `solar = [False, True]` și `ore = 6`
4. Fă un `PanouSolar` unde solar e True și un `Modul` unde e False. Pentru fiecare, afișează raportul lui. Pentru un panou solar, adaugă `, face `, energia lui pentru ore și ` kWh`
5. Afișează `Panouri: ` și câte dintre module sunt panouri solare, găsite cu `isinstance()`

Listele au între 1 și 10 module. Puterile sunt de la 1 la 100, iar orele de la 0 la 24

**Exemplu** pentru valorile de mai sus

```text
Doc foloseste 40 kW
Panoul A foloseste 5 kW, face 30 kWh
Panouri: 1
```
