Până acum, am scris toate valorile direct în programele noastre (hardcoded). E timpul să lăsăm **utilizatorul** să tasteze ceva. În Java, citim input-ul printr-un instrument numit **Scanner**

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Cum te cheama? ");
        String nume = scanner.nextLine();

        System.out.println("Salut, " + nume + "!");
    }
}
```

**Rulează** codul, tastează ceva, apasă **Enter**

Au apărut două lucruri noi

- **import java.util.Scanner;** la început, **înainte** de **public class**. Asta îi spune lui Java: "Vreau să folosesc instrumentul Scanner din biblioteca standard a lui Java"
- **Scanner scanner = new Scanner(System.in);** creează un nou scanner care citește de la **standard input** (tastatura)

Citirea propriu-zisă se întâmplă cu **scanner.nextLine()** — așteaptă ca utilizatorul să tasteze o linie și să apese **Enter**, apoi returnează textul tastat ca un **String**

---

Pentru numere, **Scanner** are metode diferite

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Varsta ta: ");
        int varsta = scanner.nextInt();

        System.out.println("Anul viitor vei avea " + (varsta + 1));
    }
}
```

**scanner.nextInt()** citește un număr întreg direct și ni-l dă gata ca **int**, fără să mai convertim noi nimic

Pentru numere zecimale, există **scanner.nextDouble()**

```java
public class Main {
    public static void main(String[] args) {
        double inaltime = scanner.nextDouble();
    }
}
```

---

O mică **capcană** care îi prinde pe toți. Dacă amesteci **nextInt()** și **nextLine()**, lucrurile devin ciudate

```java
public class Main {
    public static void main(String[] args) {
        int varsta = scanner.nextInt();
        String nume = scanner.nextLine();   // asta pare goala!
    }
}
```

**De ce?** Pentru că **nextInt()** citește numărul dar lasă în urmă **caracterul de linie nouă (newline)**. Apoi **nextLine()** preia acel newline gol și returnează imediat un șir gol

Soluția: adaugă un **scanner.nextLine()** suplimentar ca să "mănânce" newline-ul rămas

```java
public class Main {
    public static void main(String[] args) {
        int varsta = scanner.nextInt();
        scanner.nextLine();   // consuma newline-ul ramas
        String nume = scanner.nextLine();
    }
}
```

Enervant, dar trebuie să-l ții minte o singură dată

Ca să păstrăm lucrurile simple în acest exercițiu, vom **citi mai întâi numele**, apoi vârsta

---

## Misiune: Înregistrarea Echipajului

Fiecare membru al echipajului care ajunge la stație trebuie să se înregistreze la terminal. Sistemul îi citește numele și vârsta, apoi afișează o linie de bun venit.

Creează un **Scanner**, citește mai întâi numele (prima linie), apoi vârsta (a doua linie). Apoi construiește și afișează mesajul de bun venit folosind **+**.

Citește datele direct — nu afișa nicio întrebare înainte de citire. Terminalul de înregistrare rămâne tăcut până la linia de bun venit.

**Intrare** (tastată de utilizator când rulează programul):

- Prima linie — numele membrului echipajului
- A doua linie — vârsta membrului echipajului

**Exemplu**

Dacă utilizatorul tastează

```text
Cortez
60
```

programul tău ar trebui să afișeze

```text
Salut Cortez, ai 60 de ani. Anul viitor vei avea 61
```
