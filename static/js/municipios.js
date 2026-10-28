// verifica grafico ja criado
let graficoMunicipio = null;

/* select com pesquisa */ 
const estadoSelect = document.getElementById("estado");
const municipioBusca = document.getElementById("municipioBusca");
const municipioInput = document.getElementById("municipio");
const listaMunicipios = document.getElementById("listaMunicipios");

let municipios = [];

// Busca os municípios quando o estado é alterado
estadoSelect.addEventListener("change", async () => {
    const codigoEstado = estadoSelect.value;

    // Limpa a seleção anterior
    municipios = [];
    municipioBusca.value = "";
    municipioInput.value = "";
    listaMunicipios.innerHTML = "";
    listaMunicipios.classList.add("hidden");

    if (!codigoEstado) {
        municipioBusca.disabled = true;
        municipioBusca.placeholder = "Selecione um Estado primeiro";
        return;
    }

    municipioBusca.disabled = true;
    municipioBusca.placeholder = "Carregando municípios...";

    try {
        const resposta = await fetch(
            `/api/municipios_estado/${codigoEstado}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao carregar municípios.");
        }

        municipios = dados;

        municipioBusca.disabled = false;
        municipioBusca.placeholder = "Digite o nome do município";

    } catch (erro) {
        console.error("Erro ao buscar municípios:", erro);
        municipioBusca.placeholder = "Não foi possível carregar os municípios";
    }
});

// Filtra os municípios conforme o usuário digita
municipioBusca.addEventListener("input", () => {
    const pesquisa = municipioBusca.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    municipioInput.value = "";

    listaMunicipios.innerHTML = "";

    if (!pesquisa) {
        listaMunicipios.classList.add("hidden");
        return;
    }

    const filtrados = municipios.filter((municipio) =>
        municipio.nome.toLocaleLowerCase("pt-BR").includes(pesquisa)
    );

    if (filtrados.length === 0) {
        listaMunicipios.innerHTML = `
            <div class="px-3 py-2 text-sm text-on-surface-variant">
                Nenhum município encontrado.
            </div>
        `;

        listaMunicipios.classList.remove("hidden");
        return;
    }

    filtrados.slice(0, 100).forEach((municipio) => {
        const opcao = document.createElement("button");

        opcao.type = "button";
        opcao.textContent = municipio.nome;

        opcao.className =
            "block w-full text-left px-3 py-2 text-sm " +
            "hover:bg-surface-container focus:bg-surface-container";

        opcao.addEventListener("click", () => {
            municipioBusca.value = municipio.nome;
            municipioInput.value = municipio.codigo;

            listaMunicipios.classList.add("hidden");
        });

        listaMunicipios.appendChild(opcao);
    });

    listaMunicipios.classList.remove("hidden");
});

// Fecha a lista quando o usuário clica fora dela
document.addEventListener("click", (evento) => {
    if (
        !municipioBusca.contains(evento.target) &&
        !listaMunicipios.contains(evento.target)
    ) {
        listaMunicipios.classList.add("hidden");
    }
});

// Pesquisar 

const btnPesquisar = document.getElementById("btnPesquisar");

btnPesquisar.addEventListener("click", async () => {
    const codigoMunicipio = document.getElementById("municipio").value;
    const nomeMunicipio = document.getElementById("municipioBusca").value;
    const codigoEstado = document.getElementById("estado").value;
    const ano = document.getElementById("ano").value;

    // Valida os campos obrigatórios
    if (!codigoEstado || !ano || !codigoMunicipio) {
        alert("Selecione o estado, informe o ano e selecione um município.");
        return;
    }
    // Carrega a silhueta do município
    await carregarSilhuetaMunicipio(codigoMunicipio, nomeMunicipio);

    // Carrega os dados do municipio
    await carregarMunicipio(codigoMunicipio);

    // Carregar o grafico do municipio
    await carregarChart(codigoMunicipio);
});


async function carregarSilhuetaMunicipio(codigoIbge, nomeMunicipio) {
    const mapa = document.getElementById("mapaMunicipio");

    mapa.innerHTML = `
        <p class="text-sm text-on-surface-variant">
            Carregando contorno do município...
        </p>
    `;

    const url = `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${codigoIbge}`;

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar a malha do IBGE.");
        }

        const svg = await resposta.text();

        const conteudo = document.createElement("div");
        conteudo.className =
            "w-full h-full flex flex-col items-center justify-center gap-2";

        const titulo = document.createElement("h4");
        titulo.className = "text-sm font-medium text-on-surface";
        titulo.textContent = nomeMunicipio;

        const areaSvg = document.createElement("div");
        areaSvg.className =
            "w-full flex-1 flex items-center justify-center";

        // Insere o SVG recebido da API
        areaSvg.innerHTML = svg;

        const desenho = areaSvg.querySelector("svg");

        if (!desenho) {
            throw new Error("A resposta do IBGE não contém um SVG válido.");
        }

        desenho.style.width = "100%";
        desenho.style.height = "180px";
        desenho.style.maxWidth = "100%";
        desenho.style.fill = "#000000";

        conteudo.append(titulo, areaSvg);
        mapa.replaceChildren(conteudo);

    } catch (erro) {
        console.error("Erro ao carregar a malha do IBGE:", erro);

        mapa.innerHTML = `
            <p class="text-sm text-error text-center">
                Não foi possível carregar o contorno deste município.
            </p>
        `;
    }
}

async function carregarMunicipio(codigoIbge){
    try {
        const resposta_municipios = await fetch(           
            `/api/municipios_cards/${codigoIbge}`
        );

        const dados = await resposta_municipios.json();

        if (!resposta_municipios.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados do município.");
        }

        const nome_municipio = document.getElementById("nome_municipio")
        const uf_municipio = document.getElementById("uf_municipio")
        const codigo_municipio = document.getElementById("codigo_municipio")
        const numero_escolas = document.getElementById("numero_escolas")
        const media_escolas = document.getElementById("media_escolas")        

        nome_municipio.textContent              = dados[0].nome
        uf_municipio.textContent                = dados[0].uf
        codigo_municipio.textContent            = dados[0].codigo
        numero_escolas.textContent              = dados[0].numero_escolas
        media_escolas.textContent               = dados[0].media             

    } catch (erro) {
        console.error("Erro ao buscar dados do município:", erro);        
    }        
}

async function carregarChart(codigoMunicipio){
    const ctx = document.getElementById('chartMunicipio');
    const div = document.getElementById('divChart');

    try {
        const resposta_municipios = await fetch(           
            `/api/anos_municipios_ideb/${codigoMunicipio}`
        );

        const dados = await resposta_municipios.json();

        if (!resposta_municipios.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados do município.");
        }     
        
        const labels = dados.map(item => item.ano);
        const valores = dados.map(item => item.ano_valor)


        div.classList.remove("hidden"); 
    
        if (graficoMunicipio) {        
            graficoMunicipio.data.labels = labels;
            graficoMunicipio.data.datasets[0].data = valores;
            graficoMunicipio.update();
        } else {
            graficoMunicipio = new Chart(ctx, {
                type: 'line',
                data: {
                labels: labels,
                datasets: [{
                    label: 'Média dos anos do Município',
                    data: valores,
                    borderWidth: 1
                }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                        beginAtZero: true
                        }
                    }
                }
            }); 
        }    

    } catch (erro) {
        console.error("Erro ao buscar dados do município:", erro);        
    }         
}

// Baixar o gráfico
document.getElementById('btnBaixarGrafico').addEventListener('click', () => {
    if (!graficoMunicipio) {
        alert('Realize uma pesquisa antes de baixar o gráfico.');
        return;
    }

    const link = document.createElement('a');

    link.href = graficoMunicipio.toBase64Image('image/png', 1);
    link.download = 'grafico-ideb-municipio.png';

    link.click();
});






