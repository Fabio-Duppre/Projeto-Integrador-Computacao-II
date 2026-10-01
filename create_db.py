from pathlib import Path
import sqlite3
import shutil


# Diretório raiz do projeto
BASE_DIR = Path(__file__).resolve().parent

# Arquivos
DATABASE_DIR = BASE_DIR / "database"
DATABASE_FILE = DATABASE_DIR / "database.sqlite"
CONNECTION_FILE = DATABASE_DIR / "connection.py"
BACKUP_FILE = DATABASE_DIR / "connection.py.mysql.bak"


# Estrutura do banco
SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS estado (
    id INTEGER NOT NULL,
    uf TEXT NOT NULL,
    nome TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS municipio (
    id INTEGER NOT NULL,
    codigo_estado INTEGER NOT NULL,
    nome TEXT NOT NULL,
    codigo INTEGER,
    PRIMARY KEY (id),
    UNIQUE (codigo),
    FOREIGN KEY (codigo_estado)
        REFERENCES estado (id)
);

CREATE TABLE IF NOT EXISTS escola (
    id INTEGER NOT NULL,
    codigo_municipio INTEGER NOT NULL,
    codigo INTEGER NOT NULL,
    nome TEXT NOT NULL,
    rede TEXT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (codigo),
    FOREIGN KEY (codigo_municipio)
        REFERENCES municipio (codigo)
);

CREATE TABLE IF NOT EXISTS aprovacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_estado INTEGER NOT NULL,
    codigo_municipio INTEGER NOT NULL,
    codigo_escola INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    todos REAL,
    ano1 REAL,
    ano2 REAL,
    ano3 REAL,
    ano4 REAL,
    ano5 REAL,
    rendimento REAL,

    FOREIGN KEY (codigo_escola)
        REFERENCES escola (codigo),

    FOREIGN KEY (codigo_estado)
        REFERENCES estado (id),

    FOREIGN KEY (codigo_municipio)
        REFERENCES municipio (codigo)
);

CREATE TABLE IF NOT EXISTS card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_estado TEXT,
    numero INTEGER
);

CREATE TABLE IF NOT EXISTS ideb (
    id INTEGER NOT NULL,
    codigo_estado INTEGER NOT NULL,
    codigo_municipio INTEGER NOT NULL,
    codigo_escola INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    valor_ideb REAL,

    PRIMARY KEY (id),

    FOREIGN KEY (codigo_escola)
        REFERENCES escola (codigo),

    FOREIGN KEY (codigo_estado)
        REFERENCES estado (id),

    FOREIGN KEY (codigo_municipio)
        REFERENCES municipio (codigo)
);

CREATE TABLE IF NOT EXISTS metas_ideb (
    id INTEGER NOT NULL,
    codigo_estado INTEGER NOT NULL,
    codigo_municipio INTEGER NOT NULL,
    codigo_escola INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    meta_ideb REAL,

    PRIMARY KEY (id),

    FOREIGN KEY (codigo_escola)
        REFERENCES escola (codigo),

    FOREIGN KEY (codigo_estado)
        REFERENCES estado (id),

    FOREIGN KEY (codigo_municipio)
        REFERENCES municipio (codigo)
);

CREATE TABLE IF NOT EXISTS saeb (
    id INTEGER NOT NULL,
    codigo_estado INTEGER NOT NULL,
    codigo_municipio INTEGER NOT NULL,
    codigo_escola INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    matematica REAL,
    portugues REAL,
    media_padronizada REAL,

    PRIMARY KEY (id),

    FOREIGN KEY (codigo_escola)
        REFERENCES escola (codigo),

    FOREIGN KEY (codigo_municipio)
        REFERENCES municipio (codigo),

    FOREIGN KEY (codigo_estado)
        REFERENCES estado (id)
);
"""

# Adicionando valores ficticios
SEED = """
PRAGMA foreign_keys = ON;

-- ==========================================
-- ESTADOS
-- ==========================================

INSERT OR IGNORE INTO estado (id, uf, nome)
VALUES
    (1, 'SP', 'São Paulo'),
    (2, 'MG', 'Minas Gerais');


-- ==========================================
-- MUNICÍPIOS
-- ==========================================

INSERT OR IGNORE INTO municipio (id, codigo_estado, nome, codigo)
VALUES
    (1, 1, 'Campinas', 3509502),
    (2, 2, 'Belo Horizonte', 3106200);


-- ==========================================
-- ESCOLAS
-- ==========================================

INSERT OR IGNORE INTO escola
    (id, codigo_municipio, codigo, nome, rede)
VALUES
    (1, 3509502, 100001, 'Escola Demonstrativa Campinas', 'Municipal'),
    (2, 3106200, 200001, 'Escola Demonstrativa Belo Horizonte', 'Estadual');


-- ==========================================
-- CARDS
-- ==========================================

INSERT OR IGNORE INTO card
    (id, nome_estado, numero)
VALUES
    (1, 'São Paulo', 1),
    (2, 'Minas Gerais', 1),
    (3, 'Minas Gerais', 2),
    (4, 'Minas Gerais', 2),
    (5, 'Minas Gerais', 2),
    (6, 'Minas Gerais', 2),    
    (7, 'Tocantins', 1);


-- ==========================================
-- APROVAÇÃO
-- ==========================================

INSERT OR IGNORE INTO aprovacao
    (
        id,
        codigo_estado,
        codigo_municipio,
        codigo_escola,
        ano,
        todos,
        ano1,
        ano2,
        ano3,
        ano4,
        ano5,
        rendimento
    )
VALUES
    (
        1,
        1,
        3509502,
        100001,
        2025,
        95.0,
        94.0,
        95.0,
        96.0,
        95.0,
        94.0,
        95.0
    ),
    (
        2,
        2,
        3106200,
        200001,
        2025,
        92.0,
        91.0,
        92.0,
        93.0,
        92.0,
        91.0,
        92.0
    );


-- ==========================================
-- IDEB
-- ==========================================

INSERT OR IGNORE INTO ideb
    (
        id,
        codigo_estado,
        codigo_municipio,
        codigo_escola,
        ano,
        valor_ideb
    )
VALUES
    (1, 1, 3509502, 100001, 2025, 6.2),
    (2, 2, 3106200, 200001, 2025, 5.8);


-- ==========================================
-- METAS IDEB
-- ==========================================

INSERT OR IGNORE INTO metas_ideb
    (
        id,
        codigo_estado,
        codigo_municipio,
        codigo_escola,
        ano,
        meta_ideb
    )
VALUES
    (1, 1, 3509502, 100001, 2025, 6.0),
    (2, 2, 3106200, 200001, 2025, 6.0);


-- ==========================================
-- SAEB
-- ==========================================

INSERT OR IGNORE INTO saeb
    (
        id,
        codigo_estado,
        codigo_municipio,
        codigo_escola,
        ano,
        matematica,
        portugues,
        media_padronizada
    )
VALUES
    (1, 1, 3509502, 100001, 2025, 250.0, 260.0, 255.0),
    (2, 2, 3106200, 200001, 2025, 240.0, 250.0, 245.0);
"""


# Código de conexão SQLite
SQLITE_CONNECTION = '''import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATABASE_FILE = BASE_DIR / "database.sqlite"


def get_connection():

    connection = sqlite3.connect(DATABASE_FILE)

    connection.row_factory = sqlite3.Row

    return connection
'''


def create_database():
    """Cria o banco SQLite e suas tabelas."""

    DATABASE_DIR.mkdir(exist_ok=True)

    connection = sqlite3.connect(DATABASE_FILE)

    try:
        connection.executescript(SCHEMA)
        connection.executescript(SEED)
        connection.commit()
    finally:
        connection.close()


def backup_connection():
    """Cria uma cópia do connection.py original."""

    if CONNECTION_FILE.exists() and not BACKUP_FILE.exists():
        shutil.copy2(CONNECTION_FILE, BACKUP_FILE)


def update_connection():
    """Substitui a conexão MySQL pela conexão SQLite."""

    CONNECTION_FILE.write_text(
        SQLITE_CONNECTION,
        encoding="utf-8"
    )


def main():

    print("======================================")
    print(" Configuração do ambiente SQLite")
    print("======================================")

    print("\n[1/3] Criando banco SQLite...")
    create_database()
    print(f"      OK: {DATABASE_FILE}")

    print("\n[2/3] Fazendo backup da conexão original...")
    backup_connection()

    if BACKUP_FILE.exists():
        print(f"      OK: {BACKUP_FILE}")

    print("\n[3/3] Alterando connection.py para SQLite...")
    update_connection()
    print(f"      OK: {CONNECTION_FILE}")

    print("\n======================================")
    print(" Ambiente SQLite configurado!")
    print("======================================")
    print("\nAgora você pode executar o projeto normalmente.")


if __name__ == "__main__":
    main()