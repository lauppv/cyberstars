# Mediu · Implementarea unei cozi

Implementează o clasă **Coada** folosind un `ArrayList` ca stocare internă. Coada trebuie să suporte operațiile `adauga`, `scoate` și `varf`, urmând principiul FIFO (First In, First Out — primul intrat, primul ieșit).

Procesează comenzile de la stdin și afișează rezultatele pentru `scoate` și `varf`. Dacă `scoate` sau `varf` este apelat pe o coadă goală, afișează `Goala`.

### Date de intrare

- Linia 1: numărul de comenzi N
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`adauga`, `scoate` sau `varf`)
  - Doar pentru `adauga`, linia 2: numărul întreg X

Comportament:

- `adauga X` — adaugă X la spatele cozii
- `scoate` — elimină și afișează elementul din față
- `varf` — afișează elementul din față fără a-l elimina

### Rezultat

- Pentru fiecare `scoate`: valoarea eliminată, sau `Goala`
- Pentru fiecare `varf`: valoarea din față, sau `Goala`

### Exemple

```
Intrare:
6
adauga
10
adauga
20
varf
scoate
scoate
scoate

Ieșire:
10
10
20
Goala
```

```
Intrare:
4
adauga
5
adauga
15
scoate
varf

Ieșire:
5
15
```

```
Intrare:
2
scoate
varf

Ieșire:
Goala
Goala
```

Atât `scoate`, cât și `varf` trebuie să afișeze `Goala` când coada nu conține nimic.
