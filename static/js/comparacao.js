
/* select com pesquisa */ 
const estadoSelect = document.getElementById("estado");
const municipioBusca = document.getElementById("municipioBusca");
const municipioInput = document.getElementById("municipio");
const listaMunicipios = document.getElementById("listaMunicipios");

// Escolas escolhidas para a comparação
let escolasSelecionadas = [];

// Limite máximo de escolas
const LIMITE_ESCOLAS = 3;

// Elementos da interface
const containerEscolasSelecionadas = document.getElementById(
    "escolasSelecionadas"
);

const contadorEscolas = document.getElementById(
    "contadorEscolas"
);

const btnAtualizarDados = document.getElementById(
    "btnAtualizarDados"
);

const mensagemComparacao = document.getElementById(
    "mensagemComparacao"
);

function adicionarEscola(escola) {

    // Impede adicionar a mesma escola duas vezes
    const jaSelecionada = escolasSelecionadas.some(
        selecionada =>
            String(selecionada.codigo) === String(escola.codigo)
    );

    if (jaSelecionada) {
        mostrarMensagem(
            "Essa escola já está na lista de comparação."
        );
        return;
    }

    // Verifica o limite de escolas
    if (escolasSelecionadas.length >= LIMITE_ESCOLAS) {
        mostrarMensagem(
            "Você pode comparar no máximo 3 escolas."
        );
        return;
    }

    // Adiciona a escola à lista
    escolasSelecionadas.push(escola);

    // Atualiza a interface
    renderizarEscolasSelecionadas();
    atualizarEstadoBotao();

    mostrarMensagem("");
}

function renderizarEscolasSelecionadas() {

    containerEscolasSelecionadas.innerHTML = "";

    const cores = [
        "bg-primary",
        "bg-secondary",
        "bg-tertiary"
    ];

    escolasSelecionadas.forEach((escola, indice) => {

        const chip = document.createElement("div");

        chip.className =
            "flex items-center gap-xs bg-surface border " +
            "border-outline-variant rounded-full pl-2 pr-1 py-1";

        const indicador = document.createElement("div");

        indicador.className =
            `w-3 h-3 rounded-full ${cores[indice]}`;

        const nome = document.createElement("span");

        nome.className =
            "font-label-sm text-on-surface";

        nome.textContent = escola.nome;

        const botaoRemover = document.createElement("button");

        botaoRemover.type = "button";

        botaoRemover.className =
            "text-on-surface-variant hover:text-error " +
            "transition-colors rounded-full p-1";

        botaoRemover.setAttribute(
            "aria-label",
            `Remover ${escola.nome} da comparação`
        );

        botaoRemover.innerHTML = `
            <span class="material-symbols-outlined text-[16px]">
                close
            </span>
        `;

        botaoRemover.addEventListener("click", () => {
            removerEscola(escola.codigo);
        });

        chip.append(
            indicador,
            nome,
            botaoRemover
        );

        containerEscolasSelecionadas.appendChild(chip);
    });

    contadorEscolas.textContent =
        `${escolasSelecionadas.length} de ${LIMITE_ESCOLAS} escolas selecionadas`;
}

function removerEscola(codigoEscola) {

    escolasSelecionadas = escolasSelecionadas.filter(
        escola =>
            String(escola.codigo) !== String(codigoEscola)
    );

    renderizarEscolasSelecionadas();
    atualizarEstadoBotao();

    mostrarMensagem("");
}

function atualizarEstadoBotao() {

    btnAtualizarDados.disabled =
        escolasSelecionadas.length < 2;
}

function mostrarMensagem(texto) {

    mensagemComparacao.textContent = texto;

    mensagemComparacao.classList.toggle(
        "hidden",
        !texto
    );
}



let municipios = [];

// Busca os municípios quando o estado é alterado
estadoSelect.addEventListener("change", async () => {
    const codigoEstado = estadoSelect.value;

    // Limpa a seleção atual de escola
    escolaBusca.value = "";
    escolaInput.value = "";
    escolaBusca.disabled = true;
    escolaBusca.placeholder = "Selecione um município primeiro";

    escolas = [];
    listaEscolas.innerHTML = "";
    listaEscolas.classList.add("hidden");

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

            mostrarMensagem("");
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

btnPesquisar.addEventListener("click", () => {

    const codigoEstado = estadoSelect.value;
    const codigoMunicipio = municipioInput.value;
    const codigoEscola = escolaInput.value;

    const nomeMunicipio = municipioBusca.value;
    const nomeEstado =
        estadoSelect.options[estadoSelect.selectedIndex]?.textContent.trim();

    const nomeEscola = escolaBusca.value;

    // Valida os filtros
    if (
        !codigoEstado ||
        !codigoMunicipio ||
        !codigoEscola ||
        !nomeEscola.trim()
    ) {
        mostrarMensagem(
            "Selecione o estado, o município e uma escola."
        );
        return;
    }

    // Valida se a escola já está selecionada
    const jaSelecionada = escolasSelecionadas.some(
        escola =>
            String(escola.codigo) === String(codigoEscola)
    );

    if (jaSelecionada) {
        mostrarMensagem(
            "Essa escola já está na lista de comparação."
        );
        return;
    }

    // Adiciona a escola
    adicionarEscola({
        codigo: codigoEscola,
        nome: nomeEscola,
        municipio: nomeMunicipio,
        estado: nomeEstado
    });

    // Limpa apenas a seleção atual do campo de escola
    escolaBusca.value = "";
    escolaInput.value = "";

    mostrarMensagem("");
});

btnAtualizarDados.addEventListener("click", () => {
    AtualizarDados(escolasSelecionadas);
});


