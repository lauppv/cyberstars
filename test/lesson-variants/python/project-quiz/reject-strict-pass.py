quiz = [
    {"text": "Which command shows output?", "answer": "B"},
    {"text": "What starts a comment?", "answer": "C"},
    {"text": "What does len() return?", "answer": "A"},
    {"text": "Which keyword defines a function?", "answer": "D"},
]
player_answers = ["B", "C", "A", "B"]


def grade_quiz(questions, answers):
    correct = 0
    for q, a in zip(questions, answers):
        if q["answer"] == a:
            correct += 1
    return correct


score = grade_quiz(quiz, player_answers)
pct = round(score / len(quiz) * 100)
print(f"Score: {score}/{len(quiz)}")
print(f"Percentage: {pct}%")
print("PASS" if pct > 50 else "FAIL")
