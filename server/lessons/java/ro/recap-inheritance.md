Combină **moștenirea**, **suprascrierea metodelor**, **polimorfismul** și **clasele abstracte**

---

## Misiune: Flota lui Tommy

Tommy are o flotă pestriță în garajele lui din Vice City — mașini sport, camioane, motociclete. Fiecare tip consumă combustibil cu o rată diferită. Construiește un sistem `Vehicul` abstract, astfel încât toată flota să poată fi gestionată la fel, indiferent de tip.

Creează o clasă **abstractă** `Vehicul` cu:

- Câmpuri: `nume` (String), `combustibil` (int, începe de la `100`)
- Constructorul primește numele
- **`abstract String tip()`** — fiecare subclasă returnează tipul ei
- **`abstract int consumPeKm()`** — combustibilul consumat pe km (diferit pentru fiecare vehicul)
- **`void condu(int km)`** — scade combustibilul cu `km * consumPeKm()`. Dacă nu este destul combustibil, afișează `"Combustibil insuficient!"` și nu schimbă nimic
- **`toString()`** — returnează `"nume (tip) - Combustibil: X%"`

Apoi creează trei subclase concrete:

- `Sportiva` — `consumPeKm()` returnează `2`, `tip()` returnează `"Sportiva"`
- `Camion` — `consumPeKm()` returnează `5`, `tip()` returnează `"Camion"`
- `Motocicleta` — `consumPeKm()` returnează `1`, `tip()` returnează `"Motocicleta"`

În `main`, pune câteva vehicule într-un tablou `Vehicul[]`, condu-le cât vrei tu, apoi afișează fiecare vehicul. Joacă-te cu kilometrii cât să forțezi măcar un `"Combustibil insuficient!"`.

**Exemplu**

Cu un `Sportiva` „Infernus" condus 15 km, un `Camion` „Linerunner" condus 15 km și apoi încă 20 km (nu mai are destul: `20*5 = 100 > 25`), și un `Motocicleta` „Angel" condus 15 km, ai obține:

```text
Combustibil insuficient!
Infernus (Sportiva) - Combustibil: 70%
Linerunner (Camion) - Combustibil: 25%
Angel (Motocicleta) - Combustibil: 85%
```
