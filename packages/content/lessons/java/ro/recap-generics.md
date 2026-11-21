Pune clasele wrapper, clasele generice, metodele generice și tipurile mărginite să lucreze împreună într-un singur program

---

## Misiune: Dulapurile de depozitare

Tommy închiriază dulapuri de depozitare. Unele țin lăzi etichetate cu nume, altele lăzi etichetate cu greutatea lor. Vrea un singur fel de raft care să meargă pentru amândouă.

1. Scrie o clasă generică `Raft<T extends Comparable<T>>` care își ține lucrurile într-un `ArrayList<T>`. Dă-i `adauga(T lucru)`, `marime()`, și `celMaiMic()` și `celMaiMare()`, care găsesc lucrul cu `compareTo`
2. Scrie o metodă generică `raport(String eticheta, Raft<T> raft)` care dă înapoi `<eticheta>: N lucruri, cel mai mic X, cel mai mare Y`, sau `<eticheta>: gol` când raftul nu are nimic pe el

În `main`, stochează numele într-un array de `String` numit `nume` și greutățile într-un array de `Integer` numit `greutati`. Pune fiecare nume pe un `Raft<String>` și fiecare greutate pe un `Raft<Integer>`. Afișează raportul pentru `Nume`, apoi pentru `Greutati`.

**Exemplu** pentru `nume = { "Tommy", "Ken", "Lance" }` și `greutati = { 12, 5, 30 }`

```text
Nume: 3 lucruri, cel mai mic Ken, cel mai mare Tommy
Greutati: 3 lucruri, cel mai mic 5, cel mai mare 30
```

**Exemplu** pentru `nume = { "Phil" }` și `greutati = { }`

```text
Nume: 1 lucruri, cel mai mic Phil, cel mai mare Phil
Greutati: gol
```
