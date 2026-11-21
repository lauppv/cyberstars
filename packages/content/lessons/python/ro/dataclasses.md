Multe clase sunt mai ales date: câteva atribute, un `__init__` care le copiază, un `__eq__` care le compară. E plictisitor să le scrii mereu. Modulul `dataclasses` le scrie pentru noi, dintr-o listă scurtă de câmpuri

---

`@dataclass` stă pe linia de deasupra clasei. E un **decorator**: ceva care schimbă clasa imediat după ce e făcută. Înăuntru, enumerăm câmpurile cu tipurile lor

```py
from dataclasses import dataclass

@dataclass
class Lada:
    eticheta: str
    greutate: int

mancare = Lada("mancare", 40)
print(mancare.eticheta, mancare.greutate)
print(mancare)
print(mancare == Lada("mancare", 40))
```

Rezultat

```text
mancare 40
Lada(eticheta='mancare', greutate=40)
True
```

N-am scris niciun `__init__`, niciun `__eq__` și niciun fel de a o afișa, și totuși merg toate trei. Dataclass-ul le-a făcut din câmpuri, în ordinea în care le-am scris

---

Tipurile de după două puncte, ca `str` și `int`, sunt notițe pentru oameni și unelte. Python nu le verifică: `Lada("mancare", "grea")` ar merge tot. Un câmp poate avea o valoare implicită, care trebuie să vină după câmpurile fără

```py
from dataclasses import dataclass

@dataclass
class Lada:
    eticheta: str
    greutate: int = 10
    fragila: bool = False

print(Lada("unelte"))
print(Lada("sticla", fragila=True))
```

Rezultat

```text
Lada(eticheta='unelte', greutate=10, fragila=False)
Lada(eticheta='sticla', greutate=10, fragila=True)
```

---

`@dataclass(order=True)` face și `<`, `>` și celelalte. Obiectele se compară câmp cu câmp, în ordinea câmpurilor, ca tuple-urile. Așa că primul câmp decide primul

```py
from dataclasses import dataclass

@dataclass(order=True)
class Lada:
    greutate: int
    eticheta: str

lazi = [Lada(40, "mancare"), Lada(5, "seminte"), Lada(40, "carti")]
for lada in sorted(lazi):
    print(lada)
```

Rezultat

```text
Lada(greutate=5, eticheta='seminte')
Lada(greutate=40, eticheta='carti')
Lada(greutate=40, eticheta='mancare')
```

De asta `greutate` vine prima aici: vrem să sortăm după greutate, apoi după etichetă

---

Un dataclass e tot o clasă obișnuită. Îi putem adăuga metodele noastre

```py
from dataclasses import dataclass

@dataclass
class Lada:
    eticheta: str
    greutate: int

    def grea(self):
        return self.greutate > 30

print(Lada("mancare", 40).grea())
```

Rezultat

```text
True
```

---

## Misiune: Lăzile cu marfă

O navă de marfă aduce lăzi pe stație. Fiecare ladă are o greutate și o etichetă, iar echipajul le încarcă de la cea mai ușoară la cea mai grea

1. Scrie un dataclass **Lada** cu `order=True` și două câmpuri: `greutate` (un număr întreg) și `eticheta` (un string), în ordinea asta
2. Începe programul cu două variabile: **greutati** și **etichete**, două liste în aceeași ordine. De exemplu `greutati = [40, 5, 40]` și `etichete = ["mancare", "seminte", "carti"]`
3. Fă câte o `Lada` pentru fiecare și afișează-le sortate, câte una pe linie, cum le afișează dataclass-ul
4. Afișează `Cea mai grea: ` și eticheta celei mai grele lăzi, cea sortată ultima
5. Afișează `La fel ca prima: ` și câte dintre lăzi sunt egale cu prima ladă din listă, cu tot cu ea

Listele au între 1 și 10 lăzi. Greutățile sunt de la 1 la 100, iar etichetele au litere mici

**Exemplu** pentru valorile de mai sus

```text
Lada(greutate=5, eticheta='seminte')
Lada(greutate=40, eticheta='carti')
Lada(greutate=40, eticheta='mancare')
Cea mai grea: mancare
La fel ca prima: 1
```
