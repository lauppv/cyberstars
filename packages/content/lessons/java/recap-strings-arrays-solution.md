```java
public class Main {
    public static void main(String[] args) {
        String report = "XX.X/..X./XXXX";

        String[] levels = report.split("/");
        StringBuilder freeSpots = new StringBuilder();
        int totalFree = 0;
        for (int level = 0; level < levels.length; level++) {
            int free = 0;
            for (int spot = 0; spot < levels[level].length(); spot++) {
                if (levels[level].charAt(spot) == '.') {
                    free++;
                    if (freeSpots.length() > 0) {
                        freeSpots.append(", ");
                    }
                    freeSpots.append((level + 1) + "-" + (spot + 1));
                }
            }
            totalFree += free;
            System.out.println(String.format("Level %d | %s | %d free", level + 1, levels[level], free));
        }
        System.out.println("Free spots: " + (totalFree == 0 ? "none" : freeSpots.toString()));
        System.out.println("Total free: " + totalFree);
    }
}
```
