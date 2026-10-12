```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        String[] achizitii = {"Pistol", "Pusca", "Pistol", "Automat", "Pusca", "Pistol", "Automat"};

        HashMap<String, Integer> contor = new HashMap<>();
        for (String arma : achizitii) {
            if (contor.containsKey(arma)) {
                contor.put(arma, contor.get(arma) + 1);
            } else {
                contor.put(arma, 1);
            }
        }

        for (String arma : contor.keySet()) {
            System.out.println(arma + ": " + contor.get(arma));
        }

        String celMaiBun = "";
        int maxContor = 0;
        for (String arma : contor.keySet()) {
            if (contor.get(arma) > maxContor) {
                maxContor = contor.get(arma);
                celMaiBun = arma;
            }
        }
        System.out.println("Cel mai cumparat: " + celMaiBun);

        ArrayList<String> populare = new ArrayList<>();
        for (String arma : contor.keySet()) {
            if (contor.get(arma) > 1) {
                populare.add(arma);
            }
        }
        Collections.sort(populare);
        System.out.println("Populare (sortat): " + populare);
    }
}
```
