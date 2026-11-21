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
                    System.out.println("Nicio mașină nu așteaptă");
                } else {
                    System.out.println("Reparată: " + rand.poll());
                }
            } else {
                rand.offer(eveniment);
                System.out.println("Așteaptă: " + eveniment + " (" + rand.size() + " la rând)");
            }
        }
        System.out.println("Mai așteaptă: " + rand.size());
    }
}
```
