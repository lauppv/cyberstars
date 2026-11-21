```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        String[] miscari = {"Ocean Beach", "Little Havana", "Downtown", "inapoi", "inapoi", "inapoi"};

        Deque<String> locuri = new ArrayDeque<>();
        for (String miscare : miscari) {
            if (miscare.equals("inapoi")) {
                if (locuri.size() < 2) {
                    System.out.println("Nu am unde să mă întorc");
                } else {
                    locuri.pop();
                    System.out.println("Înapoi la " + locuri.peek());
                }
            } else {
                locuri.push(miscare);
                System.out.println("Merg la " + miscare);
            }
        }

        if (locuri.isEmpty()) {
            System.out.println("Acum la: nicăieri");
        } else {
            System.out.println("Acum la: " + locuri.peek());
        }
    }
}
```
