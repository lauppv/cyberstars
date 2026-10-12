public class Main {
    interface Character {
        String name();
        void takeHit(int damage);
        void attack(Character target);
        void printStatus();
    }

    static class Warrior implements Character {
        final String name;
        int health;
        final int attackPower;
        final int armor;

        Warrior(String n, int h, int a, int armor) {
            name = n;
            health = h;
            attackPower = a;
            this.armor = armor;
        }

        @Override
        public String name() { return name; }

        @Override
        public void takeHit(int damage) { health -= damage; }

        @Override
        public void attack(Character target) {
            target.takeHit(attackPower);
            System.out.printf("%s swings sword at %s for %d damage!%n", name, target.name(), attackPower);
        }

        @Override
        public void printStatus() {
            System.out.printf("%s - HP: %d%n", name, health);
        }
    }

    static class Mage implements Character {
        final String name;
        int health;
        final int attackPower;
        final int spellPower;

        Mage(String n, int h, int a, int s) {
            name = n;
            health = h;
            attackPower = a;
            spellPower = s;
        }

        @Override
        public String name() { return name; }

        @Override
        public void takeHit(int damage) { health -= damage; }

        @Override
        public void attack(Character target) {
            int hit = attackPower + spellPower;
            target.takeHit(hit);
            System.out.printf("%s casts spell on %s for %d damage!%n", name, target.name(), hit);
        }

        @Override
        public void printStatus() {
            System.out.printf("%s - HP: %d%n", name, health);
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
