
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

      opcao.addEventListener("click", async () => {
            municipioBusca.value = municipio.nome;
            municipioInput.value = municipio.codigo;

            listaMunicipios.classList.add("hidden");

            await carregarEscolas();
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


/* Select com pesquisa de escolas */
const escolaBusca = document.getElementById("escolaBusca");
const escolaInput = document.getElementById("escola");
const listaEscolas = document.getElementById("listaEscolas");

let escolas = [];

// Busca as escolas do município selecionado
async function carregarEscolas() {
    const codigoMunicipio = municipioInput.value;

    // Limpa os dados anteriores
    escolas = [];
    escolaBusca.value = "";
    escolaInput.value = "";
    listaEscolas.innerHTML = "";
    listaEscolas.classList.add("hidden");

    if (!codigoMunicipio) {
        escolaBusca.disabled = true;
        escolaBusca.placeholder = "Selecione um município primeiro";
        return;
    }

    escolaBusca.disabled = true;
    escolaBusca.placeholder = "Carregando escolas...";

    try {
        const resposta = await fetch(
            `/api/escolas_municipio/${codigoMunicipio}`
        );

        const conteudo = await resposta.text();

        let dados;

        try {
            dados = JSON.parse(conteudo);
        } catch {
            console.error("Resposta recebida do servidor:", conteudo);

            throw new Error(
                `A API retornou uma resposta que não é JSON. Status HTTP: ${resposta.status}`
            );
        }

        if (!resposta.ok) {
            throw new Error(
                dados.erro || "Erro ao carregar escolas."
            );
        }

            escolas = dados;

            escolaBusca.disabled = false;
            escolaBusca.placeholder = "Digite o nome da escola";

        } catch (erro) {
            console.error("Erro ao buscar escolas:", erro);
            escolaBusca.placeholder = "Não foi possível carregar as escolas";
        } finally {
            // Se falhar, mantém o campo desabilitado.
            if (escolas.length === 0) {
                escolaBusca.disabled = true;
            }
        }
    }

// Filtra as escolas enquanto o usuário digita
escolaBusca.addEventListener("input", () => {
    const pesquisa = escolaBusca.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    // O texto mudou: invalida a seleção anterior
    escolaInput.value = "";
    listaEscolas.innerHTML = "";

    if (!pesquisa) {
        listaEscolas.classList.add("hidden");
        return;
    }

    const filtradas = escolas.filter(escola =>
        escola.nome.toLocaleLowerCase("pt-BR").includes(pesquisa)
    );

    if (filtradas.length === 0) {
        listaEscolas.innerHTML = `
            <div class="px-3 py-2 text-sm text-on-surface-variant">
                Nenhuma escola encontrada.
            </div>
        `;

        listaEscolas.classList.remove("hidden");
        return;
    }

    filtradas.slice(0, 100).forEach(escola => {
        const opcao = document.createElement("button");

        opcao.type = "button";
        opcao.textContent = escola.nome;

        opcao.className =
            "block w-full text-left px-3 py-2 text-sm " +
            "hover:bg-surface-container focus:bg-surface-container";

        opcao.addEventListener("click", () => {
            escolaBusca.value = escola.nome;
            escolaInput.value = escola.codigo;

            listaEscolas.classList.add("hidden");
        });

        listaEscolas.appendChild(opcao);
    });

    listaEscolas.classList.remove("hidden");
});

// Fecha a lista ao clicar fora
document.addEventListener("click", evento => {
    if (
        !escolaBusca.contains(evento.target) &&
        !listaEscolas.contains(evento.target)
    ) {
        listaEscolas.classList.add("hidden");
    }
});

// Pesquisar 
const btnPesquisar = document.getElementById("btnPesquisar");

btnPesquisar.addEventListener("click", async () => {
    const codigoMunicipio = document.getElementById("municipio").value;
    const nomeMunicipio = document.getElementById("municipioBusca").value;
    const codigoEstado = document.getElementById("estado").value;    
    const codigoEscola = document.getElementById("escola").value;    

    

    // Valida os campos obrigatórios
    if (!codigoEstado || !codigoMunicipio || !codigoEscola) {
        alert("Selecione o estado, município e informe a escola."); 
        return;
    }
    
    // Carrega os dados da escola
    await carregarEscola(codigoEscola);

    // Carregar o grafico de linha da escola
    await carregarGraficoLinha(codigoEscola);
    
    // Carregar o grafico de barra(ideb) da escola
    await carregarGraficoBarraIdeb(codigoEscola);

    // Carregar o grafico de barra(ideb) da escola
    await carregarGraficoBarraSaeb(codigoEscola);
    
});

async function carregarEscola(codigoEscola){
    console.log(codigoEscola)
    try {
        const resposta_escola = await fetch(           
            `/api/escolas_cards/${codigoEscola}`
        );

        const dados = await resposta_escola.json();

        if (!resposta_escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }

        const nome_escola = document.getElementById("nome_escola")
        const codigo_escola = document.getElementById("codigo_escola")
        const rede_escola = document.getElementById("rede_escola")        

        nome_escola.textContent              = dados[0].nome        
        codigo_escola.textContent            = dados[0].codigo
        rede_escola.textContent              = dados[0].rede            

    } catch (erro) {
        console.error("Erro ao buscar dados da escola:", erro);        
    }        
}

// verifica grafico ja criado
let graficoLinha = null;

async function carregarGraficoLinha(codigoEscola){
    const ctx = document.getElementById('graficoLinha');
    const div = document.getElementById('divLinha');

    try {
        const resposta_escola = await fetch(           
            `/api/escola_linha/${codigoEscola}`
        );

        const dados = await resposta_escola.json();

        if (!resposta_escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }     
        
        const labels = dados.map(item => item.ano);
        const valores = dados.map(item => item.valor_ideb)


        div.classList.remove("hidden"); 
    
        if (graficoLinha) {        
            graficoLinha.data.labels = labels;
            graficoLinha.data.datasets[0].data = valores;
            graficoLinha.update();
        } else {
            graficoLinha = new Chart(ctx, {
                type: 'line',
                data: {
                labels: labels,
                datasets: [{
                    label: 'Valores nos anos do IDEB',
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
        console.error("Erro ao buscar dados da escola:", erro);        
    }         

}


// verifica grafico ja criado
let graficoBarraIdeb = null;

async function carregarGraficoBarraIdeb(codigoEscola){
    const ctx = document.getElementById('graficoBarraIdeb');
    const div = document.getElementById('divBarraIdeb');

    try {
        const resposta_escola = await fetch(           
            `/api/escola_barrasIdeb/${codigoEscola}`
        );

        const dados = await resposta_escola.json();

        if (!resposta_escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }     
        
        const labels        = dados.map(item => item.ano);
        const valores_ideb  = dados.map(item => item.valor_ideb)
        const valores_metas = dados.map(item => item.meta_ideb)

        div.classList.remove("hidden"); 
    
        if (graficoBarraIdeb) {        
            graficoBarraIdeb.data.labels = labels;
            graficoBarraIdeb.data.datasets[0].data = valores_ideb;
            graficoBarraIdeb.data.datasets[1].data = valores_metas;
            graficoBarraIdeb.update();
        } else {
            graficoBarraIdeb = new Chart(ctx, {
                type: 'bar',
                data: {
                labels: labels,
                datasets: [{
                    label: 'Valores nos anos do IDEB',
                    data: valores_ideb,
                    borderWidth: 1
                },
                {
                    label: 'Valores METAS IDEB',
                    data: valores_metas,
                    borderWidth: 1
                }],
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
        console.error("Erro ao buscar dados da escola:", erro);        
    }         

}


// verifica grafico ja criado
let graficoBarraSaeb = null;

async function carregarGraficoBarraSaeb(codigoEscola){
    const ctx = document.getElementById('graficoBarraSaeb');
    const div = document.getElementById('divBarraSaeb');

    try {
        const resposta_escola = await fetch(           
            `/api/escola_barrasSaeb/${codigoEscola}`
        );

        const dados = await resposta_escola.json();

        if (!resposta_escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }     
        
        const labels            = dados.map(item => item.ano);
        const portugues         = dados.map(item => item.portugues)
        const matematica        = dados.map(item => item.matematica)
        const media_padronizada = dados.map(item => item.media_padronizada)

        div.classList.remove("hidden"); 
    
        if (graficoBarraSaeb) {        
            graficoBarraSaeb.data.labels = labels;
            graficoBarraSaeb.data.datasets[0].data = matematica;
            graficoBarraSaeb.data.datasets[1].data = portugues;
            graficoBarraSaeb.data.datasets[2].data = media_padronizada;
            graficoBarraSaeb.update();
        } else {
            graficoBarraSaeb = new Chart(ctx, {
                type: 'bar',
                data: {
                labels: labels,
                datasets: [{
                    label: 'Matematica',
                    data: matematica,
                    borderWidth: 1
                },
                {
                    label: 'Portugues',
                    data: portugues,
                    borderWidth: 1
                },
                {
                    label: 'Media Padronizada',
                    data: media_padronizada,
                    borderWidth: 1
                }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                        beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'SAEB'
                        },
                    }
                }
            }); 
        }    

    } catch (erro) {
        console.error("Erro ao buscar dados da escola:", erro);        
    }         

}

function exportarGraficos() {

    const graficos = [
        {
            grafico: graficoLinha,
            nome: 'grafico_Linha.png'
        },
        {
            grafico: graficoBarraIdeb,
            nome: 'grafico_ideb_metas.png'
        },
        {
            grafico: graficoBarraSaeb,
            nome: 'grafico_saeb.png'
        }
    ];

    graficos.forEach((item, index) => {

        if (!item.grafico) {
            console.warn(`O gráfico ${item.nome} não foi criado.`);
            return;
        }

        const link = document.createElement('a');

        link.href = item.grafico.toBase64Image();
        link.download = item.nome;

        link.click();
    });
}

document.getElementById('btnExportarGraficos').addEventListener('click', exportarGraficos);
