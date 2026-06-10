Combină **aritmetica pointerilor**, **funcțiile pentru șiruri** și **struct-urile cu pointeri**

---

## Misiune: Căutare în Directorul Echipajului

Directorul echipajului stației a crăpat și trebuie reconstruit de la zero. Cortez are datele de backup pentru trei membri ai echipajului. Construiește sistemul de căutare folosind struct-uri și aritmetica pointerilor.

Datele sunt deja în dreapta. Fă următoarele, în ordine:

1. Scrie **void adauga_contact(Contact *agenda, int *numar, const char *nume, const char *telefon)** — adaugă un contact pe poziția **\*numar** și incrementează contorul. Folosește **strcpy** pentru a copia șirurile
2. Scrie **void cauta_contact(Contact *agenda, int numar, const char *cautare)** — parcurge contactele folosind **aritmetica pointerilor** (`(agenda + i)->nume`). Dacă e găsit, afișează **"Gasit: nume - telefon"**. Dacă nu e găsit, afișează **"Negasit: cautare"**
3. Adaugă acești membri ai echipajului: Tommy (0722111222), Lance (0733222333), Ken (0744333444)
4. Caută "Lance" și "Diaz"

**Output**

```text
Gasit: Lance - 0733222333
Negasit: Diaz
```
