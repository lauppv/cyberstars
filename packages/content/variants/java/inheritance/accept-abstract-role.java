class Criminal {
    protected final String who;

    Criminal(String who) {
        this.who = who;
    }

    void speak() {
        System.out.println("...");
    }
}

class Driver extends Criminal {
    Driver(String n) {
        super(n);
    }

    @Override
    void speak() {
        System.out.println("I'm the driver " + who);
    }
}

class Gunman extends Criminal {
    Gunman(String n) {
        super(n);
    }

    @Override
    void speak() {
        System.out.printf("I'm the gunman %s%n", who);
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        String name2 = "Lance";
        Criminal first = new Driver(name1);
        Criminal second = new Gunman(name2);
        first.speak();
        second.speak();
    }
}
