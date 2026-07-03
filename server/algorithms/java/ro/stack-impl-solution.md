```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Stack {
    private final List<Integer> date = new ArrayList<>();

    void push(int valoare) {
        date.add(valoare);
    }

    Integer pop() {
        if (date.isEmpty()) {
            return null;
        }
        return date.remove(date.size() - 1);
    }

    Integer peek() {
        if (date.isEmpty()) {
            return null;
        }
        return date.get(date.size() - 1);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Stack stiva = new Stack();
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            switch (parti[0]) {
                case "push":
                    stiva.push(Integer.parseInt(parti[1]));
                    break;
                case "pop": {
                    Integer valoare = stiva.pop();
                    System.out.println(valoare == null ? "Goala" : valoare.toString());
                    break;
                }
                case "peek": {
                    Integer valoare = stiva.peek();
                    System.out.println(valoare == null ? "Goala" : valoare.toString());
                    break;
                }
            }
        }
    }
}
```
