```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] entries = { "42", "tape", "-7", "300" };

        ArrayList<Integer> numbers = new ArrayList<>();
        int bad = 0;
        for (String entry : entries) {
            try {
                numbers.add(Integer.parseInt(entry));
            } catch (NumberFormatException e) {
                bad++;
            }
        }
        int smallest = Integer.MAX_VALUE;
        for (int n : numbers) {
            if (n < smallest) {
                smallest = n;
            }
        }
        System.out.println("Numbers: " + numbers);
        System.out.println("Bad: " + bad);
        System.out.println("Smallest: " + (numbers.isEmpty() ? "none" : smallest));
    }
}
```
