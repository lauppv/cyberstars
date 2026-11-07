A network of small weather stations sits on hilltops around a national park. They run on a battery and a tiny radio, so every message has to be as short as possible: each station sends its whole report as one 32-bit number, every measurement packed into a few bits. You'll write the receiver at the park's office: it unpacks every report with bit operations, throws out the broken ones, keeps a summary per station, and can pack a report the other way for testing.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The packet

A packet is 32 bits, from bit 31 on the left to bit 0 on the right:

| Bits     | Holds                                            |
| -------- | ------------------------------------------------ |
| 31 to 28 | the station's number, 0 to 15                    |
| 27 to 18 | the temperature, in tenths of a degree, plus 400 |
| 17 to 11 | the humidity, in percent                         |
| 10 to 3  | the wind speed, in km/h                          |
| 2        | 1 when it's raining                              |
| 1        | 1 when the battery is low                        |
| 0        | 1 when a sensor failed                           |

Print `Receiver on` at the start. Then keep reading commands until someone types `quit`, and print `Receiver off` then. Any other word prints `Unknown command: listen`, and the rest of its line is skipped with `scanf("%*[^\n]")`.

## Receive a packet

`packet <hex>` receives a packet written in hexadecimal, like `399E0060`. `scanf("%x", &p)` reads it into an `unsigned int`; use unsigned numbers for everything in this project, so shifting right never drags a sign bit along.

Number the packets from 1, and print which packet it is, then its 32 bits, grouped by field with a space between groups:

```text
packet 399E0060
Packet 1 from station 3
0011 1001100111 1000000 00001100 000
```

Bit `b` of `p` is `(p >> b) & 1`. For the station, shift the packet right by 28: the four bits on the left are all that's left.

## Temperature, humidity, wind

A field in the middle of the packet comes out in two moves: shift it down to bit 0, then keep only its bits with a mask. The temperature is 10 bits, so its mask is `0x3FF` (ten 1s): `(p >> 18) & 0x3FF`. Then take off the 400 and divide by ten. Humidity is 7 bits and wind 8, so work out their masks the same way.

```text
Temperature 21.5 C, humidity 64%, wind 12 km/h
```

Temperatures print with one decimal. Remember that `%` has to be written `%%` in `printf`.

## Flags

The three lowest bits are flags, each a yes or a no. `p & 4` is not zero exactly when bit 2 is set. After the measurements, print a line for each flag that is set:

```text
packet 359AC0F6
Packet 2 from station 3
0011 0101100110 1011000 00011110 110
Temperature -4.2 C, humidity 88%, wind 30 km/h
Raining
Battery low
```

## Broken packets

A radio message can arrive damaged, and a sensor can fail. After printing the bits, reject a packet, printing no measurements and keeping nothing of it, when:

- its humidity is over 100: `Rejected: humidity 120`
- its sensor-error bit is set: `Rejected: sensor error`

Check them in that order. A rejected packet still gets its number.

## Station summary

`stations` lists every station that sent at least one good packet, by number, with how many, its lowest and highest temperature, and how many packets said it was raining:

```text
stations
Station 3: 4 packets, -4.2 to 25.5 C, rain in 2
Station 7: 1 packet, 35.0 to 35.0 C, rain in 0
```

With no good packet yet, print `No packets yet`. There are only 16 possible stations, so an array of 16 structs, one per station number, does the job.

## Pack a report

To test new stations, the office packs reports the other way. `encode <station> <temperature> <humidity> <wind> <rain> <battery>` builds the packet and prints it in hexadecimal, with eight digits (`0x%08X`):

```text
encode 3 21.5 64 12 0 0
0x399E0060
encode 3 -4.2 88 30 1 1
0x359AC0F6
```

Turn the temperature into tenths plus 400, rounding to the nearest tenth, then shift each field up to its place with `<<` and combine them with `|`. A value that doesn't fit its field (a station above 15, a temperature outside -40.0 to 62.3, humidity above 100, wind above 255, a flag other than 0 or 1) prints `Out of range`.

Feed the hexadecimal you get back to `packet` (without the `0x`, or with it: `%x` accepts both): the same values come out. A `packet` whose value isn't hexadecimal prints `Usage: packet <hex>`, and an `encode` without six numbers `Usage: encode <station> <temperature> <humidity> <wind> <rain> <battery>`.
