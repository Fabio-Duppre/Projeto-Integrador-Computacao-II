from flask import Blueprint, jsonify

api = Blueprint("api", __name__)

@api.route("/api/teste", methods=["GET"])
def teste ():
    return jsonify({
        "mensagem" : "Api funcionando"
    })