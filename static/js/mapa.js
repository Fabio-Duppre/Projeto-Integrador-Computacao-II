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

/* RESTO DA municipios
        tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        "colors": {
                            "secondary-container": "#9af5c4",
                            "on-primary-fixed": "#001b3e",
                            "outline": "#727783",
                            "surface-bright": "#f8f9fa",
                            "primary": "#003f81",
                            "error-container": "#ffdad6",
                            "outline-variant": "#c2c6d4",
                            "surface-container-low": "#f3f4f5",
                            "surface-container-high": "#e7e8e9",
                            "surface-tint": "#145db3",
                            "tertiary-fixed-dim": "#bfc8d0",
                            "on-secondary-container": "#07734c",
                            "on-surface": "#191c1d",
                            "on-secondary": "#ffffff",
                            "on-secondary-fixed-variant": "#005234",
                            "on-tertiary-fixed": "#141d23",
                            "primary-fixed-dim": "#aac7ff",
                            "surface": "#f8f9fa",
                            "inverse-on-surface": "#f0f1f2",
                            "on-surface-variant": "#424752",
                            "inverse-primary": "#aac7ff",
                            "secondary-fixed-dim": "#7fd8a9",
                            "on-primary-container": "#b6cfff",
                            "secondary": "#006c47",
                            "on-secondary-fixed": "#002113",
                            "tertiary": "#394249",
                            "on-background": "#191c1d",
                            "on-error": "#ffffff",
                            "on-tertiary-fixed-variant": "#3f484f",
                            "tertiary-fixed": "#dbe4ed",
                            "primary-container": "#0056ac",
                            "error": "#ba1a1a",
                            "secondary-fixed": "#9af5c4",
                            "surface-variant": "#e1e3e4",
                            "on-tertiary-container": "#c6cfd8",
                            "tertiary-container": "#505961",
                            "surface-container-highest": "#e1e3e4",
                            "background": "#f8f9fa",
                            "surface-container": "#edeeef",
                            "on-primary-fixed-variant": "#00458d",
                            "on-primary": "#ffffff",
                            "primary-fixed": "#d6e3ff",
                            "surface-dim": "#d9dadb",
                            "on-tertiary": "#ffffff",
                            "surface-container-lowest": "#ffffff",
                            "inverse-surface": "#2e3132",
                            "on-error-container": "#93000a"
                        },

                        "borderRadius": {
                            "DEFAULT": "0.125rem",
                            "lg": "0.25rem",
                            "xl": "0.5rem",
                            "full": "0.75rem"
                        },

                        "spacing": {
                            "md": "24px",
                            "margin-desktop": "40px",
                            "xs": "8px",
                            "gutter": "24px",
                            "lg": "32px",
                            "sm": "16px",
                            "xl": "48px",
                            "margin-mobile": "16px",
                            "base": "4px"
                        },

                        "fontFamily": {
                            "headline-md": [
                                "Public Sans"
                            ],
                            "label-sm": [
                                "Public Sans"
                            ],
                            "label-md": [
                                "Public Sans"
                            ],
                            "body-lg": [
                                "Public Sans"
                            ],
                            "headline-sm": [
                                "Public Sans"
                            ],
                            "body-md": [
                                "Public Sans"
                            ],
                            "headline-lg": [
                                "Public Sans"
                            ],
                            "headline-lg-mobile": [
                                "Public Sans"
                            ],
                            "body-sm": [
                                "Public Sans"
                            ]
                        },

                        "fontSize": {
                            "headline-md": [
                                "24px",
                                {
                                    "lineHeight": "32px",
                                    "fontWeight": "600"
                                }
                            ],
                            "label-sm": [
                                "12px",
                                {
                                    "lineHeight": "16px",
                                    "fontWeight": "500"
                                }
                            ],
                            "label-md": [
                                "14px",
                                {
                                    "lineHeight": "16px",
                                    "letterSpacing": "0.01em",
                                    "fontWeight": "600"
                                }
                            ],
                            "body-lg": [
                                "18px",
                                {
                                    "lineHeight": "28px",
                                    "fontWeight": "400"
                                }
                            ],
                            "headline-sm": [
                                "20px",
                                {
                                    "lineHeight": "28px",
                                    "fontWeight": "600"
                                }
                            ],
                            "body-md": [
                                "16px",
                                {
                                    "lineHeight": "24px",
                                    "fontWeight": "400"
                                }
                            ],
                            "headline-lg": [
                                "32px",
                                {
                                    "lineHeight": "40px",
                                    "letterSpacing": "-0.02em",
                                    "fontWeight": "700"
                                }
                            ],
                            "headline-lg-mobile": [
                                "24px",
                                {
                                    "lineHeight": "32px",
                                    "fontWeight": "700"
                                }
                            ],
                            "body-sm": [
                                "14px",
                                {
                                    "lineHeight": "20px",
                                    "fontWeight": "400"
                                }
                            ]
                        }
                    },
                }
            }
*/