```java
class Player {
    String name;
    int score;

    Player(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

public class Main {
    public static void main(String[] args) {
        Player p1 = new Player("Tommy Vercetti", 500);
        Player p2 = new Player("Lance Vance", 300);

        System.out.println(p1.name + " has " + p1.score + " points");
        System.out.println(p2.name + " has " + p2.score + " points");
    }
}
```
