public class Main {
    static class CrewMember {
        String name;
        CrewMember(String name) { this.name = name; }
    }

    static class Driver extends CrewMember {
        String car;
        Driver(String name, String car) { super(name); this.car = car; }
    }

    public static void main(String[] args) {
        String name1 = "Lance Vance";
        String car1 = "Infernus";
        String name2 = "Mercedes Cortez";
        String name3 = "Hilary King";
        String car3 = "Sentinel";
        CrewMember[] crew = {new Driver(name1, car1), new CrewMember(name2), new Driver(name3, car3)};
        for (CrewMember m : crew) {
            System.out.println("Name: " + m.name);
            if (m.getClass() == Driver.class) {
                System.out.println("Car: " + ((Driver) m).car);
            }
        }
    }
}
