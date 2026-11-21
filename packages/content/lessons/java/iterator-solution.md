```java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        int[] offers = {5000, 9000, 1000, 12000, 7500, 2000};
        int minimum = 7000;

        ArrayList<Integer> list = new ArrayList<>();
        for (int offer : offers) {
            list.add(offer);
        }

        int removed = 0;
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            if (it.next() < minimum) {
                it.remove();
                removed++;
            }
        }
        System.out.println("Kept: " + list);
        System.out.println("Removed: " + removed);
    }
}
```
