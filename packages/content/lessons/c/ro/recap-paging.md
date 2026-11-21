Traducerea adreselor, erorile de pagină și înlocuirea LRU împreună: o mică memorie virtuală, așa cum o conduce un kernel

---

## Misiune: Memoria virtuală

Mainframe-ul îi dă unui program doar câteva cadre de memorie reală și încarcă paginile când e nevoie de ele. Simulează asta: tradu fiecare adresă, încarcă paginile la erori și dă afară pagina folosită cel mai demult când memoria e plină

1. Citește mărimea paginii, o putere a lui 2, și numărul de cadre F. Apoi citește adrese virtuale până se termină datele
2. Pentru fiecare adresă, găsește-i pagina și offset-ul cu deplasări și măști
3. Dacă pagina e în memorie, e o găsire. Dacă nu, e o eroare: pagina primește cadrul liber cu numărul cel mai mic sau, când nu e niciun cadru liber, cadrul paginii folosite cel mai demult, care e dată afară. Fiecare acces contează ca o folosire
4. Afișează câte o linie pentru fiecare acces, ca în exemplu, cu adresa fizică la final. Apoi afișează numărul de erori și de găsiri

Mărimea paginii e între 16 și 4096, F între 1 și 8, iar adresele între 0 și 1000000. Sunt cel mult 500 de adrese

**Exemplu**

Intrare

```text
256 2
100 300 120 600 310 900 100
```

Ieșire

```text
100: pagina 0, eroare, cadrul 0 -> 100
300: pagina 1, eroare, cadrul 1 -> 300
120: pagina 0, gasit, cadrul 0 -> 120
600: pagina 2, eroare, iese pagina 1, cadrul 1 -> 344
310: pagina 1, eroare, iese pagina 0, cadrul 0 -> 54
900: pagina 3, eroare, iese pagina 2, cadrul 1 -> 388
100: pagina 0, eroare, iese pagina 1, cadrul 0 -> 100
Erori: 6, gasite: 1
```
