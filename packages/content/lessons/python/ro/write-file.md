Tot ce știu programele noastre dispare când se termină. Ca să păstrăm ceva pentru mai târziu, un jurnal, o listă de punctaje, setări, îl scriem într-un **fișier**

---

`open()` deschide un fișier și ne dă un obiect cu care lucrăm. A doua valoare spune ce vrem să facem: `"w"` înseamnă scriere. Apoi `.write()` pune text în fișier, iar `.close()` îl salvează și îi dă drumul

```py
jurnal = open("jurnal.txt", "w")
jurnal.write("Motor pornit\n")
jurnal.write("Toate sistemele merg\n")
jurnal.close()

print(open("jurnal.txt").read())
```

Rezultat

```text
Motor pornit
Toate sistemele merg

```

Ultima linie doar aruncă o privire în fișier, ca să arate ce e în el. Vedem cum merge citirea în lecția următoare

`.write()` nu adaugă singur o linie nouă, spre deosebire de `print()`. De asta fiecare linie se termină cu `"\n"`, caracterul care înseamnă „aici începe o linie nouă”

---

`"w"` face un fișier nou, gol, sau îl **șterge** pe cel vechi dacă există deja un fișier cu acel nume. Rulează celula: rămâne doar al doilea text

```py
f = open("nota.txt", "w")
f.write("primul\n")
f.close()

f = open("nota.txt", "w")
f.write("al doilea\n")
f.close()

print(open("nota.txt").read())
```

Rezultat

```text
al doilea

```

---

Ca să adăugăm la finalul unui fișier și să păstrăm ce e în el, îl deschidem cu `"a"`, de la append (adaugă)

```py
f = open("nota.txt", "w")
f.write("primul\n")
f.close()

f = open("nota.txt", "a")
f.write("al doilea\n")
f.close()

print(open("nota.txt").read())
```

Rezultat

```text
primul
al doilea

```

---

`.write()` primește doar string-uri. Un număr trebuie să devină întâi string, cu `str()` sau într-un f-string

```py
punctaje = [12, 7, 30]
f = open("punctaje.txt", "w")
for p in punctaje:
    f.write(f"{p}\n")
f.close()

print(open("punctaje.txt").read())
```

Rezultat

```text
12
7
30

```

Închide mereu fișierul. Până atunci, o parte din ce am scris poate să aștepte încă în memorie, nesalvată

---

## Misiune: Jurnalul turei

La finalul fiecărei ture, echipajul scrie ce s-a întâmplat într-un fișier jurnal, ca tura următoare să-l poată citi

1. Începe programul cu două variabile: **titlu**, un string, și **intrari**, o listă de string-uri. De exemplu `titlu = "tura de noapte"` și `intrari = ["am verificat aerul", "am reparat usa"]`
2. Scrie un fișier numit `jurnal.txt`: prima linie e titlul cu majuscule, apoi câte o linie pentru fiecare intrare, numerotată de la 1, ca `1. am verificat aerul`
3. Deschide fișierul din nou ca să mai adaugi o linie la final: `END`. Fiecare linie din fișier se termină cu o linie nouă, și ultima
4. Citește tot fișierul și afișează-l, apoi afișează `Caractere: ` și câte caractere are fișierul, cu tot cu liniile noi

**intrari** are între 0 și 10 intrări

**Exemplu** pentru valorile de mai sus

```text
TURA DE NOAPTE
1. am verificat aerul
2. am reparat usa
END

Caractere: 59
```

Linia goală vine din afișarea textului fișierului, care se termină deja cu o linie nouă, iar `print()` mai adaugă una
