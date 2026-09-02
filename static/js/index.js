const map = L.map("map").setView([-14.2, -51.9], 4);
const estadosPorRegiao = {
    "1": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    "2": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    "3": ["ES", "MG", "RJ", "SP"],
    "4": ["PR", "RS", "SC"],
    "5": ["DF", "GO", "MT", "MS"]
};


let regioesLayer = null;
let estadosLayer = null;
let dadosIdeb = [];

fetch("/api/estados/media")
    .then(response => response.json())
    .then(data => {
        dadosIdeb = data;
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
                        const dadosEstado = dadosIdeb.find(estado => estado.uf == sigla)                    

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

/*
    Grafico
*/    
let centro_oeste
let norte
let sul
let nordeste
let sudeste

    fetch("/api/estados/media").then(response => response.json()).then(data =>{
        norte = (data[0].media + data[2].media + data[3].media + data[13].media + data[20].media + data[21].media + data[26].media)/7
        nordeste = (data[1].media + data[4].media + data[5].media + data[9].media + data[14].media + data[15].media + data[16].media + data[19].media + data[24].media)/9
        sudeste = (data[7].media + data[10].media + data[25].media + data[18].media)/4
        sul = (data[17].media + data[23].media + data[22].media)/3
        centro_oeste = (data[6].media + data[8].media + data[12].media + data[11].media)/4        

        const ctx = document.getElementById('indexChart');            
        new Chart(ctx, {
            type: 'bar',
            data: {
            labels: ['Norte', 'Nordeste', 'Suldeste', 'Sul', 'Centro Oeste'],
            datasets: [{
                label: 'Média do Resultado do SAEB',
                data: [norte, nordeste, sudeste, sul, centro_oeste],
                borderWidth: 1
            }]
            },
            options: {
                indexAxis: 'y',

                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });


    })
    .catch(error => {
        console.error(error);
    });

