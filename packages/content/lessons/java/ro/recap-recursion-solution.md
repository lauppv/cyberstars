```java
public class Main {
    static int sparge(String inceput, int cifreRamase, int sumaRamasa) {
        if (cifreRamase == 0) {
            if (sumaRamasa == 0) {
                System.out.println(inceput);
                return 1;
            }
            return 0;
        }
        int gasite = 0;
        for (int c = 0; c <= 9 && c <= sumaRamasa; c++) {
            gasite += sparge(inceput + c, cifreRamase - 1, sumaRamasa - c);
        }
        return gasite;
    }

    public static void main(String[] args) {
        int lungime = 2;
        int tinta = 3;

        int gasite = sparge("", lungime, tinta);
        System.out.println("Gasite: " + gasite);
    }
}
```
