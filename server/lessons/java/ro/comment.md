**Comentariile** sunt bucăți de text din codul nostru pe care Java le **ignoră**. Le folosim ca să **explicăm** ce face codul, sau ca să **dezactivăm** părți din cod fără a le șterge

În Java, un comentariu pe o singură linie începe cu **//**

```java
public class Main {
    public static void main(String[] args) {
        // acesta este un comentariu
        int a = 1 + 2 + 3;
        System.out.println(a); // afiseaza variabila a
    }
}
```

Liniile de după **//** sunt complet ignorate de Java. Programul rulează ca și cum nu ar fi acolo

---

Comentariile sunt grozave și pentru **dezactivarea** temporară a codului

```java
public class Main {
    public static void main(String[] args) {
        int a = 1 + 2 + 3;
        // System.out.println(a);
    }
}
```

Acum programul nu afișează nimic, pentru că am **comentat** **println**-ul. Foarte util când depanezi — în loc să ștergi codul și să-l rescrii mai târziu, doar îl comentăm

---

Pentru comentarii mai lungi care se întind pe mai multe linii, Java suportă și **/\* ... \*/**

```text
/*
Acesta este un
comentariu pe
mai multe linii
*/
```

Totuși, în practică, majoritatea codului Java folosește **//** chiar și pentru câteva linii la rând

```text
// asa o sa ne scriem
// comentariile
// ca sa dam indicii
// si sa explicam lucruri
```

---

Mai există un tip special, **/\*\* ... \*/**, folosit pentru a documenta clase și metode. Îl vom întâlni mai târziu în călătoria ta prin Java. Deocamdată, **//** e tot ce-ți trebuie

---

## Misiune: Marfă Clasificată

Manifestul navei este afișat pe ecranul principal, dar o linie conține **marfă clasificată** care trebuie să rămână ascunsă de echipaj.

Comentează **o singură linie** astfel încât să fie afișate doar numele navei, numele misiunii și puterea maximă. Nu șterge nimic — doar folosește `//` ca să ascunzi secretul.

**Intrare** (deja setat la începutul codului tău — schimbă valorile ca să testezi):

- `numeNava` — numele navei
- `numeMisiune` — misiunea curentă
- `incarcaturaSecreta` — obiect clasificat (acesta NU trebuie să apară în output)
- `putereMax` — nivelul de putere al motorului

**Exemplu**

Cu valorile implicite, programul tău ar trebui să afișeze

```text
Voyager
Deep Space Exploration
9001
```
