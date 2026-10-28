import pytest
from main import app as aplicacao

@pytest.fixture
def app():
    aplicacao.config["TESTING"] = True
    return aplicacao

@pytest.fixture
def client(app):
    return app.test_client()