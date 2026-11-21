```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        String[] moves = {"Ocean Beach", "Little Havana", "Downtown", "back", "back", "back"};

        Deque<String> places = new ArrayDeque<>();
        for (String move : moves) {
            if (move.equals("back")) {
                if (places.size() < 2) {
                    System.out.println("Nowhere to go back to");
                } else {
                    places.pop();
                    System.out.println("Back at " + places.peek());
                }
            } else {
                places.push(move);
                System.out.println("Drive to " + move);
            }
        }

        if (places.isEmpty()) {
            System.out.println("Now at: nowhere");
        } else {
            System.out.println("Now at: " + places.peek());
        }
    }
}
```
