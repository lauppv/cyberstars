Combină **inversarea șirurilor**, **palindrom**, **anagramă**, **filtrare/transformare** și **doi pointeri**

---

## Misiune: Trusa de Transmisii

Transmisiile primite sunt pline de zgomot și amestecate. Construiește o mică trusă de funcții ajutătoare, apoi folosește-le împreună ca să dai sens semnalului. Adună tot din acest capitol:

**curata_text(text)** — **filtrare și transformare**: păstrează doar literele și transformă-le în litere mici (folosește `.isalpha()`).

**este_palindrom(cuvant)** — verifică dacă cuvântul se citește la fel în ambele sensuri, folosind tehnica **celor doi pointeri** (un pointer la început, unul la sfârșit, mută-i spre centru).

**sunt_anagrame(a, b)** — curăță ambele cuvinte, apoi verifică dacă sunt anagrame (aceleași litere, ordine diferită). Sortează literele și compară.

**inverseaza_cuvinte(propozitie)** — inversează **ordinea cuvintelor** dintr-o propoziție (nu literele). Desparte, inversează lista, lipește înapoi cu spații.

Testează cu:

```py
text_palindrom = "A man, a plan, a canal: Panama"
anagrama_a = "Listen!"
anagrama_b = "Silent"
propozitie = "navigation system is online"
text_murdar = "S3ct0r 7 cl34r!"
print(este_palindrom(curata_text(text_palindrom)))
print(sunt_anagrame(anagrama_a, anagrama_b))
print(inverseaza_cuvinte(propozitie))
print(curata_text(text_murdar))
```

**Ieșire**

```text
True
True
online is system navigation
sctrclr
```
