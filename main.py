from flask import Flask, render_template
from routes.api import api
from pathlib import Path

arquivo = Path("static/geojson/municipios.json")

app = Flask(__name__)
app.register_blueprint(api)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/escolas")
def escolas():
    return render_template("escolas.html")

@app.route("/municipios")
def municipios():
    return render_template("municipios.html")

@app.route("/comparacao")
def comparacao():
    return render_template("comparacao.html")


if __name__ == "__main__":    
    app.run(debug=True)

