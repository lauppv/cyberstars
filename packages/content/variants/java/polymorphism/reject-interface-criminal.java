interface Criminal {
    default void speak() {
        System.out.println("...");
    }
}

class Driver implements Criminal {
    String name;
    Driver(String name) { this.name = name; }
    @Override
    public void speak() { System.out.println("I'm the driver " + name); }
}

class Gunman implements Criminal {
    String name;
    Gunman(String name) { this.name = name; }
    @Override
    public void speak() { System.out.println("I'm the gunman " + name); }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        Criminal[] gang = { new Driver(name1), new Gunman(name2) };
        for (Criminal c : gang) {
            c.speak();
        }
    }
}
