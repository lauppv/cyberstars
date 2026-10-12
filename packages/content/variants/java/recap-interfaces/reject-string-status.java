interface Asset {
    void display();
}

class Business implements Asset {
    private final String name;
    private final int value;
    private final String status;

    Business(String name, int value, String status) {
        this.name = name;
        this.value = value;
        this.status = status;
    }

    @Override
    public void display() {
        System.out.printf("%s - $%d - %s%n", name, value, status);
    }
}

class Vehicle implements Asset {
    private final String name;
    private final int value;
    private final String status;
    private final int topSpeed;

    Vehicle(String name, int value, String status, int topSpeed) {
        this.name = name;
        this.value = value;
        this.status = status;
        this.topSpeed = topSpeed;
    }

    int getTopSpeed() {
        return topSpeed;
    }

    @Override
    public void display() {
        System.out.printf("%s - $%d - %s%n", name, value, status);
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

        Asset[] empire = new Asset[4];
        empire[0] = new Business(name1, value1, "active");
        empire[1] = new Vehicle(name2, value2, "active", speed2);
        empire[2] = new Business(name3, value3, "renovation");
        empire[3] = new Vehicle(name4, value4, "closed", speed4);
        for (int i = 0; i < empire.length; i++) {
            empire[i].display();
            if (empire[i] instanceof Vehicle car) {
                System.out.printf("Top speed: %d km/h%n", car.getTopSpeed());
            }
        }
    }
}
