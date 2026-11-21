import java.util.ArrayList;
import java.util.Comparator;

class Driver {
    String name;
    int time;
    Driver(String name, int time) { this.name = name; this.time = time; }
}

class ByName implements Comparator<Driver> {
    public int compare(Driver a, Driver b) { return a.name.compareTo(b.name); }
}

class ByTime implements Comparator<Driver> {
    public int compare(Driver a, Driver b) { return a.time - b.time; }
}

public class Main {
    public static void main(String[] args) {
        String[] drivers = {"Tommy", "Lance", "Phil", "Candy"};
        int[] times = {61, 58, 75, 61};
        ArrayList<Driver> race = new ArrayList<>();
        for (int i = 0; i < drivers.length; i++) race.add(new Driver(drivers[i], times[i]));
        race.sort(new ByName());
        ArrayList<Driver> abc = new ArrayList<>(race);
        race.sort(new ByTime());
        System.out.println("By time:");
        for (Driver d : race) System.out.println(d.name + " - " + d.time + " s");
        System.out.println("By name:");
        for (Driver d : abc) System.out.println(d.name + " - " + d.time + " s");
    }
}
