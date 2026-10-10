import java.util.List;

enum Status { ACTIVE, CLOSED, RENOVATION }

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

    public String toString() {
        return name + " - $" + value + " - " + status.toString().toLowerCase();
    }

    public void display() {
        System.out.println(this);
    }
}

class Vehicle extends Business {
    int topSpeed;

    Vehicle(String name, int value, Status status, int topSpeed) {
        super(name, value, status);
        this.topSpeed = topSpeed;
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

        List<Asset> assets = List.of(
            new Business(name1, value1, Status.ACTIVE),
            new Vehicle(name2, value2, Status.ACTIVE, speed2),
            new Business(name3, value3, Status.RENOVATION),
            new Vehicle(name4, value4, Status.CLOSED, speed4));
        int i = 0;
        while (i < assets.size()) {
            Asset a = assets.get(i++);
            a.display();
            if (a instanceof Vehicle) {
                System.out.println("Top speed: " + ((Vehicle) a).topSpeed + " km/h");
            }
        }
    }
}
