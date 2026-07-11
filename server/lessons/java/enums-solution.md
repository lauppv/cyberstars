```java
enum Status {
    ACTIVE, CLOSED, RENOVATION, DESTROYED
}

public class Main {
    public static void describeStatus(Status s) {
        switch (s) {
            case ACTIVE:
                System.out.println("Active: making money every day");
                break;
            case CLOSED:
                System.out.println("Closed: not generating income right now");
                break;
            case RENOVATION:
                System.out.println("Renovation: work in progress, opening soon");
                break;
            case DESTROYED:
                System.out.println("Destroyed: needs to be rebuilt from scratch");
                break;
        }
    }

    public static void main(String[] args) {
        String[] names = { "Malibu Club", "Boatyard", "Print Works", "Kaufman Cabs" };
        Status[] statuses = Status.values();
        for (int i = 0; i < statuses.length; i++) {
            System.out.print(names[i] + " - ");
            describeStatus(statuses[i]);
        }
    }
}
```
