Bun venit la **Java**. Java este unul dintre cele mai folosite limbaje din lume, mai ales în companii mari, bănci și aplicații Android. Are reputația de a fi puțin mai **strict** decât Python, dar nu-ți face griji, ne obișnuim cu el împreună :)

Primul lucru pe care vrem să-l învățăm este cum să afișăm ceva pe ecran. În Python scriam pur și simplu **print("hello")**. În Java, lucrurile sunt puțin mai ceremonioase

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("salut, îmi place pizza");
    }
}
```

**Rulează** codul. Ar trebui să vezi

```text
salut, îmi place pizza
```

Ce este tot acel boilerplate din jurul lui **System.out.println**? Nu intra în panică. Deocamdată, nu trebuie să-l înțelegem complet. Reține doar că **orice program Java** are nevoie de această structură ca să funcționeze. Gândește-te la ea ca la **rama unui tablou** — este mereu acolo, codul propriu-zis merge **înăuntru**

Linia care face treaba este

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("salut, îmi place pizza");
    }
}
```

**System.out.println** este felul în care Java spune **print**. **ln** de la final înseamnă **line** (linie), deci afișează și trece pe o linie nouă, exact ca **print()** în Python

Trei lucruri de observat

- Textul merge **între ghilimele duble** **""**, exact ca în Python
- Fiecare instrucțiune se termină cu un **punct și virgulă** **;**. Uită-l și Java va refuza să ruleze
- Acoladele **{ }** definesc **blocuri** de cod. Acolo unde Python folosește indentarea, Java folosește **{ }**

Încearcă să elimini **;** și rulează codul. Citește eroarea :)

---

Putem face și

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Salut");
        System.out.println("Lume");
        System.out.println("Am 2 câini");
    }
}
```

Trei linii, trei mesaje. Fiecare se termină cu **;**

Există și **System.out.print** fără **ln**. Diferența: **NU** trece pe o linie nouă după ce afișează

```java
public class Main {
    public static void main(String[] args) {
        System.out.print("Salut");
        System.out.print("Lume");
    }
}
```

Output

```text
SalutLume
```

Observă că **Salut** și **Lume** sunt lipite. Rulează-l. De cele mai multe ori vei vrea **println**, dar e bine să știi că ambele există

---

## Misiune: Prima Transmisie

Antena de comunicații a stației tocmai a pornit. Trimite primul tău mesaj ca să confirmi că legătura este activă.

Scrie un singur `System.out.println` în interiorul lui `main` care afișează salutul de mai jos.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Salut, CyberStars!
```
