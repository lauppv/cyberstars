class Criminal {
    String name;
    String role;

    Criminal(String name, String role) {
        this.name = name;
        this.role = role;
    }

    void speak() {
        if (role == null) {
            System.out.println("...");
        } else {
            System.out.println("I'm the " + role + " " + name);
        }
    }
}

class Driver extends Criminal {
    Driver(String name) { super(name, "driver"); }
}

class Gunman extends Criminal {
    Gunman(String name) { super(name, "gunman"); }
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
