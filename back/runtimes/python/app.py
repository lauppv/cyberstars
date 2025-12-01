from flask import Flask, request, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__)

@app.route("/", methods=["POST"])
def run_code():
    data = request.get_json()
    code = data.get("code", "")
    language = data.get("language", "python").lower()

    # Debug logs (apar în log-urile Railway)
    print("=== NEW REQUEST ===")
    print("Received language:", language)
    print("Code length:", len(code))

    if language != "python":
        return jsonify({"output": "Only Python is supported in this runner"}), 400

    # Creăm fișier temporar
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tmp_file:
        tmp_file.write(code)
        tmp_file_path = tmp_file.name

    try:
        # Rulăm codul cu timeout de 8 secunde (mai safe decât 5)
        result = subprocess.run(
            ["python3", "-u", tmp_file_path],
            capture_output=True,
            text=True,
            timeout=8
        )
        output = result.stdout + result.stderr

        # Dacă nu e niciun output, punem mesaj clar
        if not output.strip():
            output = "Codul a rulat cu succes, dar nu a produs output."

    except subprocess.TimeoutExpired:
        output = "Error: Execution timed out after 8s (posibil buclă infinită)"
    except Exception as e:
        output = f"Error: {str(e)}"
    finally:
        # Ștergem fișierul temporar
        try:
            os.remove(tmp_file_path)
        except OSError:
            pass  # dacă nu se poate șterge, nu e dramă

    print("Execution output:", output)
    return jsonify({"output": output})


# === PORNIRE SERVER ===
if __name__ == "__main__":
    # Railway forțează portul prin variabila PORT
    port = int(os.environ.get("PORT", 5000))
    print(f"Python runner starting on http://0.0.0.0:{port}")
    app.run(
        host="0.0.0.0",   # CRUCIAL – fără asta nu răspunde la cereri din alte servicii!
        port=port,
        debug=False       # debug=True e periculos în production
    )