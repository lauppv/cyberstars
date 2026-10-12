class Player {
    String name;
    int score;
    Player(String name, int score) { this.name = name; this.score = score; }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy Vercetti";
        int score1 = 500;
        String name2 = "Lance Vance";
        int score2 = 300;
        Player p1 = new Player(name1, score1);
        Player p2 = new Player(name2, score2);
        System.out.println("Tommy Vercetti has 500 points");
        System.out.println("Lance Vance has 300 points");
    }
}
