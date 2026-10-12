În viața reală ne confruntăm adesea cu decizii: **dacă** e frig, ne punem o bluză groasă, **altfel** un tricou e de ajuns

În cod, spunem

```java
public class Main {
    public static void main(String[] args) {
        int temperatura = 10;
        if (temperatura < 15) {
            System.out.println("pune-ti o bluza");
        } else {
            System.out.println("un tricou e de ajuns");
        }
    }
}
```

Două lucruri de observat în Java

- Condiția stă între **paranteze** **( )**
- Blocul de cod stă între **acolade** **{ }**

Dacă **temperatura** este mai mică de **15**, intrăm în blocul **if** (e frig, ne îmbrăcăm gros). **Altfel**, intrăm în blocul **else**. Rulează codul, schimbă temperatura, vezi ce se întâmplă

---

Operatorii de comparație sunt exact cei la care te aștepți

- **<** mai mic decât
- **<=** mai mic sau egal
- **>** mai mare decât
- **>=** mai mare sau egal
- **==** egal (atenție la cele două semne egal)
- **!=** **diferit** de

**Fii atent** la diferența dintre **=** și **==**. **=** atribuie o valoare, **==** compară

```java
public class Main {
    public static void main(String[] args) {
        int x = 4;
        if (x = 4) {       // eroare
            System.out.println("Boo");
        }
    }
}
```

Aceasta nu va compila. Java nici măcar nu te lasă să faci această greșeală. Versiunea corectă este

```java
public class Main {
    public static void main(String[] args) {
        int x = 4;
        if (x == 4) {
            System.out.println("Boo");
        }
    }
}
```

---

Nu avem mereu nevoie de un **else**. Uneori vrem doar să facem ceva **dacă** o condiție este adevărată, iar altfel să nu facem nimic

```java
public class Main {
    public static void main(String[] args) {
        boolean utilizatorOnline = true;
        if (utilizatorOnline) {
            System.out.println("Bine ai revenit");
        }
    }
}
```

Observă că am scris **if (utilizatorOnline)** fără **== true**. Ambele funcționează, dar forma scurtă este cea pe care programatorii Java o scriu de obicei

---

Un exemplu complet

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        boolean utilizatorOnline = true;

        if (utilizatorOnline) {
            System.out.println(nume + " joaca GTA Vice City");
        } else {
            System.out.println(nume + " este offline");
        }
    }
}
```

Schimbă **utilizatorOnline** la **false** și rulează din nou. Citește noul rezultat. Programarea devine distractivă din momentul în care începi să **te joci** cu valorile

---

## Misiune: Alertă Temperatură Carenă

Senzorul de carenă al stației raportează temperatura de afară.

Creează o variabilă `int` numită `temperatura` (cu orice valoare vrei). Apoi scrie un **if / else** care o verifică:

- dacă temperatura este **mai mică de 0** → afișează `afara e ger`
- altfel → afișează `apa nu ingheata`

**Exemplu**

Cu o temperatură de `-5`, programul tău ar trebui să afișeze

```text
afara e ger
```
