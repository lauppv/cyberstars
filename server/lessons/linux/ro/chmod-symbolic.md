Comanda **chmod** schimbă permisiunile unui fișier. În **modul simbolic**, specifici:

1. **Cine**: `u` (user/proprietar), `g` (grup), `o` (ceilalți), `a` (toți)
2. **Acțiune**: `+` (adaugă), `-` (elimină), `=` (setează exact)
3. **Permisiune**: `r`, `w`, `x`

### Adaugă permisiunea de execuție pentru proprietar

```bash
chmod u+x script.sh
```

Acum proprietarul poate rula `script.sh` ca program.

### Elimină permisiunea de scriere pentru grup și ceilalți

```bash
chmod go-w secret.txt
```

Grupul și ceilalți nu mai pot modifica acest fișier.

### Setarea unor permisiuni exacte

```bash
chmod u=rwx,g=rx,o=r file.txt
```

Acest lucru setează proprietarului acces complet, grupului citire+execuție, iar celorlalți doar citire.

### Mai multe modificări deodată

```bash
chmod u+x,g-w file.txt
```

Adaugă execuție pentru user ȘI elimină scrierea pentru grup într-o singură comandă.

După fiecare `chmod`, verifică cu `ls -l` ca să confirmi că schimbarea a avut efect.

---

## Misiune: Activează deployerul de firmware

O actualizare critică de firmware este pregătită în `deploy.sh`, dar scriptul nu poate rula încă — îi lipsește permisiunea de execuție pentru proprietar.

1. Folosește `chmod` pentru a adăuga **permisiunea de execuție pentru user (proprietar)** pe `deploy.sh`.
2. Rulează `ls -l deploy.sh` pentru a confirma schimbarea.

**Rezultat așteptat**

`ls -l` arată că proprietarul are acum permisiune de execuție (`x`) pe `deploy.sh`.
