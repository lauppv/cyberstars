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
        String name1 = "Tommy Vercetti";
        int score1 = 500;
        String name2 = "Lance Vance";
        int score2 = 300;

        Player p1 = new Player(name1, score1);
        Player p2 = new Player(name2, score2);

        System.out.println(p1.name + " has " + p1.score + " points");
        System.out.println(p2.name + " has " + p2.score + " points");
    }
}
```
