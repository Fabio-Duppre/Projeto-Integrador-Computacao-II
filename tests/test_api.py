# 1. Média dos estados
def test_estados_media(client):
    resposta = client.get("/api/estados/media")

    assert resposta.status_code == 200
    assert resposta.is_json


# 2. Municípios por estado
def test_municipios_estado(client):
    resposta = client.get("/api/municipios_estado/26")

    assert resposta.status_code == 200
    assert resposta.is_json


# 3. Cards do município
def test_municipios_cards(client):
    resposta = client.get("/api/municipios_cards/3503307")

    assert resposta.status_code == 200
    assert resposta.is_json


# 4. Histórico do IDEB do município
def test_anos_municipios_ideb(client):
    resposta = client.get("/api/anos_municipios_ideb/3503307")

    assert resposta.status_code == 200
    assert resposta.is_json


# 5. Escolas por município
def test_escolas_municipio(client):
    resposta = client.get("/api/escolas_municipio/3503307")

    assert resposta.status_code == 200
    assert resposta.is_json


# 6. Cards da escola
def test_escolas_cards(client):
    resposta = client.get("/api/escolas_cards/11024372")

    assert resposta.status_code == 200
    assert resposta.is_json


# 7. Histórico do IDEB da escola
def test_escola_linha(client):
    resposta = client.get("/api/escola_linha/11024372")

    assert resposta.status_code == 200
    assert resposta.is_json


# 8. Comparação entre IDEB e metas
def test_escola_barras_ideb(client):
    resposta = client.get("/api/escola_barrasIdeb/11024372")

    assert resposta.status_code == 200
    assert resposta.is_json


# 9. Dados do SAEB da escola
def test_escola_barras_saeb(client):
    resposta = client.get("/api/escola_barrasSaeb/11024372")

    assert resposta.status_code == 200
    assert resposta.is_json


# 10. Média do SAEB da escola
def test_escola_media_saeb(client):
    resposta = client.get("/api/escola_MediaSaeb/11024372")

    assert resposta.status_code == 200
    assert resposta.is_json