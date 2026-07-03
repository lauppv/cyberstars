Unele fișiere sunt uriașe — sute sau mii de linii. Aruncarea tuturor cu `cat` îți
inundă ecranul. Adesea vrei doar o privire rapidă la **începutul** unui fișier.

Comanda **head** afișează doar **primele linii** ale unui fișier. În mod implicit,
**primele 10 linii**:

```bash
head bigfile.log
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
head -n 3 bigfile.log
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

## Misiune: Verifică secvența de pornire

Fișierul `sistem.log` al stației înregistrează totul de la ultima repornire.
Departamentul tehnic vrea să verifice secvența de pornire uitându-se doar la chiar
începutul log-ului.

Folosește `head` cu opțiunea `-n` pentru a afișa doar **primele 5 linii** din
`sistem.log`.

**Rezultat așteptat**

Apar doar primele 5 linii din log — cele mai vechi evenimente înregistrate după
pornire.
