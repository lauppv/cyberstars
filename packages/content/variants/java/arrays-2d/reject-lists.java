import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<List<Integer>> vault = List.of(List.of(100, 500, 20), List.of(0, 900, 50));

        int bestFloor = 0;
        int bestSafe = 0;
        for (int floor = 0; floor < vault.size(); floor++) {
            int total = 0;
            for (int safe = 0; safe < vault.get(floor).size(); safe++) {
                int cash = vault.get(floor).get(safe);
                total += cash;
                if (cash > vault.get(bestFloor).get(bestSafe)) {
                    bestFloor = floor;
                    bestSafe = safe;
                }
            }
            System.out.println("Floor " + (floor + 1) + ": " + total);
        }
        System.out.println("Best safe: floor " + (bestFloor + 1) + ", safe " + (bestSafe + 1) + ", cash " + vault.get(bestFloor).get(bestSafe));
    }
}
