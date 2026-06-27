```java
enum Status {
    ACTIVE, CLOSED, RENOVATION
}

interface Asset {
    void display();
}

class Business implements Asset {
    String name;
    int value;
    Status status;

    Business(String name, int value, Status status) {
        this.name = name;
        this.value = value;
        this.status = status;
    }

    public void display() {
        System.out.println(name + " - $" + value + " - " + status.name().toLowerCase());
    }
}

class Vehicle implements Asset {
    String name;
    int value;
    Status status;
    int topSpeed;

    Vehicle(String name, int value, Status status, int topSpeed) {
        this.name = name;
        this.value = value;
        this.status = status;
        this.topSpeed = topSpeed;
    }

    public void display() {
        System.out.println(name + " - $" + value + " - " + status.name().toLowerCase());
    }
}

public class Main {
    public static void main(String[] args) {
        Asset[] assets = {
            new Business("Malibu Club", 120000, Status.ACTIVE),
            new Vehicle("Infernus", 150000, Status.ACTIVE, 240),
            new Business("Print Works", 70000, Status.RENOVATION),
            new Vehicle("Cheetah", 110000, Status.CLOSED, 230)
        };
        for (Asset a : assets) {
            a.display();
            if (a instanceof Vehicle) {
                Vehicle v = (Vehicle) a;
                System.out.println("Top speed: " + v.topSpeed + " km/h");
            }
        }
    }
}
```
