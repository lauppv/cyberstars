```java
class CrewMember {
    String name;
    CrewMember(String name) {
        this.name = name;
    }
}

class Driver extends CrewMember {
    String car;
    Driver(String name, String car) {
        super(name);
        this.car = car;
    }
}

public class Main {
    public static void main(String[] args) {
        CrewMember[] crew = {
            new Driver("Lance Vance", "Infernus"),
            new CrewMember("Mercedes Cortez"),
            new Driver("Hilary King", "Sentinel")
        };
        for (CrewMember m : crew) {
            System.out.println("Name: " + m.name);
            if (m instanceof Driver) {
                Driver d = (Driver) m;
                System.out.println("Car: " + d.car);
            }
        }
    }
}
```
