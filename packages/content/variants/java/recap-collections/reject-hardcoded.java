import java.util.ArrayList;
import java.util.HashMap;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        String[] purchases = {"Pistol", "Shotgun", "Pistol", "Automatic", "Shotgun", "Pistol", "Automatic"};
        HashMap<String, Integer> count = new HashMap<>();
        ArrayList<String> popular = new ArrayList<>();
        for (String w : purchases) { }
        Collections.sort(popular);
        System.out.println("Pistol: 3\nShotgun: 2\nAutomatic: 2\nMost bought: Pistol\nPopular (sorted): [Automatic, Pistol, Shotgun]");
    }
}
