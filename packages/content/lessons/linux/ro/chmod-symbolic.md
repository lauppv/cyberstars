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

## Misiune: Activează Programul de Lansare

O actualizare de firmware așteaptă în `lansare.sh`, dar nu poate rula încă și conține setări pe care străinii nu trebuie să le citească niciodată. Schimbă doar ce trebuie schimbat: proprietarul primește dreptul să-l ruleze, iar toți cei din afara proprietarului și a grupului pierd dreptul să-l citească. Toate celelalte permisiuni rămân cum sunt. Apoi pune o copie într-un folder nou `gata-lansare`.

**Rezultat așteptat**

`lansare.sh` poate fi rulat de proprietar și nu poate fi citit de ceilalți, celelalte permisiuni sunt neatinse, iar o copie stă în `gata-lansare`.
