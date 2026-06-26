Două cuvinte sunt **anagrame** dacă conțin exact **aceleași litere**, doar într-o ordine diferită. **listen** și **silent**. **evil** și **vile**. **astronomer** și **moon starer** (ok, ultimul are un spațiu, dar înțelegi ideea)

Cum verificăm? Cea mai simplă abordare: **sortăm literele** și le comparăm

```py
def este_anagrama(cuvant1, cuvant2):
    return sorted(cuvant1.lower()) == sorted(cuvant2.lower())

print(este_anagrama("listen", "silent"))
print(este_anagrama("hello", "world"))
print(este_anagrama("Evil", "Vile"))
```

Ieșire

```text
True
False
True
```

De ce funcționează? Dacă două cuvinte au aceleași litere, sortarea acelor litere va produce **același rezultat**. „listen" sortat → „eilnst". „silent" sortat → „eilnst". La fel? Da → anagramă

Folosim **.lower()** ca să nu conteze majusculele și minusculele

---

Dar hai să o rezolvăm și folosind ce am învățat — un **dicționar de frecvențe**. Două cuvinte sunt anagrame dacă fiecare literă apare de **același număr de ori** în ambele cuvinte

```py
def este_anagrama(cuvant1, cuvant2):
    cuvant1 = cuvant1.lower()
    cuvant2 = cuvant2.lower()

    if len(cuvant1) != len(cuvant2):
        return False

    freq1 = {}
    for caracter in cuvant1:
        if caracter in freq1:
            freq1[caracter] += 1
        else:
            freq1[caracter] = 1

    freq2 = {}
    for caracter in cuvant2:
        if caracter in freq2:
            freq2[caracter] += 1
        else:
            freq2[caracter] = 1

    return freq1 == freq2

print(este_anagrama("listen", "silent"))
print(este_anagrama("hello", "world"))
```

Ieșire

```text
True
False
```

Construim un dicționar de frecvențe pentru fiecare cuvânt, apoi le comparăm. Dacă dicționarele sunt egale, cuvintele au aceleași litere cu aceleași cantități → anagramă

Observă **ieșirea timpurie**: dacă lungimile sunt diferite, nu pot fi anagrame — nu are rost să numărăm nimic

---

Abordarea cu frecvențe este de fapt **mai rapidă** decât sortarea pentru șiruri foarte lungi. Sortarea ia aproximativ **n × log(n)** pași, în timp ce numărarea ia doar **n** pași. Pentru acest exercițiu, ambele sunt bune, dar e bine să te gândești la astfel de lucruri

---

## Misiune: Potrivirea Parolelor

Doi membri ai echipajului transmit fiecare câte o parolă amestecată. Sasul se deschide doar dacă cele două parole sunt **anagrame** una a celeilalte — aceleași litere într-o ordine diferită (nu contează majusculele).

1. Scrie o funcție **sunt_anagrame(a, b)** care returnează `True` dacă cele două cuvinte sunt anagrame, `False` altfel. Folosește **oricare** abordare (sortează literele și compară, sau un dicționar de frecvențe). Transformă-le mai întâi în minuscule ca să nu conteze majusculele.
2. **Citește** două parole, apoi afișează `Anagrama: ` urmat de rezultat.
3. Pe linia următoare, afișează `Acces permis` dacă se potrivesc, sau `Acces refuzat` dacă nu.

**Intrare** (tastat de utilizator când rulează programul):

- prima parolă
- a doua parolă

**Ieșire** — două linii: verificarea anagramei, apoi verdictul accesului.

**Exemplu**

Dacă utilizatorul tastează

```text
listen
silent
```

programul ar trebui să afișeze

```text
Anagrama: True
Acces permis
```

Dacă utilizatorul tastează

```text
orbit
robot
```

programul ar trebui să afișeze

```text
Anagrama: False
Acces refuzat
```
