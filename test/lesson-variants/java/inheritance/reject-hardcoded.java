class Criminal {
    String name;
    Criminal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}

class Driver extends Criminal {
    Driver(String name) { super(name); }
    void speak() { System.out.println("I'm the driver Tommy"); }
}

class Gunman extends Criminal {
    Gunman(String name) { super(name); }
    void speak() { System.out.println("I'm the gunman Lance"); }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        new Driver(name1).speak();
        new Gunman(name2).speak();
    }
}
