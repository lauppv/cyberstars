În Python aveam **f-string-uri**, acel truc drăguț **f"Hello, {name}"**. Java **nu** are f-string-uri (ei bine, versiunile recente au, dar într-o formă diferită). Modul clasic în Java de a combina text și variabile este cu operatorul **+**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Quincy";
        int varsta = 32;
        double inaltime = 1.97;

        System.out.println("Salut. Mă numesc " + nume + ", am " + varsta + " ani și înălțimea de " + inaltime + " m");
    }
}
```

Output

```text
Salut. Mă numesc Quincy, am 32 ani și înălțimea de 1.97 m
```

Ce se întâmplă aici? Când punem un **String** și o altă valoare împreună cu **+**, Java **convertește totul în text** și le lipește. Asta se numește **concatenare de string-uri** (string concatenation)

Fii atent la spații

```text
"Salut. Mă numesc " + nume
```

Avem un spațiu **înainte de ghilimeaua de închidere**, altfel am obține **Salut. Mă numescQuincy** totul lipit. Asta e ceva ce aproape toată lumea greșește la început. **Verifică-ți mereu spațiile**

---

O subtilitate mică, dar foarte importantă

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Rezultat: " + 2 + 3);
    }
}
```

Ce crezi că afișează asta? **Rezultat: 5**?

Afișează **Rezultat: 23**

De ce? Java citește de la **stânga la dreapta**. Începe cu **"Rezultat: "** (un String), apoi vede **+ 2**: un String + un int = String, deci devine **"Rezultat: 2"**. Apoi **+ 3** → **"Rezultat: 23"**

Dacă vrem **5**, folosim **paranteze** ca să forțăm calculul matematic mai întâi

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Rezultat: " + (2 + 3));
    }
}
```

Output

```text
Rezultat: 5
```

Acum **(2 + 3)** este calculat mai întâi (dând **5**), apoi lipit de string. Ține minte regula asta, o să dai de ea în cod real :)

---

Există și **System.out.printf** pentru o formatare mai sofisticată, dar e puțin mai greu de citit, așa că o să rămânem la **+** deocamdată. **+** va fi mai mult decât suficient pentru restul acestor lecții

---

## Misiune: Bariera de Vârstă a Ecluzei

Ecluza stației are o restricție de vârstă minimă. Tocmai a încercat să intre o recrută tânără. Folosește concatenarea de string-uri ca să afișezi mesajul de respingere.

Variabilele `numeUtilizator`, `varstaUtilizator` și `varstaNecesara` sunt deja setate în dreapta. Folosește **+** ca să construiești și să afișezi mesajul.

**Input** (deja setat la începutul codului tău — schimbă valorile ca să testezi):

- `numeUtilizator` — numele recrutei (String)
- `varstaUtilizator` — vârsta recrutei (int)
- `varstaNecesara` — vârsta minimă pentru a intra (int)

**Exemplu**

Cu `numeUtilizator = "Quincy"`, `varstaUtilizator = 16` și `varstaNecesara = 18`, programul tău ar trebui să afișeze

```text
Salut, Quincy! Îmi pare rău, dar vârsta minimă este 18. Tu ai 16 ani
```
