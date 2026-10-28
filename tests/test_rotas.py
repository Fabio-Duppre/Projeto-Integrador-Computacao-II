## testando o index
def test_pagina_inicial(client):
    resposta = client.get("/")

    assert resposta.status_code == 200

## testando tela de comparação
def test_pagina_comparacao(client):
    resposta = client.get("/comparacao")

    assert resposta.status_code == 200

## testando tela de escolas
def test_pagina_escolas(client):
    resposta = client.get("/escolas")

    assert resposta.status_code == 200

## testando tela de municipios
def test_pagina_municipios(client):
    resposta = client.get("/municipios")

    assert resposta.status_code == 200