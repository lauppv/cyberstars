```java
public class Main {
    public static void main(String[] args) {
        Object[] evidence = { "knife", 3, "photo", 10 };

        int texts = 0;
        int sum = 0;
        for (Object item : evidence) {
            System.out.println(item.getClass().getSimpleName() + ": " + item);
            if (item instanceof String) {
                texts++;
            } else if (item instanceof Integer) {
                sum += (Integer) item;
            }
        }
        System.out.println("Text items: " + texts);
        System.out.println("Number sum: " + sum);
    }
}
```
