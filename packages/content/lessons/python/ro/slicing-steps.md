În lecția Metode pentru string-uri am luat o bucată dintr-un string cu `nume[0:5]`. Acum învățăm încă două trucuri: numărăm de la final și sărim peste caractere

---

Fiecare caracter are o poziție, numărată de la 0. Dar Python numără și de la final, cu numere negative. Ultimul caracter e pe poziția **-1**, cel dinaintea lui pe **-2** și tot așa

```text
 S   a   t   u   r   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

```py
planeta = "Saturn"
print(planeta[-1])
print(planeta[-2])
```

Rezultat

```text
n
r
```

De ce ne ajută? Fără asta, ca să luăm ultimul caracter avem nevoie de lungime: `planeta[len(planeta) - 1]`. Cu asta, ajunge `planeta[-1]`, și merge pentru un cuvânt de orice lungime

---

Pozițiile negative merg și în slice-uri

```py
planeta = "Saturn"
print(planeta[-3:])
print(planeta[:-1])
```

Rezultat

```text
urn
Satur
```

`planeta[-3:]` înseamnă „de la al treilea caracter de la final, până la final”, deci ultimele trei caractere. `planeta[:-1]` înseamnă „de la început până la ultimul, fără el”, deci tot în afară de ultimul caracter

---

Un slice poate primi și un al treilea număr: **pasul**. El spune cât de departe sărim de fiecare dată. Forma completă este `text[start:sfarsit:pas]`

```py
cod = "ABCDEFGH"
print(cod[0:8:2])
print(cod[::2])
print(cod[1::2])
```

Rezultat

```text
ACEG
ACEG
BDFH
```

Cu pasul 2, Python ia un caracter, sare peste următorul, îl ia pe cel de după și tot așa. Când lăsăm deoparte începutul și sfârșitul, slice-ul cuprinde tot string-ul. `cod[1::2]` începe de la poziția 1, așa că ia cealaltă jumătate

---

Pasul poate fi negativ. Atunci Python merge de la final spre început

```py
planeta = "Saturn"
print(planeta[::-1])
```

Rezultat

```text
nrutaS
```

Asta e string-ul de-a-ndoaselea, într-o singură linie scurtă. Cu `[::-2]` Python merge înapoi și sare și peste fiecare al doilea caracter

---

Toate astea merg la fel și pe liste

```py
numere = [10, 20, 30, 40, 50]
print(numere[-1])
print(numere[::2])
print(numere[::-1])
```

Rezultat

```text
50
[10, 30, 50]
[50, 40, 30, 20, 10]
```

---

## Misiune: Mesajul ascuns

Stația primește semnale radio pline de zgomot. Mesajul adevărat e ascuns înăuntru: citește semnalul de la final spre început și păstrează doar fiecare al doilea caracter, începând cu ultimul. Ultimele trei caractere ale semnalului sunt codul lui de verificare

1. Începe programul cu o variabilă **semnal**, un string. De exemplu `semnal = "S7R2A9T4S"`
2. Afișează `Verificare: ` și ultimele trei caractere ale semnalului
3. Afișează `Mesaj: ` și mesajul ascuns

Folosește slice-uri, nu o buclă. **semnal** are între 3 și 40 de caractere, doar litere și cifre

**Exemplu** pentru semnal = "S7R2A9T4S"

```text
Verificare: T4S
Mesaj: STARS
```

**Exemplu** pentru semnal = "o9l5l1e8h"

```text
Verificare: e8h
Mesaj: hello
```

**Exemplu** pentru semnal = "x1y2z3"

```text
Verificare: 2z3
Mesaj: 321
```
