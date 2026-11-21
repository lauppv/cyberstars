Afișăm deja numere cu f-string-uri: `f"Combustibil: {combustibil}"`. Dar un număr ca `2.3456789` sau `1250000` e greu de citit. Între acolade putem adăuga un **format**, un cod scurt după două puncte care îi spune lui Python cum să arate numărul

---

`:.2f` arată un număr cu exact 2 cifre după punct. Numărul e rotunjit, nu tăiat

```py
pret = 2.3456789
print(f"{pret:.2f}")
print(f"{pret:.1f}")
print(f"{7:.2f}")
```

Rezultat

```text
2.35
2.3
7.00
```

`f`-ul de la final înseamnă „un număr cu un număr fix de zecimale”. Variabila în sine nu se schimbă: doar felul în care e afișată. Și un număr întreg ca 7 își primește zecimalele

---

`:,` pune o virgulă între mii, ca numerele mari să se citească ușor. Merge și împreună cu zecimalele

```py
distanta = 384400000
print(f"{distanta:,}")
print(f"{1234567.891:,.2f}")
```

Rezultat

```text
384,400,000
1,234,567.89
```

Python scrie numerele ca în engleză: virgulă între mii și punct înainte de zecimale, invers față de cum scriem noi de obicei

---

Un număr în format înaintea punctului stabilește **lățimea**: câte caractere ocupă valoarea cel puțin. Restul se umple cu spații. `>` împinge valoarea la dreapta, `<` la stânga. Numerele la dreapta, numele la stânga, și coloanele noastre se aliniază

```py
print(f"{'Marte':<8}|{12.5:>8.1f}|")
print(f"{'Jupiter':<8}|{318:>8.1f}|")
```

Rezultat

```text
Marte   |    12.5|
Jupiter |   318.0|
```

`'Marte'` ocupă 8 caractere, numele în stânga și spații după el. Și `12.5` ocupă 8 caractere, cu spații în fața lui, așa că punctele celor două numere stau unul sub altul

---

Un `0` înaintea lățimii umple cu zerouri în loc de spații. Așa se fac coduri ca `007`

```py
for numar in range(1, 4):
    print(f"Camera {numar:03}")
```

Rezultat

```text
Camera 001
Camera 002
Camera 003
```

---

## Misiune: Raportul de combustibil

Stația are un șir de rezervoare de combustibil, iar inginerii vor un raport pe care să-l citească dintr-o privire

1. Începe programul cu o variabilă **rezervoare**, o listă de numere: litrii din fiecare rezervor. De exemplu `rezervoare = [1250.5, 87.25, 30000]`
2. Afișează câte o linie pentru fiecare rezervor: `Rezervor `, numărul rezervorului cu 2 cifre (primul rezervor e `01`), `: `, apoi litrii într-o coloană lată de 10 caractere, împinși la dreapta, cu virgulă între mii și 2 zecimale, apoi ` L`
3. Afișează o ultimă linie: `Total:` și șapte spații, apoi totalul tuturor rezervoarelor în aceeași coloană, la fel, apoi ` L`

`Rezervor 01: ` și `Total:` cu cele șapte spații ale lui au amândouă 13 caractere, așa că numerele liniei de total stau chiar sub celelalte

**rezervoare** are între 1 și 20 de rezervoare, fiecare cu 0 până la 40000 de litri, cu cel mult 2 zecimale

**Exemplu** pentru rezervoare = [1250.5, 87.25, 30000]

```text
Rezervor 01:   1,250.50 L
Rezervor 02:      87.25 L
Rezervor 03:  30,000.00 L
Total:        31,337.75 L
```
