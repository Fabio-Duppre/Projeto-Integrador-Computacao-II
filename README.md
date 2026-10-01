# Projeto-Integrador-Computacao-II

Projeto Integrador II desenvolvido para o curso de Ciência de Dados da UNIVESP.

## Para rodar o projeto

### 1. Instalar as dependências

Após clonar o repositório, instale as principais dependências do projeto com:

```bash
pip install -r requirements.txt
```

### 2. Configurar o banco de dados local

Para executar o projeto localmente sem a necessidade de configurar o banco de dados em nuvem, execute:

```bash
python create_db.py
```

Esse script irá:

* criar o banco de dados SQLite;
* criar as tabelas necessárias para o funcionamento da aplicação;
* inserir dados de demonstração;
* adaptar a conexão da aplicação para utilizar o SQLite.

> **Observação:** Os dados inseridos no SQLite são fictícios e servem exclusivamente para demonstração e testes locais.

O projeto originalmente utiliza um banco de dados em nuvem, utilizado como parte da infraestrutura do projeto e dos requisitos definidos para o Projeto Integrador da UNIVESP.

## Sobre o projeto

O projeto encontra-se em desenvolvimento e consiste em um visualizador de dados do **Índice de Desenvolvimento da Educação Básica (IDEB)**.

A plataforma tem como objetivo facilitar a visualização e a consulta dos dados relacionados ao IDEB, permitindo uma apresentação mais acessível das informações educacionais disponibilizadas pelo Governo Brasileiro.

### Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

* **Python**
* **Flask**
* **MySQL**
* **SQLite**
* **HTML5**
* **CSS**
* **JavaScript**
* **Tailwind CSS**
* **Leaflet**
* **Chart.js**

O projeto também utiliza uma API desenvolvida com Flask para disponibilizar os dados utilizados pela interface da aplicação.

