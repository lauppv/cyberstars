Combină **inversarea șirurilor**, **palindrom**, **anagramă**, **filtrare/transformare** și **doi pointeri**

---

## Misiune: Trusa de Transmisii

Transmisiile primite sunt pline de zgomot și amestecate. Construiește o mică trusă de funcții ajutătoare, apoi folosește-le împreună ca să dai sens semnalului. Adună tot din acest capitol:

**clean_text(text)** — **filtrare și transformare**: păstrează doar literele și transformă-le în litere mici (folosește `.isalpha()`).

**is_palindrome(cuvant)** — verifică dacă cuvântul se citește la fel în ambele sensuri, folosind tehnica **celor doi pointeri** (un pointer la început, unul la sfârșit, mută-i spre centru).

**are_anagrams(a, b)** — curăță ambele cuvinte, apoi verifică dacă sunt anagrame (aceleași litere, ordine diferită). Sortează literele și compară.

**inverseaza_cuvinte(propozitie)** — inversează **ordinea cuvintelor** dintr-o propoziție (nu literele). Desparte, inversează lista, lipește înapoi cu spații.

Testează cu:

```py
print(este_palindrom(curata_text("A man, a plan, a canal: Panama")))
print(sunt_anagrame("Listen!", "Silent"))
print(inverseaza_cuvinte("navigation system is online"))
print(curata_text("S3ct0r 7 cl34r!"))
```

**Ieșire**

```text
True
True
online is system navigation
sctrclr
```
