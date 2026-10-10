public class Main {
    static class Criminal {
        String name;
        Criminal(String name) { this.name = name; }
        String role() { return null; }
        void speak() {
            if (role() == null) System.out.println("...");
            else System.out.println("I'm the " + role() + " " + name);
        }
    }

    static class Driver extends Criminal {
        Driver(String name) { super(name); }
        @Override String role() { return "driver"; }
    }

    static class Gunman extends Criminal {
        Gunman(String name) { super(name); }
        @Override String role() { return "gunman"; }
    }

    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        new Driver(name1).speak();
        new Gunman(name2).speak();
    }
}
