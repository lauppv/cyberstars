# Suma a două numere

Având o listă de numere întregi și o valoare țintă, găsește **cei doi indici** ale căror valori însumate dau ținta.

Poți presupune că există **exact o singură** pereche validă, și nu poți folosi același element de două ori. Afișează indicii în ordine crescătoare.

### Date de intrare

- Linia 1: `n` numere întregi separate prin spații (lista).
- Linia 2: un singur număr întreg `target`.

### Rezultat

Doi indici `i j` indexați de la 0 (cu `i < j`) astfel încât `nums[i] + nums[j] == target`.

### Exemple

```
Intrare:
2 7 11 15
9

Ieșire:
0 1
```

```
Intrare:
3 2 4
6

Ieșire:
1 2
```

### Indicii

- **Forță brută**: încearcă fiecare pereche cu două bucle `for` imbricate — funcționează, dar este O(n^2).
- **Optim**: folosește un `dict` pentru a asocia fiecare valoare cu indicele său. Pentru fiecare număr `x`, verifică dacă `target - x` este deja în dicționar.
- Nu uita să afișezi primul indicele mai mic!
- Aceasta este o problemă clasică ce arată puterea dicționarelor pentru căutări rapide.
