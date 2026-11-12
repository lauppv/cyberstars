Unele fișiere sunt uriașe: sute sau mii de linii. Aruncarea tuturor cu `cat` îți
inundă ecranul. Adesea vrei doar o privire rapidă la începutul unui fișier.

Comanda **head** afișează doar primele linii ale unui fișier. În mod implicit,
primele 10 linii:

```bash
head fisier_mare.log
```

```text
linia 1
linia 2
...
linia 10
```

### Alegerea câte linii: `-n`

Opțiunea `-n` setează exact câte linii vrei:

```bash
head -n 3 fisier_mare.log
```

```text
linia 1
linia 2
linia 3
```

### Când este util head

- Verificarea rândului de antet al unui fișier de date
- Vizualizarea modului în care _începe_ un fișier de log
- Eșantionarea unui fișier fără a derula prin tot

La fel ca `cat`, `head` doar citește. Nu schimbă nimic.

---

## Misiune: Verifică și Arhivează Pornirea

`sistem.log` ține tot ce s-a întâmplat de la ultima repornire, cele mai vechi întâi. Ingineria vrea primele cinci evenimente de pornire și nimic după ele, plus o copie a întregului jurnal păstrată ca `diagnostic/pornire.log`.

**Rezultat așteptat**

Vezi exact cinci linii, cele mai vechi din jurnal, iar copia din `diagnostic` spune ce spune originalul.
