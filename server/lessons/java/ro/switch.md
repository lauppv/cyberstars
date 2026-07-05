Cunoști lanțurile de if-else. Funcționează grozav pentru 2-3 opțiuni. Dar când ai **multe** opțiuni — cum ar fi ce armă a ales Tommy — codul devine urât rapid. Aici intră în scenă **switch**

```java
public class Main {
    public static void main(String[] args) {
        String arma = "shotgun";

        switch (arma) {
            case "pistol":
                System.out.println("De baza dar de incredere");
                break;
            case "shotgun":
                System.out.println("Devastator la distanta apropiata");
                break;
            case "rocket":
                System.out.println("Exagerare totala");
                break;
            default:
                System.out.println("Arma necunoscuta");
                break;
        }
    }
}
```

Ieșire

```text
Devastator la distanta apropiata
```

**switch** verifică valoarea lui `arma` și sare la **case**-ul care se potrivește. Când găsește `"shotgun"`, rulează acel bloc, apoi **break** îi spune să se oprească și să iasă din switch

---

**break** este crucial. Fără el, Java „cade prin" (fall-through) la următorul case și continuă să ruleze

```java
public class Main {
    public static void main(String[] args) {
        int stele = 3;

        switch (stele) {
            case 1:
                System.out.println("Politia te observa");
            case 2:
                System.out.println("Politia te urmareste");
            case 3:
                System.out.println("Apare elicopterul");
            case 4:
                System.out.println("Sosesc fortele speciale");
            case 5:
                System.out.println("Intra tancurile armatei");
        }
    }
}
```

Ieșire

```text
Apare elicopterul
Sosesc fortele speciale
Intra tancurile armatei
```

Uau — voiam doar mesajul de 3 stele, dar a afișat 3, 4 și 5! Asta pentru că fără **break**, Java cade prin fiecare case de sub potrivire. Uneori asta e util intenționat, dar de obicei e un bug. **Adaugă întotdeauna break** dacă nu vrei în mod special fall-through

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
                System.out.println("Sosesc fortele speciale");
                break;
            case 5:
                System.out.println("Intra tancurile armatei");
                break;
        }
    }
}
```

Ieșire

```text
Apare elicopterul
```

---

**default** este ca `else`-ul dintr-un lanț de if-else — se ocupă de orice nu se potrivește cu niciun case

```java
public class Main {
    public static void main(String[] args) {
        String vehicul = "barca";

        switch (vehicul) {
            case "masina":
                System.out.println("Condu pe drumuri");
                break;
            case "bicicleta":
                System.out.println("Strecoara-te prin trafic");
                break;
            default:
                System.out.println("Alt vehicul: " + vehicul);
                break;
        }
    }
}
```

Ieșire

```text
Alt vehicul: barca
```

---

**switch** funcționează cu **int**, **String**, **char** și **enum**. Uneori vrem ca **mai multe case-uri** să ruleze același cod — atunci le stivuim unul peste altul, fără cod între ele

```java
public class Main {
    public static void main(String[] args) {
        String zi = "Luni";
        switch (zi) {
            case "Sambata":
            case "Duminica":
                System.out.println("Weekend");
                break;
            default:
                System.out.println("Zi lucratoare");
                break;
        }
    }
}
```

Observă cum am stivuit `case "Sambata":` și `case "Duminica":` împreună, fără cod între ele — acela este **fall-through intenționat**. Ambele case-uri rulează același cod. Aceasta este singura dată când fall-through chiar e la îndemână

---

Switch cu **int** este de asemenea foarte des întâlnit

```java
public class Main {
    public static void main(String[] args) {
        int optiuneMeniu = 2;

        switch (optiuneMeniu) {
            case 1:
                System.out.println("Incepe joc nou");
                break;
            case 2:
                System.out.println("Incarca jocul salvat");
                break;
            case 3:
                System.out.println("Setari");
                break;
            default:
                System.out.println("Alegere invalida");
                break;
        }
    }
}
```

Ieșire

```text
Incarca jocul salvat
```

---

## Misiune: Clasificatorul Programului de Tură

Programul de tură al stației are nevoie de un clasificator rapid: dată fiind o zi, afișează dacă este o tură de **zi lucrătoare** sau de **weekend**.

Reține ziua într-o variabilă `String` și scrie un **switch** care:

- pentru `"Luni"`, `"Marti"`, `"Miercuri"`, `"Joi"`, `"Vineri"` → afișează `Zi lucratoare`
- pentru `"Sambata"` și `"Duminica"` → afișează `Weekend`
- în orice alt caz → afișează `Zi necunoscuta`

**Exemple**

Pentru `"Luni"`:

```text
Zi lucratoare
```

Pentru `"Sambata"`:

```text
Weekend
```

Pentru `"Craciun"` (nu e o zi a săptămânii):

```text
Zi necunoscuta
```
