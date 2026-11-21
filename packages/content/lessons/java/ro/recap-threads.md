Pune thread-urile, Runnable, synchronized și un thread pool să lucreze împreună într-un singur program

---

## Misiune: Noaptea loviturilor

E noaptea loviturilor în Vice City. Mai multe bande ies în același timp, fiecare face câteva treburi, iar toți banii ajung într-o singură ascunzătoare comună.

- Scrie o clasă `Ascunzatoare` cu o metodă `synchronized` `adauga(int suma)` care adună la total și numără prăzile
- Stochează numele bandelor într-un array de `String` numit `bande`, iar ce ia fiecare bandă la fiecare treabă într-un `int[][]` numit `prazi`: rândul `i` îi aparține lui `bande[i]`

Fă un pool de 2 thread-uri. Trimite câte o treabă pentru fiecare bandă. Treaba pune fiecare pradă a acelei bande în ascunzătoare, una câte una, și dă înapoi totalul bandei. Ține Future-urile într-o listă.

Apoi afișează `<banda>: N` pentru fiecare bandă, în ordine, urmat de `Ascunzatoare: N din K prazi` și `Cea mai buna banda: <banda>`, banda cu cel mai mare total. Dacă două bande sunt la egalitate, câștigă prima. Oprește pool-ul. Există mereu cel puțin o bandă.

**Exemplu** pentru `bande = { "Tommy", "Lance", "Ken" }` și `prazi = { { 500, 200 }, { 100 }, { 300, 300, 100 } }`

```text
Tommy: 700
Lance: 100
Ken: 700
Ascunzatoare: 1500 din 6 prazi
Cea mai buna banda: Tommy
```

**Exemplu** pentru `bande = { "Phil" }` și `prazi = { { } }`

```text
Phil: 0
Ascunzatoare: 0 din 0 prazi
Cea mai buna banda: Phil
```
