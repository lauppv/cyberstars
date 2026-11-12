Uneori nu vrei să _citești_ un fișier. Vrei să îl măsori. Câte linii? Câte
cuvinte? Comanda **wc** (**word count**) îți spune.

Rulează un `wc` simplu pe un fișier:

```bash
wc echipaj.txt
```

```text
 3  3 15 echipaj.txt
```

Cele trei numere sunt, în ordine:

1. linii
2. cuvinte
3. caractere (octeți)

### Numărarea unui singur lucru

Opțiunile reduc rezultatul la un singur număr:

| Opțiune | Numără           |
| ------- | ---------------- |
| `wc -l` | doar liniile     |
| `wc -w` | doar cuvintele   |
| `wc -c` | doar caracterele |

```bash
wc -l echipaj.txt
```

```text
3 echipaj.txt
```

### De ce este util

`wc -l` este una dintre cele mai folosite comenzi pe Linux. „Câte intrări sunt în
această listă?” „Câte erori sunt în acest log?” Numără liniile și ai răspunsul.
Mai târziu vei alimenta ieșirea altor comenzi direct în `wc` pentru a număra
rezultatele automat.

---

## Misiune: Numără și Arhivează Inventarul

`inventar.txt` listează fiecare obiect din cală, câte unul pe linie. Intendentul vrea doar numărul de obiecte, nu cuvintele sau caracterele, iar manifestul arhivat ca `manifest/inventar-verificat.txt`. Apoi arată că și copia arhivată are tot atâtea obiecte cât originalul.

**Rezultat așteptat**

Știi câte obiecte sunt, iar numărătoarea copiei arhivate dă același număr.
