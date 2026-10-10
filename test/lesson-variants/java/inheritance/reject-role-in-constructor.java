public class Main {
    static class Criminal {
        String name;
        String role;
        Criminal(String name, String role) { this.name = name; this.role = role; }
        void speak() {
            System.out.println(role == null ? "..." : "I'm the " + role + " " + name);
        }
    }

    static class Driver extends Criminal {
        Driver(String name) { super(name, "driver"); }
    }

    static class Gunman extends Criminal {
        Gunman(String name) { super(name, "gunman"); }
    }

    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        new Driver(name1).speak();
        new Gunman(name2).speak();
    }
}
