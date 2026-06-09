Cunoști lanțurile de if-else. Funcționează grozav pentru 2-3 opțiuni. Dar când ai **multe** opțiuni — cum ar fi verificarea zilei din săptămână, sau ce armă a ales Tommy — codul devine urât rapid. Aici intră în scenă **switch**

```java
public class Main {
    public static void main(String[] args) {
        String arma = "shotgun";

        switch (arma) {
            case "pistol":
                System.out.println("Basic but reliable");
                break;
            case "shotgun":
                System.out.println("Devastating up close");
                break;
            case "rocket":
                System.out.println("Total overkill");
                break;
            default:
                System.out.println("Unknown weapon");
                break;
        }
    }
}
```

Output

```text
Devastating up close
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
                System.out.println("Cops notice you");
            case 2:
                System.out.println("Cops chase you");
            case 3:
                System.out.println("Helicopter shows up");
            case 4:
                System.out.println("SWAT arrives");
            case 5:
                System.out.println("Army tanks roll in");
        }
    }
}
```

Output

```text
Helicopter shows up
SWAT arrives
Army tanks roll in
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
                System.out.println("Helicopter shows up");
                break;
            case 4:
                System.out.println("SWAT arrives");
                break;
            case 5:
                System.out.println("Army tanks roll in");
                break;
        }
    }
}
```

Output

```text
Helicopter shows up
```

---

**default** este ca `else`-ul dintr-un lanț de if-else — se ocupă de orice nu se potrivește cu niciun case

```java
public class Main {
    public static void main(String[] args) {
        String vehicul = "boat";

        switch (vehicul) {
            case "car":
                System.out.println("Drive on roads");
                break;
            case "bike":
                System.out.println("Weave through traffic");
                break;
            default:
                System.out.println("Some other vehicle: " + vehicul);
                break;
        }
    }
}
```

Output

```text
Some other vehicle: boat
```

---

Python nu a avut switch până de curând (match/case în 3.10+). În Java, switch există dintotdeauna și funcționează cu tipurile **int**, **String**, **char** și **enum**. Iată o comparație

```python
# lanț if-else în Python
zi = "Monday"
if zi == "Saturday" or zi == "Sunday":
    print("Weekend")
else:
    print("Weekday")
```

```java
public class Main {
    public static void main(String[] args) {
        // switch în Java
        String zi = "Monday";
        switch (zi) {
            case "Saturday":
            case "Sunday":
                System.out.println("Weekend");
                break;
            default:
                System.out.println("Weekday");
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
                System.out.println("Start new game");
                break;
            case 2:
                System.out.println("Load saved game");
                break;
            case 3:
                System.out.println("Settings");
                break;
            default:
                System.out.println("Invalid choice");
                break;
        }
    }
}
```

Output

```text
Load saved game
```

---

## Misiune: Clasificatorul Programului de Tură

Programul de tură al stației are nevoie de un clasificator rapid: dată fiind o zi, afișează dacă este o tură de **zi lucrătoare** (Weekday) sau de **weekend** (Weekend).

Scrie corpul metodei `dayType` folosind un **switch** pe `day`:

1. Pentru `"Monday"` până la `"Friday"` → afișează `Weekday`
2. Pentru `"Saturday"` și `"Sunday"` → afișează `Weekend`
3. Default → afișează `Unknown day`

Metoda `main` apelează deja `dayType` de trei ori.

**Exemplu**

Cu apelurile `dayType("Monday")`, `dayType("Saturday")`, `dayType("Wednesday")`, programul tău ar trebui să afișeze

```text
Weekday
Weekend
Weekday
```
