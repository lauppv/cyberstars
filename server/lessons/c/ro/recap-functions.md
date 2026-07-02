Combină **bucle while**, **funcții**, **input** și **operatori**

---

## Misiune: Coada de calcul a centrului de date

Centrul de calcul primește o coadă de comenzi de la teletype-uri conectate. Fiecare linie din coadă conține doi operanzi și un cod de operație. Ferma de calcul trebuie să proceseze coada până primește semnalul de oprire (cod op 0).

Scrie aceste funcții:

- **int aduna(int a, int b)** — întoarce a + b
- **int inmulteste(int a, int b)** — întoarce a \* b
- **int putere(int baza, int exp)** — întoarce baza^exp folosind o **buclă while**

Programul principal citește trei numere întregi din input: **a**, **b** și **op**

- Dacă **op** este **1**, afișează rezultatul lui **aduna(a, b)**
- Dacă **op** este **2**, afișează rezultatul lui **inmulteste(a, b)**
- Dacă **op** este **3**, afișează rezultatul lui **putere(a, b)**
- Dacă **op** este **0**, oprește programul

**Exemplu**

Input

```text
3 4 1
2 5 2
2 8 3
0 0 0
```

Output

```text
7
10
256
```

**Exemplu**

Input

```text
10 20 1
0 0 0
```

Output

```text
30
```

Fiecare linie de input are trei numere. Procesează-le una câte una până când op este 0. Implementează **putere** cu o buclă while, nu cu o funcție de bibliotecă.
