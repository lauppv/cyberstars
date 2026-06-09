Combină **bucle while**, **funcții**, **input** și **operatori**

---

## Misiune: Computerul de Navigație

Computerul de navigație al stației procesează calcule de traiectorie dintr-o coadă. Fiecare calcul specifică doi operanzi și un cod de operație. Computerul trebuie să continue procesarea până când primește un semnal de oprire (cod op 0).

Scrie aceste funcții:

- **int aduna(int a, int b)** — întoarce a + b
- **int inmulteste(int a, int b)** — întoarce a \* b
- **int putere(int baza, int exp)** — întoarce baza^exp folosind o **buclă while**

Programul principal citește trei numere întregi din input: **a**, **b** și **op**

- Dacă **op** este **1**, afișează rezultatul lui **aduna(a, b)**
- Dacă **op** este **2**, afișează rezultatul lui **inmulteste(a, b)**
- Dacă **op** este **3**, afișează rezultatul lui **putere(a, b)**
- Dacă **op** este **0**, oprește programul

Input-ul va fi

```text
3 4 1
2 5 2
2 8 3
0 0 0
```

**Output**

```text
7
10
256
```

Fiecare linie de input are trei numere. Procesează-le una câte una până când op este 0. Implementează **putere** cu o buclă while, nu cu o funcție de bibliotecă
