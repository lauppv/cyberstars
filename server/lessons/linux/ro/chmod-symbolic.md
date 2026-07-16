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
chmod u=rwx,g=rx,o=r fisier.txt
```

Acest lucru setează proprietarului acces complet, grupului citire+execuție, iar celorlalți doar citire.

### Mai multe modificări deodată

```bash
chmod u+x,g-w fisier.txt
```

Adaugă execuție pentru user ȘI elimină scrierea pentru grup într-o singură comandă.

După fiecare `chmod`, verifică cu `ls -l` ca să confirmi că schimbarea a avut efect.

---

## Misiune: Activează deployerul de firmware

O actualizare critică de firmware este pregătită în `lansare.sh`, dar scriptul nu poate rula încă — și conține setări sensibile pe care străinii nu ar trebui să le citească niciodată.

1. Dă proprietarului permisiunea de a rula `lansare.sh` ca program.
2. Elimină accesul de citire pentru ceilalți pe `lansare.sh`, ca străinii să nu îl poată vedea.
3. Confirmă schimbările afișând permisiunile detaliate ale fișierului.
4. Creează un folder numit `gata-lansare` și copiază `lansare.sh` în el.

**Rezultat așteptat**

`lansare.sh` poate fi executat de proprietar și nu poate fi citit de ceilalți, iar o copie se află în `gata-lansare`.
