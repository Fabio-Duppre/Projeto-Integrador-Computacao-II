from flask import Flask, render_template
from routes.api import api
from pathlib import Path
from database.connection import get_connection

arquivo = Path("static/geojson/municipios.json")

app = Flask(__name__)
app.register_blueprint(api)

@app.route("/")
def index():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM card
        """)

        cards = cursor.fetchall()

    finally:
        connection.close()

    return render_template("index.html", cards=cards)

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

