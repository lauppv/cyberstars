from flask import Flask, request, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__)

@app.route("/", methods=["POST"])
def run_code():
    data = request.get_json() or {}
    code = data.get("code", "")
    language = data.get("language", "python").lower()

    if language != "python":
        return jsonify({"output": "Only Python is supported"}), 400

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(code)
            tmp_path = f.name

        result = subprocess.run(
            ["python3", "-u", tmp_path],
            capture_output=True,
            text=True,
            timeout=10
        )
        output = result.stdout + result.stderr
        if not output.strip():
            output = "Cod rulat cu succes – fără output"

    except subprocess.TimeoutExpired:
        output = "Error: Timeout după 10 secunde"
    except Exception as e:
        output = f"Error: {str(e)}"
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except:
                pass

    return jsonify({"output": output})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Python runner pornit pe 0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port)