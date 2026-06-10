Combină **fork**, **pipes** și **thread-uri** — toate conceptele de OS într-o singură provocare

---

## Misiune: Analiza Semnalului din Spațiul Adânc

Stația a interceptat o transmisie din spațiul adânc. Semnalul este prea lung ca să fie decodat într-un singur proces, așa că Tommy împarte munca: un proces copil numără cuvintele și trimite rezultatul înapoi la părinte prin pipe pentru înregistrare.

Datele sunt deja în dreapta. Fă următoarele, în ordine:

1. Scrie **int numara_cuvinte(const char \*text)** — numără cuvintele separate prin spații
2. Creează un pipe, apoi fă fork
3. **Copilul** numără cuvintele din **"Vulpea bruna sare repede peste cainele lenes din curte"**, convertește numărul într-un șir cu **sprintf**, îl scrie în pipe și iese
4. **Părintele** citește numărul din pipe și afișează rezultatul, apoi așteaptă copilul

**Output**

```text
Copilul a numarat: 9 cuvinte
```

Folosește **pipe()**, **fork()**, **write()/read()** pentru comunicarea prin pipe și **sprintf()** pentru a formata numărul
