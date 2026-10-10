public class Main {
    static class Driver {
        String name;
        Driver(String name) { this.name = name; }
        void speak() { System.out.println("I'm the driver " + name); }
    }

    static class Gunman {
        String name;
        Gunman(String name) { this.name = name; }
        void speak() { System.out.println("I'm the gunman " + name); }
    }

    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        new Driver(name1).speak();
        new Gunman(name2).speak();
    }
}
