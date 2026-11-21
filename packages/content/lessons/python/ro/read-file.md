Scrierea unui fișier e doar jumătate din poveste. Acum citim unul înapoi: tot textul deodată sau câte o linie, și ne ocupăm de un fișier care nu există

---

`open()` cu `"r"`, de la citire, sau fără a doua valoare, deschide un fișier pentru citire. `.read()` ne dă tot ce e în el ca un singur string

```py
f = open("planete.txt", "w")
f.write("Mercur\nVenus\nPamant\n")
f.close()

f = open("planete.txt")
text = f.read()
f.close()
print(text.upper())
print(len(text))
```

Rezultat

```text
MERCUR
VENUS
PAMANT

20
```

Fiecare celulă din lecție pornește într-un folder gol, așa că celulele noastre scriu întâi fișierul pe care îl citesc

---

Odată ce avem textul, merg pe el toate uneltele pentru string-uri. `.splitlines()` îl taie într-o listă de linii și lasă deoparte `\n` de la finalul lor

```py
f = open("planete.txt", "w")
f.write("Mercur\nVenus\nPamant\n")
f.close()

f = open("planete.txt")
nume = f.read().splitlines()
f.close()
print(nume)
print(len(nume), "planete")
```

Rezultat

```text
['Mercur', 'Venus', 'Pamant']
3 planete
```

Și `.split("\n")` l-ar tăia, dar ar da un string gol în plus la final, după ultimul `\n`. `.splitlines()` nu

---

`.readline()` citește doar linia următoare, cu `\n` al ei. Fiecare apel continuă de unde s-a oprit cel dinainte. La finalul fișierului dă un string gol

```py
f = open("planete.txt", "w")
f.write("Mercur\nVenus\n")
f.close()

f = open("planete.txt")
print(repr(f.readline()))
print(repr(f.readline()))
print(repr(f.readline()))
f.close()
```

Rezultat

```text
'Mercur\n'
'Venus\n'
''
```

`repr()` arată un string așa cum l-am scrie în cod, ca să vedem `\n`. `.strip()` îl scoate, împreună cu spațiile din jurul textului

---

Dacă deschidem un fișier care nu există, programul se oprește cu un FileNotFoundError. Îl prindem cu `try` și `except`, ca în lecția Try / Except

```py
try:
    f = open("lipsa.txt")
    print(f.read())
    f.close()
except FileNotFoundError:
    print("Nu exista fisierul, pornim de la zero")
```

Rezultat

```text
Nu exista fisierul, pornim de la zero
```

---

## Misiune: Verificarea stocului

Magazinul stației își ține stocul într-un fișier, câte un produs pe fiecare linie, scris ca numele produsului, o virgulă și câte bucăți sunt. Fișierul vechi de stoc de anul trecut poate să mai fie pe acolo, sau nu

1. Începe programul cu o variabilă **stoc**, o listă de string-uri ca `"orez,12"`. De exemplu `stoc = ["orez,12", "sare,3", "ceai,40"]`
2. Scrie string-urile într-un fișier numit `stoc.txt`, câte unul pe fiecare linie
3. Citește fișierul înapoi cu `.read()` și folosește ce ai citit ca să afișezi `Produse: ` și câte linii are, `Total: ` și bucățile tuturor produselor adunate, și `Cele mai multe: ` și produsul cu cele mai multe bucăți. Dacă două produse au același număr maxim, ia-l pe primul
4. Încearcă să citești un fișier numit `vechi.txt`. Dacă nu există, afișează `vechi.txt: lipseste`. Dacă există, afișează `vechi.txt: ` și câte linii are

**stoc** are între 1 și 15 produse, fiecare cu un număr de bucăți de la 0 la 999. Numele produselor au doar litere mici

**Exemplu** pentru stocul de mai sus

```text
Produse: 3
Total: 55
Cele mai multe: ceai
vechi.txt: lipseste
```
