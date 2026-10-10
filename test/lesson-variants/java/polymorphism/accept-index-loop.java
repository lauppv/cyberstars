abstract class Criminal {
    String name;
    Criminal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}

class Driver extends Criminal {
    Driver(String name) { super(name); }
    @Override void speak() { System.out.println("I'm the driver " + name); }
}

class Gunman extends Criminal {
    Gunman(String name) { super(name); }
    @Override void speak() { System.out.println("I'm the gunman " + name); }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        Criminal[] gang = new Criminal[2];
        gang[0] = new Driver(name1);
        gang[1] = new Gunman(name2);
        for (int i = 0; i < gang.length; i++) {
            gang[i].speak();
        }
    }
}
