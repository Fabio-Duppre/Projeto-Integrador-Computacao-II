from flask import Blueprint, jsonify, request
from database.connection import get_connection

api = Blueprint("api", __name__)

## Consulta da tabela de estados
@api.route("/api/estados", methods=["GET"])
def estados():
    nome = request.args.get("nome")
    connection = get_connection()
    try:
        cursor = connection.cursor()

        if nome :
            cursor.execute(
                """
                    SELECT *
                    FROM estado
                    WHERE nome LIKE %s
                """, (f"%{nome}%")
            )
        else :
            cursor.execute(
                """
                    SELECT id, uf, nome
                    FROM estado
                """
            )

        estados = cursor.fetchall()
        return jsonify(estados)
    finally:
        connection.close()

@api.route("/api/estados/<int:id>", methods=["GET"])
def estado_id(id):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM estado
                WHERE id = %s
            """, (id)
        )
        estado = cursor.fetchone()

        if estado is None:
            return jsonify({
                "erro":"Estado não encontrado"
            })
        return jsonify(estado)
    
    finally:
        connection.close()

@api.route("/api/estados/media", methods=["GET"])
def estado_media():
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT a.id, a.uf, a.nome, COUNT(b.valor_ideb) AS idebs, ROUND(AVG(b.valor_ideb), 2) AS media
                FROM estado a
                INNER JOIN ideb b
                ON b.codigo_estado = a.id
                WHERE b.ano = 2025
                GROUP BY a.id, a.uf, a.nome
                ORDER BY 1
            """
        )
        estado = cursor.fetchall()

        if not estado:
            return jsonify({
                "erro":"Estado não encontrado"
            })
        return jsonify(estado)
    
    finally:
        connection.close()





## Consulta da tabela de municipios
@api.route("/api/municipios", methods=["GET"])
def municipios():
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM municipio
            """
        )

        municipios = cursor.fetchall()
        return jsonify(municipios)
    finally:
        connection.close()

@api.route("/api/municipios/<int:codigo>", methods=["GET"])
def municipio_codigo(codigo):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM municipio
                WHERE codigo = %s
            """, (codigo)
        )
        municipio = cursor.fetchone()

        if municipio is None:
            return jsonify({
                "erro":"Municipio não encontrado"
            })
        return jsonify(municipio)
    
    finally:
        connection.close()



## Consulta da tabela de escolas
@api.route("/api/escolas", methods=["GET"])
def escolas():
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM escola
            """
        )

        escolas = cursor.fetchall()
        return jsonify(escolas)
    finally:
        connection.close()


@api.route("/api/escolas/<int:codigo>", methods=["GET"])
def escola_codigo(codigo):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM escola
                WHERE codigo = %s
            """, (codigo)
        )
        escola = cursor.fetchone()

        if escola is None:
            return jsonify({
                "erro":"Escola não encontrado"
            })
        return jsonify(escola)
    
    finally:
        connection.close()

