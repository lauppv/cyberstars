Combină **moștenirea**, **suprascrierea metodelor**, **polimorfismul** și **clasele abstracte**

---

## Misiune: Gestionarea Flotei de Navete

Hangarul de andocare al stației gestionează o flotă mixtă de vehicule pentru misiuni la suprafață. Fiecare tip de vehicul consumă combustibil cu o rată diferită. Construiește un sistem Vehicul abstract, astfel încât flota să poată fi gestionată polimorfic.

Creează o clasă **abstractă** **`Vehicul`** cu:

- Câmpuri: `nume` (String), `nivelCombustibil` (int, începe de la 100)
- Constructorul primește numele
- **`abstract String tip()`** — fiecare subclasă returnează tipul ei
- **`void condu(int km)`** — reduce combustibilul cu `km * costCombustibil()`. Dacă nu este destul combustibil, afișează `"Combustibil insuficient!"`
- **`abstract int costCombustibil()`** — combustibilul folosit pe km (diferit pentru fiecare vehicul)
- **`toString()`** — returnează `"nume (tip) - Combustibil: X%"`

Creează trei subclase:

- **Masina** — costCombustibil = 2, tip = `"Masina"`
- **Camion** — costCombustibil = 5, tip = `"Camion"`
- **Motocicleta** — costCombustibil = 1, tip = `"Motocicleta"`

Tabloul flotei și apelurile către condu din main sunt deja pregătite în dreapta. Volvo: 100 - 15*5 = 25, apoi încearcă 20*5 = 100 > 25, deci afișează "Combustibil insuficient!"

**Output**

```text
Combustibil insuficient!
BMW (Masina) - Combustibil: 70%
Volvo (Camion) - Combustibil: 25%
Harley (Motocicleta) - Combustibil: 85%
```
