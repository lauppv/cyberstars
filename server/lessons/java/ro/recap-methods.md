Combină **valori returnate**, **supraîncărcarea metodelor (overloading)** și **bucle imbricate**

---

## Misiune: Panoul de Afișaj al Ecluzei

Panoul de afișaj al ecluzei stației are nevoie de un randator de chenare vizuale. Îl vei construi folosind metode supraîncărcate și bucle imbricate.

1. Scrie o metodă **`static String repeta(String s, int times)`** care returnează șirul repetat de `times` ori (folosește o buclă și concatenare)
2. **Supraîncarc-o**: **`static String repeta(char c, int times)`** — același lucru, dar pentru un singur caracter
3. Scrie **`static void afiseazaChenar(int latime, int inaltime)`** care folosește bucle imbricate și metoda `repeta` pentru a afișa un chenar făcut din `*` și spații. Primul și ultimul rând sunt formate doar din `*`. Rândurile din mijloc au `*`, apoi spații, apoi `*`

Apelurile de test din main sunt deja pregătite în dreapta.

**Output**

```text
ababab
*****
******
*    *
*    *
******
```
