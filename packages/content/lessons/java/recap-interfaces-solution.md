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
        String name1 = "Malibu Club";
        int value1 = 120000;
        String name2 = "Infernus";
        int value2 = 150000;
        int speed2 = 240;
        String name3 = "Print Works";
        int value3 = 70000;
        String name4 = "Cheetah";
        int value4 = 110000;
        int speed4 = 230;
        Asset[] assets = {
            new Business(name1, value1, Status.ACTIVE),
            new Vehicle(name2, value2, Status.ACTIVE, speed2),
            new Business(name3, value3, Status.RENOVATION),
            new Vehicle(name4, value4, Status.CLOSED, speed4)
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
