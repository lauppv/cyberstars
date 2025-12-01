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

    print("=== NEW REQUEST ===")
    print("Language:", language)
    print("Code:", repr(code[:200]))

    if language != "python":
        return jsonify({"output": "Only Python supported"}), 400

    # Fișier temporar – ATENȚIE la indentare!
    tmp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tmp_file:
            tmp_file.write(code)
            tmp_file_path = tmp_file.name   # ← trebuie să fie în interiorul with!

        # Rulare cod
        result = subprocess.run(
            ["python3", "-u", tmp_file_path],
            capture_output=True,
            text=True,
            timeout=8
        )
        output = result.stdout + result.stderr
        if not output.strip():
            output = "Cod rulat cu succes (fără output)"

    except subprocess.TimeoutExpired:
        output = "Error: Execution timed out (8s)"
    except Exception as e:
        output = f"Error: {str(e)}"
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            try:
                os.remove(tmp_file_path)
            except:
                pass

    print("Output:", output)
    return jsonify({"output": output})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Python runner LIVE on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)