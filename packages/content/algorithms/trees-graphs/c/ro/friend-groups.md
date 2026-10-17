Într-o clasă, unele perechi de elevi sunt prieteni. Un **grup** e format din elevi legați prin prietenie, direct sau prin prieteni ai prietenilor, iar un elev fără prieteni e singur un grup. Clasa vine ca graf, câte un nod pentru fiecare elev și câte o muchie pentru fiecare prietenie. Afișează câte grupuri sunt.

### Cum se scrie un graf

Pe prima linie sunt numărul de noduri `n` și numărul de muchii `m`. Urmează `m` linii, câte una pentru fiecare muchie, cu cele două noduri pe care le unește. Nodurile sunt numerotate de la `0` la `n - 1`, iar o muchie merge în ambele sensuri.

```
0 --- 1 --- 2     3 --- 4     5
```

Graful acesta se scrie:

```
6 3
0 1
1 2
3 4
```

Nodul `5` nu are nicio muchie, așa că apare doar în numărul `6`.

Codul de început citește deja graful în tablourile globale `vecini` și `numar`, unde `vecini[u][0]` până la `vecini[u][numar[u] - 1]` sunt vecinii lui `u`, apoi afișează ce întoarce `numara_grupuri`. Tu scrii `numara_grupuri`.

### Date de intrare

- Linia 1: `n` și `m`. Sunt între 1 și 500 de noduri și cel mult 2000 de muchii.
- Următoarele `m` linii: muchiile. Nicio muchie nu unește un nod cu el însuși și nicio pereche de noduri nu e unită de două muchii.

### Rezultat

Numărul de grupuri.

### Exemple

```
Intrare:
6 3
0 1
1 2
3 4

Ieșire:
3
```

`0`, `1` și `2` sunt un grup, `3` și `4` alt grup, iar `5` e singur.

```
Intrare:
5 4
0 4
4 2
2 1
1 3

Ieșire:
1
```

`0` și `3` nu sunt prieteni, dar îi leagă un lanț de prieteni, așa că toți sunt într-un singur grup.

```
Intrare:
4 0

Ieșire:
4
```
