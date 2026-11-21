```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] intrari = { "42", "caseta", "-7", "300" };

        ArrayList<Integer> numere = new ArrayList<>();
        int gresite = 0;
        for (String intrare : intrari) {
            try {
                numere.add(Integer.parseInt(intrare));
            } catch (NumberFormatException e) {
                gresite++;
            }
        }
        int celMaiMic = Integer.MAX_VALUE;
        for (int n : numere) {
            if (n < celMaiMic) {
                celMaiMic = n;
            }
        }
        System.out.println("Numere: " + numere);
        System.out.println("Gresite: " + gresite);
        System.out.println("Cel mai mic: " + (numere.isEmpty() ? "niciunul" : celMaiMic));
    }
}
```
