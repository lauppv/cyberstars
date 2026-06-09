Știi deja cum funcționează buclele. Acum hai să punem o **buclă în interiorul unei bucle** — o **buclă imbricată**. Sună intens, dar conceptul este simplu: **bucla exterioară** rulează, iar pentru **fiecare iterație** a buclei exterioare, **bucla interioară** rulează **complet**

Gândește-te la asta ca la Sonny Forelli trimițându-l pe Tommy în misiuni. Sonny are o listă de 3 cartiere. Pentru **fiecare** cartier, Tommy trebuie să viziteze **5 clădiri**. Asta înseamnă 3 x 5 = 15 vizite în total. Buclă imbricată

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.println("i=" + i + " j=" + j);
            }
        }
    }
}
```

Output

```text
i=1 j=1
i=1 j=2
i=1 j=3
i=2 j=1
i=2 j=2
i=2 j=3
i=3 j=1
i=3 j=2
i=3 j=3
```

Vezi tiparul? Când **i=1**, bucla interioară rulează j de la 1 la 3. Apoi i devine 2, și j rulează din nou de la 1 la 3. Și așa mai departe. Bucla interioară **se resetează de fiecare dată** când bucla exterioară avansează

---

Buclele imbricate sunt perfecte pentru **grile** și **tipare**. Hai să afișăm o grilă 4x4 de steluțe

```java
public class Main {
    public static void main(String[] args) {
        for (int rand = 0; rand < 4; rand++) {
            for (int coloana = 0; coloana < 4; coloana++) {
                System.out.print("* ");
            }
            System.out.println();  // linie nouă după fiecare rând
        }
    }
}
```

Output

```text
* * * *
* * * *
* * * *
* * * *
```

Observă că am folosit **System.out.print** (fără „ln") în interiorul buclei interioare — asta afișează fără să sară pe o linie nouă. Apoi **System.out.println()** la finalul fiecărui rând începe o linie nouă

---

Aici devine distractiv. Putem face bucla interioară să depindă de variabila buclei exterioare. Hai să afișăm un triunghi

```java
public class Main {
    public static void main(String[] args) {
        for (int rand = 1; rand <= 4; rand++) {
            for (int coloana = 0; coloana < rand; coloana++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
```

Output

```text
*
**
***
****
```

Trucul: când **rand=1**, bucla interioară rulează **o dată**. Când **rand=2**, rulează **de 2 ori**. Când **rand=3**, **de 3 ori**. Limita buclei interioare este **rand**, nu un număr fix

---

Putem folosi bucle imbricate și ca să construim o tablă de înmulțire. Cortez ar aprecia organizarea

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.print(i * j + "\t");
            }
            System.out.println();
        }
    }
}
```

Output

```text
1	2	3
2	4	6
3	6	9
```

**\t** este un caracter tab — distanțează lucrurile frumos într-o grilă

---

În Python, ai fi scris poate ceva de genul

```python
for i in range(5):
    for j in range(i + 1):
        print("*", end="")
    print()
```

Versiunea Java este aproape identică ca logică, doar cu sintaxă diferită. **end=""** din Python este ca folosirea lui **System.out.print** în loc de **println** în Java

---

## Misiune: Grila de Scut

Generatorul de scut al stației își construiește grila de energie rând cu rând. Rândul 1 are **1** celulă de energie, rândul 2 are **2**, și așa mai departe până la `randuri` celule în ultimul rând. Fiecare celulă este afișată ca un caracter `*` fără spații între ele.

Scrie un program care folosește o **buclă imbricată** ca să afișeze un triunghi dreptunghic de steluțe cu `randuri` rânduri. Bucla exterioară controlează pe ce rând ești; bucla interioară afișează numărul corect de steluțe pentru acel rând.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `randuri` — câte rânduri are grila de scut

**Exemplu**

Cu `randuri = 5`, programul tău ar trebui să afișeze

```text
*
**
***
****
*****
```
