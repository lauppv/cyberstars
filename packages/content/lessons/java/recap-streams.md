Use lambdas, a stream with filter, sorted and map, a collect and an Optional together

---

## Mission: Hiring the Crew

Tommy needs a crew for a big job. Everyone who wants in did a test, and each one got a skill score. Tommy hires only the people with a score of at least a minimum

The names are in a `String[] names` array and their scores in an `int[] scores` array. `names[i]` got `scores[i]`. The minimum is in `int minimum`. Print three lines:

- `Hired: ` and the hired people, from the highest score to the lowest, separated by a comma and a space. People with the same score keep the order from the arrays. If nobody is hired, print `Hired: nobody`
- `Team skill: ` and the sum of the scores of the hired people
- `Best: ` and the hired person with the highest score, or `Best: nobody`. If several share the highest score, pick the first one in the arrays

**Example**

```text
Hired: Mitch, Lance, Earnest, Phil
Team skill: 330
Best: Mitch
```

**Example**

```text
Hired: nobody
Team skill: 0
Best: nobody
```
