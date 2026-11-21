Până acum i-am dat unei funcții valorile în ordine: prima valoare merge la primul parametru, a doua la al doilea. Python ne lasă să numim și parametrul căruia îi dăm o valoare. Asta e un **argument cu nume**

---

Iată o funcție cu trei parametri

```py
def descrie(planeta, luni, inele):
    print(f"{planeta}: {luni} luni, inele: {inele}")

descrie("Saturn", 146, True)
descrie(planeta="Saturn", luni=146, inele=True)
descrie(inele=True, planeta="Saturn", luni=146)
```

Rezultat

```text
Saturn: 146 luni, inele: True
Saturn: 146 luni, inele: True
Saturn: 146 luni, inele: True
```

Toate trei apelurile fac același lucru. Cu nume, ordinea nu mai contează: Python pune fiecare valoare în parametrul cu acel nume

---

De ce să le numim? Uită-te la apelul ăsta: `descrie("Saturn", 146, True)`. Ce e 146? Ce e True? Trebuie să ne întoarcem la funcție ca să aflăm. `descrie(planeta="Saturn", luni=146, inele=True)` ne spune chiar acolo. Numele fac un apel mai ușor de citit, mai ales când o funcție are mulți parametri sau primește `True` și `False`

---

Putem amesteca cele două feluri. Întâi vin valorile în ordine, apoi cele cu nume

```py
def descrie(planeta, luni, inele):
    print(f"{planeta}: {luni} luni, inele: {inele}")

descrie("Marte", inele=False, luni=2)
```

Rezultat

```text
Marte: 2 luni, inele: False
```

Invers nu se poate. `descrie(planeta="Marte", 2, False)` se oprește cu un SyntaxError, pentru că după un nume Python nu mai știe unde să pună o valoare fără nume

---

Argumentele cu nume merg cel mai bine cu valorile implicite, pe care le-am cunoscut în lecția Parametri impliciți. Putem sări peste orice parametru care are o valoare implicită și să-i numim doar pe cei pe care vrem să-i schimbăm

```py
def comanda(produs, bucati=1, rapid=False):
    viteza = "rapid" if rapid else "normal"
    print(f"{bucati} x {produs}, {viteza}")

comanda("baterie")
comanda("baterie", rapid=True)
comanda("cablu", bucati=3)
```

Rezultat

```text
1 x baterie, normal
1 x baterie, rapid
3 x cablu, normal
```

În al doilea apel sărim peste `bucati` și tot schimbăm `rapid`. Fără nume nu se poate: a doua valoare în ordine ar merge la `bucati`

---

## Misiune: Ghișeul de rezervări

Naveta stației are un ghișeu de rezervări. O rezervare are un pasager, o destinație, un număr de locuri și un loc la geam sau nu

1. Scrie o funcție **rezerva(nume, destinatie, locuri=1, geam=False)** care returnează o linie ca `Ada -> Marte, locuri 2, geam`. Lasă deoparte `, geam` când `geam` e False
2. Începe programul cu patru variabile: **nume** și **destinatie**, două string-uri, **locuri**, un număr întreg, și **geam**, True sau False. De exemplu `nume = "Ada"`, `destinatie = "Marte"`, `locuri = 2` și `geam = True`
3. Afișează rezervarea pentru aceste patru valori. Apelează `rezerva()` cu argumente cu nume, în ce ordine vrei
4. Afișează o a doua rezervare pentru aceeași persoană spre `Luna`, cu locurile și geamul implicite. Dă doar valorile care se schimbă

`locuri` e de la 1 la 9

**Exemplu** pentru valorile de mai sus

```text
Ada -> Marte, locuri 2, geam
Ada -> Luna, locuri 1
```
