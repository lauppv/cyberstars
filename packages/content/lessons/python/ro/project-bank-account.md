În acest proiect construim banca stației: conturi care primesc bani și dau bani și refuză ce nu pot face, cu un motiv clar. Pune împreună clasele, metodele, `__str__`, excepțiile tale și `try` cu `else`

---

Întâi erorile. Orice problemă a băncii e o `EroareBanca`. Două feluri au clasa lor: o sumă care nu e pozitivă și bani prea puțini. A doua ține minte cât lipsește

```py
class EroareBanca(Exception):
    pass

class SumaInvalida(EroareBanca):
    pass

class BaniInsuficienti(EroareBanca):
    def __init__(self, lipsa):
        super().__init__(f"lipsesc {lipsa}")
        self.lipsa = lipsa

print(BaniInsuficienti(30))
print(BaniInsuficienti(30).lipsa)
```

Rezultat

```text
lipsesc 30
30
```

---

Apoi contul. Pornește gol, iar orice schimbare trece printr-o metodă, așa că regulile stau într-un singur loc. O metodă verifică întâi și schimbă soldul doar când totul e în regulă

```py
class EroareBanca(Exception):
    pass

class SumaInvalida(EroareBanca):
    pass

class BaniInsuficienti(EroareBanca):
    def __init__(self, lipsa):
        super().__init__(f"lipsesc {lipsa}")
        self.lipsa = lipsa

class Cont:
    def __init__(self, titular):
        self.titular = titular
        self.sold = 0

    def depune(self, suma):
        if suma <= 0:
            raise SumaInvalida("suma trebuie sa fie pozitiva")
        self.sold += suma

    def retrage(self, suma):
        if suma <= 0:
            raise SumaInvalida("suma trebuie sa fie pozitiva")
        if suma > self.sold:
            raise BaniInsuficienti(suma - self.sold)
        self.sold -= suma

    def __str__(self):
        return f"{self.titular}: {self.sold}"

ada = Cont("Ada")
ada.depune(100)
ada.retrage(30)
print(ada)
```

Rezultat

```text
Ada: 70
```

Metodele nu afișează nimic. Schimbă contul sau aruncă o eroare. Ce i se arată utilizatorului e treaba codului care le apelează

---

Acum acel cod. Încearcă fiecare operație și reacționează la ce s-a întâmplat: câte un `except` pentru fiecare fel de problemă, `else` când a mers

```py
class EroareBanca(Exception):
    pass

class BaniInsuficienti(EroareBanca):
    def __init__(self, lipsa):
        super().__init__(f"lipsesc {lipsa}")
        self.lipsa = lipsa

class Cont:
    def __init__(self, titular):
        self.titular = titular
        self.sold = 0

    def retrage(self, suma):
        if suma > self.sold:
            raise BaniInsuficienti(suma - self.sold)
        self.sold -= suma

ada = Cont("Ada")
for suma in [20, 0]:
    try:
        ada.retrage(suma)
    except BaniInsuficienti as e:
        print(f"retrage {suma}: {e}")
    else:
        print(f"retrage {suma}: ok")
```

Rezultat

```text
retrage 20: lipsesc 20
retrage 0: ok
```

---

La final, comenzile vin de la tastatură, câte una pe linie, până la cuvântul `end`. O buclă `while True` le citește, iar `break` o oprește

```py
while True:
    linie = input()
    if linie == "end":
        break
    cuvant, numar = linie.split()
    print(cuvant, int(numar) * 2)
```

Scrie `depune 50`, apoi `end`, ca să-l încerci

---

## Misiune: Banca stației

Scrie banca și lasă un membru al echipajului să-și folosească contul de la tastatură

1. Scrie clasele **EroareBanca**, **SumaInvalida** și **BaniInsuficienti** ca mai sus și clasa **Cont** cu `depune()`, `retrage()` și `__str__`
2. Citește numele titularului, apoi comenzi până la o linie care spune `end`. O comandă e `depune` sau `retrage`, un spațiu și un număr întreg
3. Pentru fiecare comandă, afișează comanda, `: ` și `ok` când a mers, sau mesajul erorii când a aruncat o `EroareBanca`
4. La final, afișează contul cum îl arată `__str__`, apoi `Reusite: ` și câte comenzi au mers, un `/` și câte comenzi au fost

Sumele sunt de la -100 la 10000 și sunt între 0 și 20 de comenzi

**Intrare**

```text
Ada
depune 100
retrage 130
depune 0
retrage 40
end
```

**Rezultat**

```text
depune 100: ok
retrage 130: lipsesc 30
depune 0: suma trebuie sa fie pozitiva
retrage 40: ok
Ada: 60
Reusite: 2/4
```
