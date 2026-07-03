Uneori nu vrei să _citești_ un fișier — vrei să îl **măsori**. Câte linii? Câte
cuvinte? Comanda **wc** (**word count**) îți spune.

Rulează un `wc` simplu pe un fișier:

```bash
wc crew.txt
```

```text
 3  3 15 crew.txt
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
wc -l crew.txt
```

```text
3 crew.txt
```

### De ce este util

`wc -l` este una dintre cele mai folosite comenzi pe Linux. „Câte intrări sunt în
această listă?” „Câte erori sunt în acest log?” — numără liniile și ai răspunsul.
Mai târziu vei alimenta ieșirea altor comenzi direct în `wc` pentru a număra
rezultatele automat.

---

## Misiune: Numără inventarul

Sistemul de gestionare a proviziilor raportează că `inventar.txt` listează fiecare
articol din cala de marfă, câte unul pe linie. Logisticianul are nevoie de un număr
exact înainte ca naveta de reaprovizionare să sosească.

Folosește `wc` cu opțiunea potrivită pentru a număra **câte linii** sunt în
`inventar.txt`.

**Rezultat așteptat**

Terminalul afișează numărul de linii, spunându-ți exact câte articole se află în
inventar.
