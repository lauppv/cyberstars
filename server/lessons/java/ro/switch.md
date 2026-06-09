Cunoști lanțurile de if-else. Funcționează grozav pentru 2-3 opțiuni. Dar când ai **multe** opțiuni — cum ar fi verificarea zilei din săptămână, sau ce armă a ales Tommy — codul devine urât rapid. Aici intră în scenă **switch**

```java
public class Main {
    public static void main(String[] args) {
        String arma = "shotgun";

        switch (arma) {
            case "pistol":
                System.out.println("De bază dar de încredere");
                break;
            case "shotgun":
                System.out.println("Devastator la distanță apropiată");
                break;
            case "rocket":
                System.out.println("Exagerare totală");
                break;
            default:
                System.out.println("Armă necunoscută");
                break;
        }
    }
}
```

Output

```text
Devastator la distanță apropiată
```

**switch** verifică valoarea lui `arma` și sare la **case**-ul care se potrivește. Când găsește `"shotgun"`, rulează acel bloc, apoi **break** îi spune să se oprească și să iasă din switch

---

**break** este crucial. Fără el, Java "cade prin" (fall-through) la următorul case și continuă să ruleze

```java
public class Main {
    public static void main(String[] args) {
        int stele = 3;

        switch (stele) {
            case 1:
                System.out.println("Poliția te observă");
            case 2:
                System.out.println("Poliția te urmărește");
            case 3:
                System.out.println("Apare elicopterul");
            case 4:
                System.out.println("Sosește SWAT");
            case 5:
                System.out.println("Intră tancurile armatei");
        }
    }
}
```

Output

```text
Apare elicopterul
Sosește SWAT
Intră tancurile armatei
```

Uau — voiam doar mesajul de 3 stele, dar a afișat 3, 4 ȘI 5! Asta pentru că fără **break**, Java cade prin fiecare case de sub potrivire. Uneori asta e util intenționat, dar de obicei e un bug. **Adaugă întotdeauna break** dacă nu vrei în mod special fall-through

---

Versiunea corectă cu break

```java
public class Main {
    public static void main(String[] args) {
        int stele = 3;

        switch (stele) {
            case 3:
                System.out.println("Apare elicopterul");
                break;
            case 4:
                System.out.println("Sosește SWAT");
                break;
            case 5:
                System.out.println("Intră tancurile armatei");
                break;
        }
    }
}
```

Output

```text
Apare elicopterul
```

---

**default** este ca `else`-ul dintr-un lanț de if-else — se ocupă de orice nu se potrivește cu niciun case

```java
public class Main {
    public static void main(String[] args) {
        String vehicul = "boat";

        switch (vehicul) {
            case "car":
                System.out.println("Condu pe drumuri");
                break;
            case "bike":
                System.out.println("Strecoară-te prin trafic");
                break;
            default:
                System.out.println("Alt vehicul: " + vehicul);
                break;
        }
    }
}
```

Output

```text
Alt vehicul: boat
```

---

Python nu a avut switch până de curând (match/case în 3.10+). În Java, switch există dintotdeauna și funcționează cu tipurile **int**, **String**, **char** și **enum**. Iată o comparație

```python
# lanț if-else în Python
zi = "Luni"
if zi == "Sâmbătă" or zi == "Duminică":
    print("Weekend")
else:
    print("Zi lucrătoare")
```

```java
public class Main {
    public static void main(String[] args) {
        // switch în Java
        String zi = "Luni";
        switch (zi) {
            case "Sâmbătă":
            case "Duminică":
                System.out.println("Weekend");
                break;
            default:
                System.out.println("Zi lucrătoare");
                break;
        }
    }
}
```

Observă cum am stivuit `case "Saturday":` și `case "Sunday":` împreună fără cod între ele — acela este **fall-through intenționat**. Ambele case-uri rulează același cod. Aceasta este singura dată când fall-through chiar e la îndemână

---

Switch cu **int** este de asemenea foarte des întâlnit

```java
public class Main {
    public static void main(String[] args) {
        int optiuneMeniu = 2;

        switch (optiuneMeniu) {
            case 1:
                System.out.println("Începe joc nou");
                break;
            case 2:
                System.out.println("Încarcă jocul salvat");
                break;
            case 3:
                System.out.println("Setări");
                break;
            default:
                System.out.println("Alegere invalidă");
                break;
        }
    }
}
```

Output

```text
Încarcă jocul salvat
```

---

## Misiune: Clasificatorul Programului de Tură

Programul de tură al stației are nevoie de un clasificator rapid: dată fiind o zi, afișează dacă este o tură de **zi lucrătoare** (Weekday) sau de **weekend** (Weekend).

Scrie corpul metodei `tipZi` folosind un **switch** pe `zi`:

1. Pentru `"Luni"` până la `"Vineri"` → afișează `Zi lucrătoare`
2. Pentru `"Sâmbătă"` și `"Duminică"` → afișează `Weekend`
3. Default → afișează `Zi necunoscută`

Metoda `main` apelează deja `tipZi` de trei ori.

**Exemplu**

Cu apelurile `tipZi("Luni")`, `tipZi("Sâmbătă")`, `tipZi("Miercuri")`, programul tău ar trebui să afișeze

```text
Zi lucrătoare
Weekend
Zi lucrătoare
```
