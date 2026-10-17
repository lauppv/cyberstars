Bubble Sort funcționează, dar este puțin risipitor: face o mulțime de interschimbări inutile. **Selection Sort** abordează lucrurile diferit: găsește cel **mai mic** element și îl pune pe poziția 0, apoi găsește **al doilea cel mai mic** și îl pune pe poziția 1, și așa mai departe

Gândește-te la asta ca la organizarea unui pachet de cărți de joc. Te uiți prin toate cărțile, o găsești pe cea mai mică și o pui prima. Apoi te uiți prin cărțile rămase, o găsești pe cea mai mică dintre ele și o pui a doua. Repeți până când totul este în ordine

```py
numere = [5, 3, 8, 1, 2]
```

**Pasul 1**: găsește cel mai mic din toată lista → **1** (la indexul 3). Interschimbă-l cu poziția 0
→ **[1, 3, 8, 5, 2]**

**Pasul 2**: găsește cel mai mic începând de la indexul 1 → **2** (la indexul 4). Interschimbă cu poziția 1
→ **[1, 2, 8, 5, 3]**

**Pasul 3**: găsește cel mai mic începând de la indexul 2 → **3** (la indexul 4). Interschimbă cu poziția 2
→ **[1, 2, 3, 5, 8]**

**Pasul 4**: găsește cel mai mic începând de la indexul 3 → **5** (la indexul 3). Deja la locul lui
→ **[1, 2, 3, 5, 8]**

**Gata!**

---

În cod

```py
numere = [5, 3, 8, 1, 2]

for i in range(len(numere)):
    index_minim = i
    for j in range(i + 1, len(numere)):
        if numere[j] < numere[index_minim]:
            index_minim = j
    numere[i], numere[index_minim] = numere[index_minim], numere[i]

print(numere)
```

Rezultatul **[1, 2, 3, 5, 8]**

**Bucla exterioară** alege fiecare poziție (0, 1, 2, ...). Pentru fiecare poziție, **bucla interioară** parcurge restul listei ca să găsească cel mai mic element. Apoi îl **interschimbăm** la locul lui

Diferența cheie față de Bubble Sort: facem doar **o singură interschimbare per trecere** în loc de potențial multe. Găsim mai întâi minimul, apoi interschimbăm o singură dată

---

Hai să urmărim codul pas cu pas pentru **[5, 3, 8, 1, 2]**

**i = 0**: min_index pornește de la 0 (valoarea 5). Bucla interioară găsește 1 la indexul 3, deci min_index = 3. Interschimbă pozițiile 0 și 3 → **[1, 3, 8, 5, 2]**

**i = 1**: min_index pornește de la 1 (valoarea 3). Bucla interioară găsește 2 la indexul 4, deci min_index = 4. Interschimbă pozițiile 1 și 4 → **[1, 2, 8, 5, 3]**

**i = 2**: min_index pornește de la 2 (valoarea 8). Bucla interioară găsește 3 la indexul 4, deci min_index = 4. Interschimbă pozițiile 2 și 4 → **[1, 2, 3, 5, 8]**

**i = 3**: min_index pornește de la 3 (valoarea 5). Bucla interioară nu găsește nimic mai mic, min_index rămâne 3. Interschimbă cu el însuși → **[1, 2, 3, 5, 8]**

```visual
{
  "type": "array",
  "values": [5, 3, 8, 1, 2],
  "caption": "i marchează poziția de completat. j parcurge restul listei, iar min_index ține minte unde este cel mai mic număr văzut până acum. Când j termină, acel număr se mută pe poziția i.",
  "markers": ["i = {i}", "j = {i}", "min_index = {i}"],
  "steps": [
    {"title": "Pasul 1", "at": [0, 1, 0], "compare": [1, 0], "ask": "Este 3 < 5?", "caption": "Da, deci min_index = 1", "move": [0, 1, 1]},
    {"at": [0, 2, 1], "compare": [2, 1], "ask": "Este 8 < 3?", "caption": "Nu, min_index rămâne 1"},
    {"at": [0, 3, 1], "compare": [3, 1], "ask": "Este 1 < 3?", "caption": "Da, deci min_index = 3", "move": [0, 3, 3]},
    {"at": [0, 4, 3], "compare": [4, 3], "ask": "Este 2 < 1?", "caption": "Nu, min_index rămâne 3"},
    {"at": [0, null, 3], "compare": [0, 3], "swap": true, "done": [0], "caption": "Cel mai mic este 1, la indexul 3. Își schimbă locul cu poziția 0 → [1, 3, 8, 5, 2]"},
    {"title": "Pasul 2", "at": [1, 2, 1], "compare": [2, 1], "ask": "Este 8 < 3?", "caption": "Nu, min_index rămâne 1"},
    {"at": [1, 3, 1], "compare": [3, 1], "ask": "Este 5 < 3?", "caption": "Nu, min_index rămâne 1"},
    {"at": [1, 4, 1], "compare": [4, 1], "ask": "Este 2 < 3?", "caption": "Da, deci min_index = 4", "move": [1, 4, 4]},
    {"at": [1, null, 4], "compare": [1, 4], "swap": true, "done": [0, 1], "caption": "Cel mai mic de la indexul 1 încolo este 2, la indexul 4. Își schimbă locul cu poziția 1 → [1, 2, 8, 5, 3]"},
    {"title": "Pasul 3", "at": [2, 3, 2], "compare": [3, 2], "ask": "Este 5 < 8?", "caption": "Da, deci min_index = 3", "move": [2, 3, 3]},
    {"at": [2, 4, 3], "compare": [4, 3], "ask": "Este 3 < 5?", "caption": "Da, deci min_index = 4", "move": [2, 4, 4]},
    {"at": [2, null, 4], "compare": [2, 4], "swap": true, "done": [0, 1, 2], "caption": "Cel mai mic de la indexul 2 încolo este 3, la indexul 4. Își schimbă locul cu poziția 2 → [1, 2, 3, 5, 8]"},
    {"title": "Pasul 4", "at": [3, 4, 3], "compare": [4, 3], "ask": "Este 8 < 5?", "caption": "Nu, min_index rămâne 3"},
    {"at": [3, null, 3], "done": [0, 1, 2, 3, 4], "caption": "5 este deja pe poziția 3, deci se interschimbă cu el însuși și nimic nu se mișcă. Ultimul număr, 8, e și el la locul lui. Gata!"}
  ]
}
```

---

**Este Selection Sort mai rapid decât Bubble Sort?** Fac cam același număr de **comparații** (n × n). Dar Selection Sort face mai puține **interschimbări**, ceea ce poate conta în practică. Totuși, ambele sunt lente pentru liste mari. **sorted()** din lumea reală este de sute de ori mai rapid

Scopul învățării acestor algoritmi nu este să-i folosești în producție. Este să înțelegi **cum să gândești** despre împărțirea unei probleme în pași, urmărirea stării cu variabile și folosirea eficientă a buclelor imbricate

---

## Misiune: Sortarea Încărcăturii

Scanerul din zona de marfă raportează greutățile containerelor în ordinea în care au fost încărcate. Ca să echilibreze cala, echipajul are nevoie ca acestea să fie sortate de la cel mai ușor la cel mai greu.

Scrie o funcție **sortare_selectie(numere)** care sortează o listă în ordine **crescătoare** folosind selection sort și **returnează** lista sortată.

Apoi sortează cele două loturi de greutăți (`lot1` și `lot2`, deja în starter) și afișează fiecare rezultat.

```py
lot1 = [64, 25, 12, 22, 11]
lot2 = [9, 7, 5, 3, 1]
print(sortare_selectie(lot1))
print(sortare_selectie(lot2))
```

**Ieșire**

```text
[11, 12, 22, 25, 64]
[1, 3, 5, 7, 9]
```
