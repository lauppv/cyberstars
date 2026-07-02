```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Coada {
    private final List<Integer> date = new ArrayList<>();

    void enqueue(int valoare) {
        date.add(valoare);
    }

    Integer dequeue() {
        if (date.isEmpty()) {
            return null;
        }
        return date.remove(0);
    }

    Integer peek() {
        if (date.isEmpty()) {
            return null;
        }
        return date.get(0);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Coada coada = new Coada();
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            switch (parti[0]) {
                case "enqueue":
                    coada.enqueue(Integer.parseInt(parti[1]));
                    break;
                case "dequeue": {
                    Integer valoare = coada.dequeue();
                    System.out.println(valoare == null ? "Empty" : valoare.toString());
                    break;
                }
                case "peek": {
                    Integer valoare = coada.peek();
                    System.out.println(valoare == null ? "Empty" : valoare.toString());
                    break;
                }
            }
        }
    }
}
```
