De multe ori clasa copil are nevoie de propriul `__init__`, pentru că are mai multe date decât părintele. Dar `__init__`-ul părintelui știe deja să pregătească partea comună. `super()` îl lasă pe copil să-l apeleze, în loc să-i copieze liniile

---

Dacă copilul își scrie propriul `__init__`, cel al părintelui nu mai e apelat singur. Atunci atributele comune ar lipsi

```py
class Persoana:
    def __init__(self, nume):
        self.nume = nume

class Pilot(Persoana):
    def __init__(self, nume, ore):
        self.ore = ore

ada = Pilot("Ada", 300)
print(hasattr(ada, "nume"), ada.ore)
```

Rezultat

```text
False 300
```

Pilotul are ore, dar nu are nume. `__init__`-ul copilului l-a înlocuit pe al părintelui și nimeni n-a setat `self.nume`

---

`super()` dă varianta părintelui a unei metode. `super().__init__(nume)` rulează pregătirea părintelui pe același obiect, apoi copilul își adaugă partea lui

```py
class Persoana:
    def __init__(self, nume):
        self.nume = nume

class Pilot(Persoana):
    def __init__(self, nume, ore):
        super().__init__(nume)
        self.ore = ore

ada = Pilot("Ada", 300)
print(ada.nume, ada.ore)
```

Rezultat

```text
Ada 300
```

Apelează întâi `super().__init__()`, ca atributele comune să existe înainte să le folosească codul copilului. Nu dăm `self`: `super()` știe deja obiectul

---

Dacă pregătirea părintelui se schimbă mai târziu, fiecare copil primește schimbarea gratis. Aici părintele începe să curețe numele, iar pilotul nu are nevoie de nicio linie nouă

```py
class Persoana:
    def __init__(self, nume):
        self.nume = nume.strip().title()

class Pilot(Persoana):
    def __init__(self, nume, ore):
        super().__init__(nume)
        self.ore = ore

print(Pilot("  ada LOVELACE ", 10).nume)
```

Rezultat

```text
Ada Lovelace
```

`.title()` face prima literă a fiecărui cuvânt mare și restul mici

---

`super()` merge pentru orice metodă, nu doar pentru `__init__`. Lecția următoare îl folosește ca să construiască peste metoda unui părinte, în loc să o înlocuiască

---

## Misiune: Fișele piloților

Fiecare om de pe stație are un nume și o vârstă. Piloții au și orele lor de zbor, iar cei cu cel puțin 500 de ore pot face călătorii lungi

1. Scrie o clasă **Persoana** cu un `__init__` care primește un `nume` și o `varsta` și o metodă **info()** care returnează `nume, varsta`
2. Scrie o clasă **Pilot** care moștenește din `Persoana`. `__init__`-ul ei primește un `nume`, o `varsta` și `ore`, folosește `super()` ca să seteze numele și vârsta și setează singur `ore`. Adaugă o metodă **drumuri_lungi()** care returnează True dacă pilotul are cel puțin 500 de ore
3. Începe programul cu trei variabile: **nume**, **varste** și **ore**, trei liste în aceeași ordine. De exemplu `nume = ["Ada", "Ben"]`, `varste = [36, 29]` și `ore = [800, 120]`
4. Fă câte un `Pilot` pentru fiecare și afișează câte o linie pentru fiecare: informația, `| ore:` cu câte un spațiu de fiecare parte, orele, `| drumuri lungi:` cu câte un spațiu de fiecare parte, și `da` sau `nu`
5. Afișează `Cele mai multe ore: ` și informația pilotului cu cele mai multe ore, primul dacă mai mulți au tot atâtea

Listele au între 1 și 10 piloți, vârste de la 20 la 70 și ore de la 0 la 5000

**Exemplu** pentru valorile de mai sus

```text
Ada, 36 | ore: 800 | drumuri lungi: da
Ben, 29 | ore: 120 | drumuri lungi: nu
Cele mai multe ore: Ada, 36
```
