Combină **fork**, **pipes** și **thread-uri** — toate conceptele de OS într-o singură provocare

---

## Misiune: Numărătoarea de cuvinte pe banda perforată

O bandă perforată foarte lungă a ajuns la centrul de calcul și trebuie numărate cuvintele de pe ea. Un proces copil face numărătoarea și trimite rezultatul înapoi la părinte printr-un pipe, ca să fie înregistrat în jurnal.

Datele sunt deja în dreapta. Fă următoarele, în ordine:

1. Scrie **int numara_cuvinte(const char \*text)** — numără cuvintele separate prin spații
2. Creează un pipe, apoi fă fork
3. **Copilul** numără cuvintele din **"Vulpea bruna sare repede peste cainele lenes din curte"**, convertește numărul într-un șir cu **sprintf**, îl scrie în pipe și iese
4. **Părintele** citește numărul din pipe și afișează rezultatul, apoi așteaptă copilul

**Exemplu**

Programul tău ar trebui să afișeze

```text
Copilul a numarat: 9 cuvinte
```

Folosește **pipe()**, **fork()**, **write()/read()** pentru comunicarea prin pipe și **sprintf()** pentru a formata numărul
