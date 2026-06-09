Combină **clase/obiecte**, **constructori**, **metode în interiorul claselor** și **clasa Math**

---

## Misiune: Compartimentul de Animale al Stației

Echipajul a adoptat câteva animale pentru moral. Compartimentul de animale al stației are nevoie de un sistem de urmărire care să monitorizeze fericirea fiecărui animal după sesiunile de joacă și de hrănire.

Creează o clasă **`AnimalCompanie`** cu:

- Câmpuri: `nume` (String), `specie` (String), `varsta` (int), `fericire` (int, începe de la 50)
- **Constructor** care primește nume, specie și vârstă
- Metoda **`joaca()`** — crește fericirea cu 15, dar se plafonează la 100 (folosește `Math.min`)
- Metoda **`hraneste()`** — crește fericirea cu 10, dar se plafonează la 100
- Metoda **`status()`** — returnează un String: `"Nume (Specie, Y ani) - Fericire: X"`

Secvența de interacțiuni din main este deja pregătită în dreapta. Completează clasa `AnimalCompanie` astfel încât Rex, Whiskers și Nemo să raporteze fericirea corectă după sesiunile lor. Nemo se plafonează la 100 chiar dacă 50 + 4\*15 = 110.

**Output**

```text
Rex (Caine, 3 ani) - Fericire: 90
Whiskers (Pisica, 5 ani) - Fericire: 60
Nemo (Peste, 1 ani) - Fericire: 100
```
