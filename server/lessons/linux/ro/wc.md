Uneori nu vrei să _citești_ un fișier — vrei să îl **măsori**. Câte linii? Câte
cuvinte? Comanda **wc** (**word count**) îți spune.

Rulează un `wc` simplu pe un fișier:

```bash
wc echipaj.txt
```

```text
 3  3 15 echipaj.txt
```

Cele trei numere sunt, în ordine:

1. **linii**
2. **cuvinte**
3. **caractere (octeți)**

### Numărarea unui singur lucru

Opțiunile reduc rezultatul la un singur număr:

| Opțiune | Numără               |
| ------- | -------------------- |
| `wc -l` | doar **liniile**     |
| `wc -w` | doar **cuvintele**   |
| `wc -c` | doar **caracterele** |

```bash
wc -l echipaj.txt
```

```text
3 echipaj.txt
```

### De ce este util

`wc -l` este una dintre cele mai folosite comenzi pe Linux. „Câte intrări sunt în
această listă?” „Câte erori sunt în acest log?” — numără liniile și ai răspunsul.
Mai târziu vei alimenta ieșirea altor comenzi direct în `wc` pentru a număra
rezultatele automat.

---

## Misiune: Numără și depune inventarul

`inventar.txt` listează fiecare articol din cala de marfă, câte unul pe linie.
Logisticianul are nevoie de un număr exact înainte ca naveta de reaprovizionare să
sosească, plus o copie depusă a manifestului.

1. Numără **câte linii** sunt în `inventar.txt` — acela este numărul de articole.
2. Rulează o măsurătoare completă a lui `inventar.txt` ca să vezi liniile, cuvintele și
   caracterele împreună.
3. Creează un folder numit `manifest` și copiază `inventar.txt` în el sub numele
   `inventar-verificat.txt`.
4. Confirmă că fișierul depus are același număr de articole numărând și **liniile** lui.

**Rezultat așteptat**

Vezi numărul de articole și măsurătoarea completă, iar folderul `manifest` conține o
copie al cărei număr de linii se potrivește cu originalul.
