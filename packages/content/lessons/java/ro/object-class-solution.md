```java
public class Main {
    public static void main(String[] args) {
        Object[] probe = { "cutit", 3, "poza", 10 };

        int texte = 0;
        int suma = 0;
        for (Object lucru : probe) {
            System.out.println(lucru.getClass().getSimpleName() + ": " + lucru);
            if (lucru instanceof String) {
                texte++;
            } else if (lucru instanceof Integer) {
                suma += (Integer) lucru;
            }
        }
        System.out.println("Texte: " + texte);
        System.out.println("Suma numerelor: " + suma);
    }
}
```
