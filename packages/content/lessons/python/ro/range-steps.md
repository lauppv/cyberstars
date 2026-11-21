În lecția Bucle for am cunoscut al treilea număr al lui `range()`, pasul: `range(0, 11, 2)` dă 0, 2, 4, 6, 8, 10. Acum folosim pasul ca să mergem în alte feluri: înapoi și printr-o listă din două în două poziții

---

Un pas negativ numără în jos. Startul e numărul mare, iar oprirea e cel mic

```py
for secunda in range(5, 0, -1):
    print(secunda)
print("Decolare")
```

Rezultat

```text
5
4
3
2
1
Decolare
```

Oprirea e tot lăsată pe dinafară, ca înainte. `range(5, 0, -1)` se oprește înainte de 0, așa că ultimul număr e 1. Ca să ajungem și la 0, oprirea trebuie să fie -1

---

Pașii mai mari merg la fel în ambele direcții

```py
print(list(range(10, 0, -3)))
print(list(range(1, 10, 4)))
```

Rezultat

```text
[10, 7, 4, 1]
[1, 5, 9]
```

`list()` transformă numerele din `range()` într-o listă, ca să le vedem pe toate deodată. Fiecare număr e cel dinainte plus pasul, cât timp nu ajungem la oprire

---

Cu `range()` mergem prin **pozițiile** unei liste, iar pasul ne lasă să alegem care. Aici luăm fiecare a doua poziție

```py
planete = ["Mercur", "Venus", "Pamant", "Marte", "Jupiter"]
for i in range(0, len(planete), 2):
    print(i, planete[i])
```

Rezultat

```text
0 Mercur
2 Pamant
4 Jupiter
```

---

Ca să mergem printr-o listă de la final, pornim de la ultima poziție, `len(planete) - 1`, și folosim un pas negativ. Oprirea e -1, ca poziția 0 să fie ultima pe care o vizităm

```py
planete = ["Mercur", "Venus", "Pamant"]
for i in range(len(planete) - 1, -1, -1):
    print(i, planete[i])
```

Rezultat

```text
2 Pamant
1 Venus
0 Mercur
```

Și un slice ca `planete[::-1]` ne dă lista invers, dar nu ne spune pozițiile. Cu `range()` avem și poziția, și valoarea

---

## Misiune: Tura de noapte

Ziua, senzorii își scriu citirile într-o listă, cea mai nouă la final. Noaptea, inginerul le verifică de la cea mai nouă la cea mai veche și doar una din două, începând cu cea mai nouă

1. Începe programul cu o variabilă **citiri**, o listă de numere întregi. De exemplu `citiri = [12, 15, 11, 18, 20]`
2. Pentru fiecare citire pe care o verifică inginerul, afișează poziția ei în listă, `: ` și citirea
3. Afișează `Verificate: ` și câte citiri au fost verificate

Folosește `range()` cu un pas pentru poziții, nu un slice. **citiri** are între 1 și 30 de numere

**Exemplu** pentru citiri = [12, 15, 11, 18, 20]

```text
4: 20
2: 11
0: 12
Verificate: 3
```

**Exemplu** pentru citiri = [7, 3, 9, 4]

```text
3: 4
1: 3
Verificate: 2
```
