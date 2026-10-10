quiz = [
    {"text": "Which command shows output?", "answer": "B"},
    {"text": "What starts a comment?", "answer": "C"},
    {"text": "What does len() return?", "answer": "A"},
    {"text": "Which keyword defines a function?", "answer": "D"},
]
player_answers = ["B", "C", "A", "B"]


def grade_quiz(questions, answers):
    hits = 0
    k = 0
    while k < len(questions):
        hits += questions[k]["answer"] == answers[k]
        k += 1
    return hits


def report(score, total):
    percent = round(score / total * 100)
    print("Score: " + str(score) + "/" + str(total))
    print("Percentage: " + str(percent) + "%")
    if percent < 50:
        print("FAIL")
    else:
        print("PASS")


report(grade_quiz(quiz, player_answers), len(quiz))
