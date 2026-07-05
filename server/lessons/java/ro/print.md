Bun venit la **Java**. Java este unul dintre cele mai folosite limbaje din lume, mai ales în companii mari, bănci și aplicații Android. Are reputația de a fi un limbaj **strict** și organizat, dar nu-ți face griji, ne obișnuim cu el împreună

Primul lucru pe care vrem să-l învățăm este cum să afișăm ceva pe ecran

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("salut, imi place pizza");
    }
}
```

**Rulează** codul. Ar trebui să vezi

```text
salut, imi place pizza
```

Ce este tot acel boilerplate din jurul lui **System.out.println**? Nu intra în panică. Deocamdată, nu trebuie să-l înțelegem complet. Reține doar că **orice program Java** are nevoie de această structură ca să funcționeze. Gândește-te la ea ca la **rama unui tablou** — este mereu acolo, codul propriu-zis merge **înăuntru**

Linia care face treaba este

```text
System.out.println("salut, imi place pizza");
```

**System.out.println** este felul în care Java afișează text pe ecran. **ln** de la final înseamnă **line** (linie), deci afișează și apoi trece pe o linie nouă

Trei lucruri de observat

- Textul merge **între ghilimele duble** **""**
- Fiecare instrucțiune se termină cu un **punct și virgulă** **;**. Uită-l și Java va refuza să ruleze
- Acoladele **{ }** definesc **blocuri** de cod — ele grupează liniile care merg împreună

Încearcă să elimini **;** și rulează codul. Citește eroarea — așa înveți să recunoști mesajele compilatorului

---

Putem afișa și mai multe linii, una după alta

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Salut");
        System.out.println("Lume");
        System.out.println("Am 2 caini");
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

Ieșire

```text
SalutLume
```

Observă că **Salut** și **Lume** sunt lipite, pentru că **print** nu adaugă o linie nouă între ele. De cele mai multe ori vei vrea **println**, dar e bine să știi că ambele există

---

## Misiune: Prima Transmisie

Antena de comunicații a stației tocmai a pornit. Trimite primul tău raport de legătură ca să confirmi că semnalul este activ.

Scrie patru instrucțiuni `System.out.println` în interiorul lui `main` care afișează **exact** aceste patru linii:

```text
Statia Cyberstars
Antena: activa
Semnal: stabil
Salut de pe orbita, cadet!
```

Potrivește textul exact, linie cu linie. Nu uita **ghilimelele** și **;** de la final.
