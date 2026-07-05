# Mediu · Implementarea unei stive

Implementează o clasă **Stiva** folosind un `ArrayList` ca stocare internă. Stiva trebuie să suporte operațiile `pune`, `scoate` și `varf`.

Procesează comenzile de la stdin și afișează rezultatele pentru `scoate` și `varf`. Dacă `scoate` sau `varf` este apelat pe o stivă goală, afișează `Goala`.

### Date de intrare

- Linia 1: numărul de comenzi N
- Pentru fiecare comandă:
  - Linia 1: tipul comenzii (`pune`, `scoate` sau `varf`)
  - Doar pentru `pune`, linia 2: numărul întreg X

Comportament:

- `pune X` — pune X pe stivă
- `scoate` — elimină și afișează elementul din vârf
- `varf` — afișează elementul din vârf fără a-l elimina

### Rezultat

- Pentru fiecare `scoate`: valoarea eliminată, sau `Goala`
- Pentru fiecare `varf`: valoarea din vârf, sau `Goala`

### Exemple

```
Intrare:
6
pune
10
pune
20
varf
scoate
scoate
scoate

Ieșire:
20
20
10
Goala
```

```
Intrare:
3
pune
5
pune
15
varf

Ieșire:
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

Atât `scoate`, cât și `varf` trebuie să afișeze `Goala` când stiva nu conține nimic.
