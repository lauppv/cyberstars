Combină **if/else**, **if/else if** și **switch**

---

## Misiune: Centrul de Dispecerat al Poliției

Tommy a stârnit haos în Vice City și poliția îi monitorizează nivelul de urmărire. Centrul de dispecerat are nevoie de un sistem care, pornind de la numărul de stele de urmărire, raportează **ce forță răspunde** și **cât de gravă e situația**.

Stochează numărul de stele într-o variabilă întreagă. Apoi:

Folosește un **switch** pe numărul de stele ca să afișezi forța care răspunde:

- **0** → `Esti curat, nicio urmarire`
- **1** → `O masina de politie te observa`
- **2** → `Mai multe masini te urmaresc`
- **3** → `Apare un elicopter`
- **4** → `Sosesc fortele speciale`
- **5** → `Intervine FBI-ul`
- **6** → `Armata trimite tancuri`
- orice altă valoare → `Nivel de urmarire invalid`

Apoi, pe a doua linie, folosește un lanț **if / else if** ca să afișezi evaluarea pericolului:

- **5 sau mai multe** stele → `Situatie critica, fugi imediat`
- **3 sau 4** stele → `Pericol ridicat, scapa repede`
- **1 sau 2** stele → `Sub control, pierde-i prin oras`
- altfel → `Totul e linistit`

Atenție la granițe: la **5** stele situația devine critică, la **3** trece de la „sub control" la „pericol ridicat".

**Exemplu** pentru **3** stele:

```text
Apare un elicopter
Pericol ridicat, scapa repede
```

**Exemplu** pentru **6** stele:

```text
Armata trimite tancuri
Situatie critica, fugi imediat
```

**Exemplu** pentru **-1** stele (valoare invalidă):

```text
Nivel de urmarire invalid
Totul e linistit
```
