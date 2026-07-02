Combină **array-uri**, **parcurgerea array-urilor**, **break/continue** și **funcții**

---

## Misiune: Raportul de verificare al operatorilor

Șeful de tură a strâns notele de la testul de certificare al operatorilor de teletype. Are nevoie de un rezumat rapid: câți au trecut, cea mai mare notă și prima cădere, ca să poată programa o retestare.

1. Citește un întreg **n** din input — numărul de note
2. Citește **n** note întregi într-un array
3. Scrie **int numara_promovati(int note[], int n)** — întoarce câte note sunt **>= 50**. Folosește **continue** ca să sari peste notele sub 50
4. Scrie **int gaseste_max(int note[], int n)** — întoarce nota cea mai mare
5. Scrie **int gaseste_prima_cadere(int note[], int n)** — întoarce **prima** notă căzută (sub 50), în ordinea în care apare în array. Folosește **break** ca să te oprești de îndată ce găsești una. Întoarce **-1** dacă toți au trecut
6. Afișează cele trei rezultate, exact în formatul din exemplu

**Exemplu**

Input

```text
8
85 42 91 67 38 73 95 55
```

Output

```text
Promovati: 6
Maxim: 95
Prima cadere: 42
```

**Exemplu**

Input

```text
4
60 70 80 90
```

Output

```text
Promovati: 4
Maxim: 90
Prima cadere: -1
```
