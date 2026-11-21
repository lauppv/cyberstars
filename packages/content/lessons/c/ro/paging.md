Fiecare proces crede că are o memorie mare și curată doar a lui, care începe de la adresa 0. E o iluzie construită de sistemul de operare, numită **memorie virtuală**. Adresele folosite de un program sunt virtuale. Hardware-ul o transformă pe fiecare într-o adresă reală, fizică, din RAM, cu ajutorul unui tabel pe care kernelul îl ține pentru fiecare proces

---

Memoria e tăiată în blocuri egale. Pe partea virtuală se numesc **pagini**, în RAM-ul adevărat se numesc **cadre** (frames), iar amândouă au aceeași mărime, de exemplu 4096 de bytes. **Tabelul de pagini** spune, pentru fiecare pagină a procesului, ce cadru o ține

O adresă se împarte în două părți

- **numărul paginii**: adresa / mărimea paginii
- **offset-ul**, locul din interiorul paginii: adresa % mărimea paginii

Adresa fizică e apoi cadru × mărimea paginii + offset

```text
marimea paginii 1000, tabelul: pagina 0 -> cadrul 5, pagina 1 -> cadrul 2

adresa 1234  ->  pagina 1, offset 234  ->  cadrul 2  ->  2 * 1000 + 234 = 2234
```

Offset-ul nu se schimbă niciodată. Doar partea de pagină e înlocuită cu un cadru

---

Mărimile adevărate ale paginilor sunt puteri ale lui 2, de exemplu 4096 = 2^12. Atunci împărțirea și restul sunt doar operații pe biți, pe care hardware-ul le face pe loc

```c
#include <stdio.h>

int main(void) {
    unsigned adresa = 13000;
    unsigned pagina = adresa >> 12;
    unsigned offset = adresa & 4095;
    printf("pagina %u, offset %u\n", pagina, offset);
    return 0;
}
```

Ieșire

```text
pagina 3, offset 712
```

**unsigned** e un număr întreg care nu e niciodată negativ și se afișează cu %u. Adresele nu sunt niciodată negative, deci li se potrivește. Deplasarea la dreapta cu 12 e același lucru cu împărțirea la 4096. Iar 4095 înseamnă doisprezece biți de 1, deci `& 4095` păstrează exact ultimii 12 biți, adică restul împărțirii

---

Nu fiecare pagină trebuie să fie în RAM. O pagină aflată pe disc, sau care n-a fost folosită niciodată, nu are cadru: intrarea ei e marcată **absentă**. Când programul atinge o astfel de pagină, hardware-ul se oprește și îl cheamă pe kernel: asta e o **eroare de pagină** (page fault). Kernelul încarcă pagina de pe disc într-un cadru liber, repară tabelul și lasă programul să continue, iar programul nu observă nimic. Așa pot programele să folosească mai multă memorie decât are de fapt RAM-ul

---

## Misiune: Traducătorul de adrese

Construiește traducerea pe care o face hardware-ul la fiecare acces la memorie

1. Citește mărimea paginii, o putere a lui 2, și numărul de pagini n. Apoi tabelul de pagini: n numere, unde intrarea p e cadrul paginii p, sau -1 dacă pagina e absentă
2. Citește adrese virtuale până se termină datele. Pentru fiecare, găsește numărul paginii și offset-ul cu deplasări și măști, nu cu / și %
3. Afișează traducerea ca în exemplu. Dacă pagina nu există în tabel sau e absentă, afișează `eroare de pagina` în locul adresei fizice
4. La final, afișează câte accese au produs o eroare de pagină

Mărimea paginii e între 16 și 65536. n e între 1 și 64. Cadrele sunt între 0 și 1000, iar adresele între 0 și 10000000

**Exemplu**

Intrare

```text
1024 4
5 -1 2 7
100 1500 2100 5000
```

Ieșire

```text
100: pagina 0, offset 100 -> 5220
1500: pagina 1, offset 476 -> eroare de pagina
2100: pagina 2, offset 52 -> 2100
5000: pagina 4, offset 904 -> eroare de pagina
Erori de pagina: 2
```

Tabelul are paginile de la 0 la 3, deci pagina 4 nu aparține deloc procesului
