# Medium · Stack Using Array

Implementează o structură de date de tip **stivă** folosind un tablou. Citește o secvență de comenzi și procesează-le:

- **push X** — adaugă numărul întreg X în vârful stivei
- **pop** — elimină și afișează elementul din vârf, sau afișează `Empty` dacă stiva este goală
- **peek** — afișează elementul din vârf fără a-l elimina, sau afișează `Empty` dacă stiva este goală

### Date de intrare

- Prima linie: un întreg `M` (1 ≤ M ≤ 100), numărul de comenzi
- Următoarele `M` linii: o comandă pe linie (`push X`, `pop` sau `peek`)

### Rezultat

Pentru fiecare comandă `pop` sau `peek`, afișează o linie: valoarea sau `Empty`.

### Exemple

```
Intrare:
5
push 10
push 20
peek
pop
pop
Ieșire:
20
20
10
```

```
Intrare:
3
pop
push 5
peek
Ieșire:
Empty
5
```

### Indicii

- Folosește un tablou de dimensiune fixă (de ex., 100) și o variabilă `top` inițializată cu `-1`.
- `push`: incrementează `top`, apoi setează `arr[top] = X`.
- `pop`: dacă `top >= 0`, afișează `arr[top]` și decrementează `top`; altfel afișează `Empty`.
- `peek`: dacă `top >= 0`, afișează `arr[top]`; altfel afișează `Empty`.
- Folosește `strcmp` pentru a compara șirurile de comenzi — nu uita să incluzi `#include <string.h>`.
