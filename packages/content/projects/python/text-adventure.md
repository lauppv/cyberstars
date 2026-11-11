Your little cousin Ethan loves the old text adventure games where you type `go north` and the computer tells you what you see. He drew his own on paper: a bakery at night, a locked cellar, a recipe to rescue. He wants to play it on a computer, and next week he'll draw another one. So you won't write his bakery into the program: you'll write a game engine that reads any world from its input and lets you play it.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think the whole game works, press **Run Tests**: the tests play your engine with Ethan's bakery and with worlds you've never seen. Passing them finishes the project.

Everything comes from `input()` and goes out through `print()`.

## Read the world

The program starts by reading a world. First, how many rooms; then four lines per room: its id and name, its description, its exits and the items lying in it. After the rooms come the locked passages (how many, then one per line: the room, the direction, the item that opens it), the dark rooms, the goal (an item and the room to bring it to) and where the player starts:

```text
5
kitchen|Kitchen
Flour covers every table. The oven is still warm.
exits: north=hall, east=pantry
items: none
pantry|Pantry
Shelves of jam jars, and a lamp on a hook.
exits: west=kitchen
items: lamp
hall|Hall
A long hall with portraits of old bakers.
exits: south=kitchen, down=cellar, west=shop
items: key
cellar|Cellar
Sacks of flour, and a dusty recipe book on a barrel.
exits: up=hall
items: recipe
shop|Shop
The front of the bakery. The street door is right here.
exits: east=hall
items: none
1
hall down key
dark: cellar
goal: recipe shop
start kitchen
```

A list of exits, items or dark rooms can be `none`. Keep the whole world in dictionaries: each room by its id, holding its name, description, a dictionary of exits (direction to room id) and a list of items. Once it's read, print `World of 5 rooms`. Every line after that is a command the player types.

## Look around

The game starts by describing the room the player is in, and `look` describes it again:

```text
== Kitchen ==
Flour covers every table. The oven is still warm.
Exits: east, north
```

The exits are sorted by direction. When items lie in the room, one more line lists them in the order they lie there: `You see: lamp`. A room with no exits says `Exits: none`.

Then keep reading commands until the player types `quit`, and print `Bye` then. A command the game doesn't know prints `I don't understand that.`, and an empty line is skipped.

## Walk around

`go <direction>` moves the player through an exit and describes the new room, as `look` would. A direction the room has no exit for prints `You can't go that way.` and the player stays.

Count every move that succeeds: the goal needs the count.

## Pick things up

- `take <item>` picks up an item lying in the room: `You take the key.`, or `There is no key here.`
- `drop <item>` leaves an item from the inventory in the room: `You drop the key.`, or `You don't have a key.`
- `inventory` lists what the player carries, in the order picked up: `You carry: key, lamp`, or `You carry: nothing`

A dropped item lies in its new room from then on, at the end of that room's list.

## Locked passages

A locked passage blocks its exit until it's opened with the right item. `go` through it prints `The way down is locked.` instead of moving.

`unlock <direction>` opens it if the player carries the item:

```text
unlock down
You need the key.
take key
You take the key.
unlock down
You unlock the way down with the key.
```

An exit that isn't locked prints `Nothing is locked down.`. Once opened, a passage stays open, even if the player drops the key.

## Dark rooms

In a dark room the player sees nothing unless they carry the `lamp`. `look` (and arriving there) prints only the name and the darkness:

```text
== Cellar ==
It is too dark to see.
```

In the dark, `take` prints `You can't see anything to take.` Walking out of a dark room still works: the player remembers the way they came.

## Win the game

The player wins by walking into the goal room carrying the goal item. After the room's description, print how many moves it took, and the game ends right there:

```text
go west
== Shop ==
The front of the bakery. The street door is right here.
Exits: east
You made it! It took you 10 moves.
```

One move reads `1 move`. Ethan finished the bakery in 10; draw him a world of your own and see if he can beat it.
