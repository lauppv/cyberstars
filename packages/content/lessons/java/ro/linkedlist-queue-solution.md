```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        String[] evenimente = {"Infernus", "Cheetah", "urmatoarea", "Stinger", "urmatoarea", "urmatoarea", "urmatoarea"};

        Queue<String> rand = new LinkedList<>();
        for (String eveniment : evenimente) {
            if (eveniment.equals("urmatoarea")) {
                if (rand.isEmpty()) {
                    System.out.println("Nicio masina nu asteapta");
                } else {
                    System.out.println("Reparata: " + rand.poll());
                }
            } else {
                rand.offer(eveniment);
                System.out.println("Asteapta: " + eveniment + " (" + rand.size() + " la rand)");
            }
        }
        System.out.println("Mai asteapta: " + rand.size());
    }
}
```
