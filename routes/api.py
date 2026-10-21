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

## Estado por id
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

## media ideb dos estados
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

## Municipio por codigo de municipio
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

        if not municipio:
            return jsonify({
                "erro":"Municipio não encontrado"
            })
        return jsonify(municipio)
    
    finally:
        connection.close()

## Municipio por codigo de estado
@api.route("/api/municipios_estado/<int:codigo_estado>", methods=["GET"])
def municipios_estado(codigo_estado):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM municipio
                WHERE codigo_estado = %s
            """, (codigo_estado,)
        )
        municipio = cursor.fetchall()

        if municipio is None:
            return jsonify({
                "erro":"Municipios não encontrado"
            })
        return jsonify(municipio)
    
    finally:
        connection.close()
 
## Consulta municipio por codigo, trazendo UF, Media ideb e eescolas participantes
@api.route("/api/municipios_cards/<int:codigo_municipio>", methods=["GET"])
def municipios_cards(codigo_municipio):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT M.nome, E.uf, M.codigo, COUNT(DISTINCT I.codigo_escola) AS numero_escolas, ROUND(AVG(I.valor_ideb)) AS media
                FROM municipio M
                INNER JOIN estado E
                ON M.codigo_estado = E.id
                INNER JOIN ideb I
                ON I.codigo_municipio = M.codigo
                WHERE M.codigo = %s
                GROUP BY M.nome, E.uf, M.codigo
                ORDER BY 1
            """, (codigo_municipio)
        )

        municipios = cursor.fetchall()
        return jsonify(municipios)
    finally:
            connection.close()
    

## Consulta dos anos do municipio no ideb
@api.route("/api/anos_municipios_ideb/<int:codigo_municipio>", methods=["GET"])
def anos_municipios_ideb(codigo_municipio):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT DISTINCT ano, ROUND(AVG(valor_ideb)) AS ano_valor
                FROM ideb 
                WHERE codigo_municipio = %s
                GROUP BY ano
            """, (codigo_municipio)
        )

        anos = cursor.fetchall()
        return jsonify(anos)
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
        ), 

        escolas = cursor.fetchall()
        return jsonify(escolas)
    finally:
        connection.close()

## Consulta de escolas por código
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

## Consulta de escolas por codigo de municipio
@api.route("/api/escolas_municipio/<int:codigo_municipio>", methods=["GET"])
def escolas_municipio(codigo_municipio):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT *
                FROM escola
                WHERE codigo_municipio = %s
            """, (codigo_municipio,)
        )
        escola = cursor.fetchall()

        if not escola:
            return jsonify({
                "erro":"Escola não encontrada"
            })
        return jsonify(escola)
    
    finally:
        connection.close()

## Consulta informações pro card da pagina de escolas
@api.route("/api/escolas_cards/<int:codigo_escola>", methods=["GET"])
def escolas_cards(codigo_escola):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT nome, codigo, rede
                FROM escola
                WHERE codigo = %s
            """, (codigo_escola,)
        )
        escola = cursor.fetchall()

        if not escola:
            return jsonify({
                "erro":"Escola não encontrada"
            })
        return jsonify(escola)
    
    finally:
        connection.close()

## Consulta informações pro grafico de linhas
@api.route("/api/escola_linha/<int:codigo_escola>", methods=["GET"])
def escola_linha(codigo_escola):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
                SELECT I.valor_ideb, I.ano
                FROM escola E
                LEFT JOIN ideb I 
                ON E.codigo = I.codigo_escola
                WHERE E.codigo = %s
                ORDER BY I.ano
            """, (codigo_escola,)
        )
        escola = cursor.fetchall()

        if not escola:
            return jsonify({
                "erro":"Escola não encontrada"
            })
        return jsonify(escola)
    
    finally:
        connection.close()

## Consulta dos cards da tela inicial
@api.route("/api/cards", methods=["GET"])
def cards():    
    connection = get_connection()
    try:
        cursor = connection.cursor()

        cursor.execute(
            """
                SELECT *
                FROM card                
            """,
        )

        cards = cursor.fetchall()
        return jsonify(cards)
    finally:
        connection.close()
