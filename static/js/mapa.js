const map = L.map("map").setView([-14.2, -51.9], 4);

let regioesLayer = null;
let estadosLayer = null;
let dadosIdeb = [];

const estadosPorRegiao = {
    "1": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    "2": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    "3": ["ES", "MG", "RJ", "SP"],
    "4": ["PR", "RS", "SC"],
    "5": ["DF", "GO", "MT", "MS"]
};


fetch("/api/estados/media")
    .then(response => response.json())
    .then(data => {
        dadosIdeb = data;
        console.log(data);

    })
    .catch(error => {

        console.error(error);

    });

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

fetch("/static/geojson/regiao.json")
    .then(response => response.json())
    .then(data => {
        regioesLayer = L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: "#333",
                    weight: 1,
                    fillColor: "#4CAF50",
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on("click", function() {
                    const codarea = feature.properties.codarea;
                    mostrarEstados(codarea);
                });
            }
        }).addTo(map);
    })
    .catch(error => {

        console.error(
            "Erro ao carregar regiões:",
            error
        );

    });

function mostrarEstados(codarea) {
    if (dadosIdeb.length === 0) {
        console.log("Dados do IDEB ainda não carregaram.");
        return;
    }
    console.log("Região selecionada:", codarea);
    // Remove estados anteriores
    if (estadosLayer) {
        map.removeLayer(estadosLayer);
        estadosLayer = null;
    }

    // Estados da região selecionada
    const estados = estadosPorRegiao[codarea];

    fetch("/static/geojson/estados.json")
        .then(response => response.json())
        .then(data => {
            const estadosFiltrados = {
                type: "FeatureCollection",
                features: data.features.filter(
                    feature => {
                        const sigla =
                            feature.properties.sigla;
                        return estados.includes(sigla);
                    }
                )
            };
            estadosLayer = L.geoJSON(
                estadosFiltrados,
                {
                    style: function(feature) {
                        return {
                            color: "#333",
                            weight: 1,
                            fillColor: "#2196F3",
                            fillOpacity: 0.5
                        };
                    },
                    onEachFeature: function(feature, layer){
                        const sigla = feature.properties.sigla
                            
                        console.log("SIGLA DO GEOJSON:", sigla);
                        console.log("DADOS DA API:", dadosIdeb);

                        const dadosEstado = dadosIdeb.find(estado => estado.uf == sigla)

                        console.log("RESULTADO:", dadosEstado);

                        layer.bindPopup(`
                            <strong>
                                ${feature.properties.nome}
                            </strong>
                            <br>
                            UF:
                            ${sigla}
                            <br>
                            IDEB:
                            ${dadosEstado ? dadosEstado.media: "Sem dados"}
                        `);
                    }
                }
            ).addTo(map);

            map.fitBounds(
                estadosLayer.getBounds()
            );

        })

        .catch(error => {
            console.error(
                "Erro ao carregar estados:",
                error
            );
        });

}