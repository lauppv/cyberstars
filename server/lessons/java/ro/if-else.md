În viața reală ne confruntăm adesea cu decizii: **dacă** e frig, iei un pulover, **altfel** un tricou este de ajuns. **Dacă** mi-e somn, mă culc, **altfel** programez :)

În cod, spunem

```java
public class Main {
    public static void main(String[] args) {
        int varsta = 18;
        if (varsta < 18) {
            System.out.println("Acces refuzat pentru că nu ai 18 ani");
        } else {
            System.out.println("Bun venit în club");
        }
    }
}
```

Trei lucruri de observat în Java

- Condiția stă între **paranteze** **( )**
- Blocul de cod stă între **acolade** **{ }**
- Nu avem nevoie de **:** ca în Python

Dacă **varsta** este mai mică de **18**, intrăm în blocul **if**. **Altfel**, intrăm în blocul **else**. Rulează codul, schimbă vârsta, vezi ce se întâmplă

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
        if (x = 4) {       // EROARE
            System.out.println("Boo");
        }
    }
}
```

Aceasta nu va compila. Java nici măcar nu te lasă să faci această greșeală (spre deosebire de alte limbaje). Versiunea corectă este

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
            System.out.println(nume + " joacă GTA Vice City");
        } else {
            System.out.println(nume + " este offline");
        }
    }
}
```

Schimbă **utilizatorOnline** la **false** și rulează din nou. Citește noul rezultat. Programarea devine distractivă din momentul în care începi să **te joci** cu valorile :)

---

## Misiune: Alertă Temperatură Carenă

Senzorul de carenă al stației raportează temperatura de afară. Scrie un **if / else** care o verifică:

- dacă `temperatura` este **mai mică de 0** → afișează `afară e ger`
- altfel → afișează `apa nu îngheață`

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `temperatura` — temperatura carenei în grade Celsius (int)

**Exemplu**

Cu `temperatura = -5`, programul tău ar trebui să afișeze

```text
afară e ger
```
