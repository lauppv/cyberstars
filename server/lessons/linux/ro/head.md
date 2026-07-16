Unele fișiere sunt uriașe — sute sau mii de linii. Aruncarea tuturor cu `cat` îți
inundă ecranul. Adesea vrei doar o privire rapidă la **începutul** unui fișier.

Comanda **head** afișează doar **primele linii** ale unui fișier. În mod implicit,
**primele 10 linii**:

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

- Verificarea **rândului de antet** al unui fișier de date
- Vizualizarea modului în care _începe_ un fișier de log
- Eșantionarea unui fișier fără a derula prin tot

La fel ca `cat`, `head` doar citește — nu schimbă nimic.

---

## Misiune: Verifică și arhivează secvența de pornire

Fișierul `sistem.log` al stației înregistrează totul de la ultima repornire.
Departamentul tehnic vrea să verifice secvența de pornire și să păstreze o copie a
log-ului în folderul de diagnostic.

1. Afișează doar **primele 5 linii** din `sistem.log` — cele mai vechi evenimente de
   pornire.
2. Creează un folder numit `diagnostic` și copiază `sistem.log` în el sub numele
   `pornire.log`.
3. Verifică copia afișând doar **primele 3 linii** din `diagnostic/pornire.log`.

**Rezultat așteptat**

Apar primele evenimente de pornire, apoi un eșantion mai scurt de 3 linii din copia
arhivată. Folderul `diagnostic` conține o copie fidelă a log-ului.
