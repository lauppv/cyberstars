public class Main {
    static class Player {
        String name;
        int score;

        Player(String name, int score) {
            this.name = name;
            this.score = score;
        }

        void show() {
            System.out.printf("%s has %d points%n", name, score);
        }
    }

    public static void main(String[] args) {
        String name1 = "Tommy Vercetti";
        int score1 = 500;
        String name2 = "Lance Vance";
        int score2 = 300;
        new Player(name1, score1).show();
        new Player(name2, score2).show();
    }
}
