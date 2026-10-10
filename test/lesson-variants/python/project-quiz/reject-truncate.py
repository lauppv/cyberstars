quiz = [
    {"text": "Which command shows output?", "answer": "B"},
    {"text": "What starts a comment?", "answer": "C"},
    {"text": "What does len() return?", "answer": "A"},
    {"text": "Which keyword defines a function?", "answer": "D"},
]
player_answers = ["B", "C", "A", "B"]


def grade_quiz(questions, answers):
    return len([1 for q, a in zip(questions, answers) if q["answer"] == a])


score = grade_quiz(quiz, player_answers)
pct = score * 100 // len(quiz)
print(f"Score: {score}/{len(quiz)}")
print(f"Percentage: {pct}%")
print("PASS" if pct >= 50 else "FAIL")
