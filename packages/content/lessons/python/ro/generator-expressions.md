Un list comprehension cu paranteze rotunde în loc de pătrate face o **generator expression**: un mic generator într-o singură linie. Își dă valorile câte una, ca generatoarele din lecția trecută, fără să construiască întâi o listă

---

Singura diferență la vedere sunt parantezele

```py
numere = [1, 2, 3, 4]
ca_lista = [n * n for n in numere]
ca_generator = (n * n for n in numere)
print(ca_lista)
print(list(ca_generator))
```

Rezultat

```text
[1, 4, 9, 16]
[1, 4, 9, 16]
```

Dacă am afișa generatorul însuși, am vedea ceva ca `<generator object ...>`, nu valorile. Ca orice generator, are valori doar când i le cere cineva, și o singură dată

---

Generator expressions strălucesc în funcțiile care trec prin valori una câte una: `sum()`, `max()`, `min()`, `any()` și `all()`. Când generator expression e singurul lucru din apel, putem chiar să-i scoatem parantezele proprii

```py
preturi = [4, 10, 25]
bucati = [3, 0, 2]
print(sum(p * b for p, b in zip(preturi, bucati)))
print(max(len(c) for c in ["soare", "cometa", "luna"]))
```

Rezultat

```text
62
6
```

`sum()` primește fiecare produs pe măsură ce e făcut și îl adună. Nu se construiește niciodată o listă de produse

---

`any()` dă True când cel puțin o valoare e adevărată, iar `all()` când toate sunt. Cu o generator expression, se și opresc imediat ce răspunsul e clar

```py
temperaturi = [21, 35, 19]
print(any(t > 30 for t in temperaturi))
print(all(t > 20 for t in temperaturi))
```

Rezultat

```text
True
False
```

`any()` se oprește la 35: o citire caldă e destul ca să răspundă True. Nu se mai uită niciodată la 19

---

De ce contează că nu se construiește nicio listă? Pentru câteva valori nu contează. Pentru milioane contează: o listă ține toate valorile în memorie deodată, pe când un generator o ține doar pe cea la care lucrează

```py
print(sum(n for n in range(1, 1000001)))
```

Rezultat

```text
500000500000
```

Aici se adună un milion de numere, dar doar unul dintre ele există în fiecare moment

---

## Misiune: Verificarea comenzii

Magazinul stației primește o comandă: o listă de prețuri și o listă cu câte bucăți vrea clientul din fiecare produs. Magazinul verifică comanda înainte să fie împachetată

1. Începe programul cu două variabile: **preturi** și **bucati**, două liste de numere întregi de aceeași lungime. De exemplu `preturi = [4, 10, 25]` și `bucati = [3, 0, 2]`
2. Afișează `Total: ` și prețul total al comenzii: fiecare preț înmulțit cu numărul lui de bucăți, toate adunate
3. Afișează `Cea mai mare linie: ` și cel mai mare preț înmulțit cu bucățile pentru un singur produs
4. Afișează `Linii goale: ` și True dacă cel puțin un produs are 0 bucăți, sau False dacă niciunul
5. Afișează `Toate ieftine: ` și True dacă fiecare produs comandat, cu mai mult de 0 bucăți, costă mai puțin de 20, sau False dacă nu. O comandă în care nu e comandat nimic contează ca True

Folosește generator expressions, nu liste. Listele au între 1 și 20 de produse, prețuri de la 1 la 500 și bucăți de la 0 la 10

**Exemplu** pentru preturi = [4, 10, 25] și bucati = [3, 0, 2]

```text
Total: 62
Cea mai mare linie: 50
Linii goale: True
Toate ieftine: False
```
