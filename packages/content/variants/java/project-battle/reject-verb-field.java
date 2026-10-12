public class Main {
    static class Character {
        final String name;
        int health;
        final int attackPower;
        final String verb;
        final int bonus;

        Character(String n, int h, int a, String verb, int bonus) {
            name = n;
            health = h;
            attackPower = a;
            this.verb = verb;
            this.bonus = bonus;
        }

        void attack(Character target) {
            int hit = attackPower + bonus;
            target.health -= hit;
            System.out.printf("%s %s %s for %d damage!%n", name, verb, target.name, hit);
        }

        void printStatus() {
            System.out.printf("%s - HP: %d%n", name, health);
        }
    }

    static class Warrior extends Character {
        final int armor;

        Warrior(String n, int h, int a, int armor) {
            super(n, h, a, "swings sword at", 0);
            this.armor = armor;
        }
    }

    static class Mage extends Character {
        Mage(String n, int h, int a, int s) {
            super(n, h, a, "casts spell on", s);
        }
    }

    public static void main(String[] args) {
        String name2 = "Lance";
        int health2 = 80;
        int attack2 = 15;
        int spell2 = 20;
        String name1 = "Tommy";
        int health1 = 100;
        int attack1 = 25;
        int armor1 = 10;
        Warrior warrior = new Warrior(name1, health1, attack1, armor1);
        Mage mage = new Mage(name2, health2, attack2, spell2);
        warrior.attack(mage);
        mage.printStatus();
        mage.attack(warrior);
        warrior.printStatus();
    }
}
