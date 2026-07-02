Combină **aritmetica pointerilor**, **funcțiile pentru șiruri** și **struct-urile cu pointeri**

---

## Misiune: Reconstrucția Registrului de Interne

Registrul de linii telefonice interne ale centrului de calcul a crăpat pe disc și trebuie reconstruit de la zero, dintr-o bandă de backup. Construiește sistemul de căutare folosind struct-uri și aritmetica pointerilor.

1. Definește un struct **Contact** cu câmpurile **nume** (array de char) și **telefon** (array de char)
2. Scrie **void adauga_contact(Contact \*agenda, int \*numar, const char \*nume, const char \*telefon)** — adaugă un contact pe poziția **\*numar** și incrementează contorul. Folosește **strcpy** pentru a copia șirurile
3. Scrie **void cauta_contact(Contact \*agenda, int numar, const char \*cautare)** — parcurge contactele folosind **aritmetica pointerilor** (`(agenda + i)->nume`). Dacă e găsit, afișează **"Gasit: nume - telefon"**. Dacă nu e găsit, afișează **"Negasit: cautare"**
4. Citește din input: un număr **n** de contacte, urmat de **n** linii cu **nume telefon**. Apoi citește un număr **q** de căutări, urmat de **q** linii cu numele căutat

**Exemplu**

Input

```text
3
op7 0722111222
op12 0733222333
op9 0744333444
2
op12
op5
```

Output

```text
Gasit: op12 - 0733222333
Negasit: op5
```

**Exemplu**

Input

```text
2
tura1 0711000111
tura2 0722000222
3
tura2
tura9
tura1
```

Output

```text
Gasit: tura2 - 0722000222
Negasit: tura9
Gasit: tura1 - 0711000111
```
