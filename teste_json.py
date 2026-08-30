import json
from pathlib import Path


# Arquivo original do IBGE
arquivo_origem = Path("static/geojson/municipios.json")

# Pasta onde os arquivos separados serão salvos
pasta_saida = Path("static/geojson/municipios")

# Cria a pasta se ela não existir
pasta_saida.mkdir(parents=True, exist_ok=True)


print("Carregando GeoJSON...")

with open(arquivo_origem, "r", encoding="utf-8") as arquivo:
    geojson = json.load(arquivo)


print(f"Total de municípios: {len(geojson['features'])}")


# Dicionário que vai separar os municípios por UF
municipios_por_uf = {}


for municipio in geojson["features"]:

    propriedades = municipio["properties"]

    uf = propriedades["SIGLA_UF"]

    if uf not in municipios_por_uf:
        municipios_por_uf[uf] = []

    municipios_por_uf[uf].append(municipio)


print("Separando municípios por UF...")


for uf, municipios in municipios_por_uf.items():

    geojson_uf = {
        "type": "FeatureCollection",
        "name": f"municipios_{uf}",
        "features": municipios
    }

    arquivo_saida = pasta_saida / f"{uf}.json"

    with open(arquivo_saida, "w", encoding="utf-8") as arquivo:
        json.dump(
            geojson_uf,
            arquivo,
            ensure_ascii=False,
            separators=(",", ":")
        )

    print(f"{uf}: {len(municipios)} municípios")


print("\nProcesso concluído!")