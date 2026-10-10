import java.util.List;

class Criminal {
    final String alias;
    Criminal(String alias) { this.alias = alias; }
    void speak() { System.out.println("..."); }
}

class Driver extends Criminal {
    Driver(String alias) { super(alias); }
    @Override void speak() { System.out.println("I'm the driver " + alias); }
}

class Gunman extends Criminal {
    Gunman(String alias) { super(alias); }
    @Override void speak() { System.out.println("I'm the gunman " + alias); }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        List<Criminal> crew = List.of(new Driver(name1), new Gunman(name2));
        int i = 0;
        while (i < crew.size()) {
            crew.get(i).speak();
            i++;
        }
    }
}
