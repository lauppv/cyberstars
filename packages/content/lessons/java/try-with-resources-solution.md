```java
class Door implements AutoCloseable {
    String visitor;

    Door(String visitor) {
        this.visitor = visitor;
        System.out.println("Door opens for " + visitor);
    }

    public void close() {
        System.out.println("Door locks");
    }
}

public class Main {
    public static void main(String[] args) {
        String[] visitors = {"Lance", "Cops", "Phil"};

        int safe = 0;
        for (String name : visitors) {
            try (Door door = new Door(name)) {
                if (door.visitor.equals("Cops")) {
                    throw new IllegalStateException("Cops at the door");
                }
                System.out.println(door.visitor + " is inside");
                safe++;
            } catch (IllegalStateException e) {
                System.out.println("Alarm: " + e.getMessage());
            }
        }
        System.out.println("Safe visits: " + safe);
    }
}
```
