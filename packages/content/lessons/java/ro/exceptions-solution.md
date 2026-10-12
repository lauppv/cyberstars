```java
public class Main {
    public static void main(String[] args) {
        String[] rapoarte = {"7500", "nu stiu", "23000", "eroare"};

        for (String raport : rapoarte) {
            try {
                int suma = Integer.parseInt(raport);
                System.out.println("Plata: " + suma);
            } catch (NumberFormatException e) {
                System.out.println("Raport invalid: " + raport);
            }
        }
    }
}
```
