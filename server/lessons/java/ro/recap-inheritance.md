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

În `main`, stochează cele trei nume de vehicule în `nume1`, `nume2`, `nume3` și cele patru distanțe în `km1`, `km2`, `km3`, `km4`. Pune o `Sportiva` (din `nume1`), un `Camion` (din `nume2`) și o `Motocicleta` (din `nume3`) într-un tablou `Vehicul[]`, apoi condu: primul vehicul `km1`, al doilea `km2`, al doilea din nou `km3` și al treilea `km4`. La final afișează fiecare vehicul. Distanțele sunt alese astfel încât a doua conducere a celui de-al doilea vehicul să poată forța un `"Combustibil insuficient!"`.

**Exemplu**

Cu un `Sportiva` „Infernus" condus 15 km, un `Camion` „Linerunner" condus 15 km și apoi încă 20 km (nu mai are destul: `20*5 = 100 > 25`), și un `Motocicleta` „Angel" condus 15 km, ai obține:

```text
Combustibil insuficient!
Infernus (Sportiva) - Combustibil: 70%
Linerunner (Camion) - Combustibil: 25%
Angel (Motocicleta) - Combustibil: 85%
```
