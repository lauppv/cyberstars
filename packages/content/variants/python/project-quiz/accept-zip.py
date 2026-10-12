quiz = [
    {"text": "Which command shows output?", "answer": "B"},
    {"text": "What starts a comment?", "answer": "C"},
    {"text": "What does len() return?", "answer": "A"},
    {"text": "Which keyword defines a function?", "answer": "D"},
]
player_answers = ["B", "C", "A", "B"]


def grade_quiz(qs, given):
    return sum(1 for q, a in zip(qs, given) if q["answer"] == a)


right = grade_quiz(quiz, player_answers)
n = len(quiz)
pct = round(right / n * 100)
print(f"Score: {right}/{n}")
print(f"Percentage: {pct}%")
print("PASS" if pct >= 50 else "FAIL")
