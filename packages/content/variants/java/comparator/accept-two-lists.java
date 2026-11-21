import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

class Driver {
    String name;
    int time;
    Driver(String name, int time) { this.name = name; this.time = time; }
}

class Order implements Comparator<Driver> {
    boolean byTime;
    Order(boolean byTime) { this.byTime = byTime; }
    public int compare(Driver a, Driver b) {
        return byTime ? a.time - b.time : a.name.compareTo(b.name);
    }
}

public class Main {
    public static void main(String[] args) {
        String[] drivers = {"Tommy", "Lance", "Phil", "Candy"};
        int[] times = {61, 58, 75, 61};
        ArrayList<Driver> fast = new ArrayList<>();
        ArrayList<Driver> abc = new ArrayList<>();
        for (int i = 0; i < drivers.length; i++) {
            Driver d = new Driver(drivers[i], times[i]);
            fast.add(d);
            abc.add(d);
        }
        Collections.sort(fast, new Order(true));
        Collections.sort(abc, new Order(false));
        System.out.println("By time:");
        for (Driver d : fast) System.out.println(d.name + " - " + d.time + " s");
        System.out.println("By name:");
        for (Driver d : abc) System.out.println(d.name + " - " + d.time + " s");
    }
}
