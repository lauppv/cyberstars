class Player {
    private final String who;
    private final int pts;

    Player(String who, int pts) {
        this.who = who;
        this.pts = pts;
    }

    @Override
    public String toString() {
        return who + " has " + pts + " points";
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy Vercetti";
        int score1 = 500;
        String name2 = "Lance Vance";
        int score2 = 300;
        Player[] crew = {new Player(name1, score1), new Player(name2, score2)};
        for (Player p : crew) {
            System.out.println(p);
        }
    }
}
