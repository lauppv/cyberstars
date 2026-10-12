import java.util.ArrayList;
import java.util.List;

class Visitor {
    String name;
    static int totalVisits = 0;

    Visitor(String name) {
        this.name = name;
        Visitor.totalVisits += 1;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Cortez"};
        List<Visitor> door = new ArrayList<>();
        int k = 0;
        while (k < names.length) {
            door.add(new Visitor(names[k]));
            k++;
        }
        System.out.println(Visitor.totalVisits);
    }
}
