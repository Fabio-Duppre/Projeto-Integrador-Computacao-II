async function AtualizarDados(escolas){    
    // Carrega os dados da escola
    await carregarGraficoLinha(escolas);

    // Carregar o grafico de 'pizza' das medias padronizadas das escolas
    await carregargraficoDoughnut(escolas);
    
    // Carregar o grafico de barra(saeb) das escolas
    await carregarGraficosBarras(escolas);

    // Carregar a barra de metas das escolas
    await carregarMetas(escolas);
}


// verifica grafico ja criado
let graficoLinha = null;

async function carregarGraficoLinha(escolas){
    const ctx = document.getElementById('graficoLinha');
    const div = document.getElementById('divLinha');
    var dados = [];
    var escola;
    const labels = ['2005','2007','2009','2011','2013','2015','2017','2019','2021','2023','2025']
    var datasets = []

    try {    
        if (escolas[0]){
            escola = await fetch(`api/escola_linha/${escolas[0].codigo}`);            
            dados.push(await escola.json());
        }

        if (escolas[1]){
            escola = await fetch(`api/escola_linha/${escolas[1].codigo}`);
            dados.push(await escola.json());

        }

        if (escolas[2]){
            escola = await fetch(`api/escola_linha/${escolas[2].codigo}`);
            dados.push(await escola.json());

        }       

        if (!escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }    
        
        if (dados[0]){            
            datasets.push({
                label:escolas[0].nome,
                data:dados[0].map(item => item.valor_ideb),
                borderWidth: 1
            });

        }

        if (dados[1]){
            datasets.push({
                label:escolas[1].nome,
                data:dados[1].map(item => item.valor_ideb),
                borderWidth: 1
            });
        }

        if (dados[2]){
            datasets.push({
                label:escolas[2].nome,
                data:dados[2].map(item => item.valor_ideb),
                borderWidth: 1
            });

        }  
                       
        div.classList.remove("hidden"); 
    
        if (graficoLinha) {        
            graficoLinha.data.labels = labels;
            graficoLinha.data.datasets = datasets;
            graficoLinha.update();
        } else {
            graficoLinha = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets,                
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
let graficoDoughnut = null;

async function carregargraficoDoughnut(escolas){
    const ctx = document.getElementById('graficoDoughnut');
    const div = document.getElementById('divDoughnut');
    var dados = [];
    var escola;    
    var datasets = []

    try {    
        if (escolas[0]){
            escola = await fetch(`api/escola_MediaSaeb/${escolas[0].codigo}`);            
            dados.push(await escola.json());
        }

        if (escolas[1]){
            escola = await fetch(`api/escola_MediaSaeb/${escolas[1].codigo}`);
            dados.push(await escola.json());

        }

        if (escolas[2]){
            escola = await fetch(`api/escola_MediaSaeb/${escolas[2].codigo}`);
            dados.push(await escola.json());

        }       

        if (!escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }    
        
        if (dados[0]){            
            datasets.push({
                label:escolas[0].nome,
                data:dados[0].map(item => item.media_padronizada),
                borderWidth: 1
            });

        }

        if (dados[1]){
            datasets.push({
                label:escolas[1].nome,
                data:dados[1].map(item => item.media_padronizada),
                borderWidth: 1
            });
        }

        if (dados[2]){
            datasets.push({
                label:escolas[2].nome,
                data:dados[2].map(item => item.media_padronizada),
                borderWidth: 1
            });
            

        }  
                       
        div.classList.remove("hidden"); 
    
        if (graficoDoughnut) {                    
            graficoDoughnut.data.datasets = datasets;
            graficoDoughnut.update();
        } else {
            graficoDoughnut = new Chart(ctx, {
                type: 'pie',
                data: {                                      
                    datasets: datasets,                
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    plugins: {
                        legend: {
    position: 'top',
    labels: {
        generateLabels: function (chart) {
            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);

            return labels.map((label, indice) => {
                // Busca o nome no dataset
                const nome = chart.data.datasets[0].labels?.[indice] ?? label.text ?? "";

                label.text = nome.length > 20
                    ? nome.substring(0, 20) + "..."
                    : nome;

                return label;
            });
        }
    }
},
                        title: {
                            display: true,
                            text: 'Média padronizada SAEB 2025'
                        },
                        tooltip: {
                            callbacks: {
                                title: function (context) {
                                    return context[0].label;
                                },
                                label: function (context) {
                                    return `Valor: ${context.formattedValue}`;
                                }
                            }
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
let graficosBarrasPortugues = null;
let graficosBarrasMatematica = null;

async function carregarGraficosBarras(escolas){
    const ctx = document.getElementById('graficoBarraPortugues');
    const div = document.getElementById('divPortugues');

    const ctx1 = document.getElementById('graficoBarraMatematica');
    const div1 = document.getElementById('divMatematica');

    var dados = [];
    var escola
    var portugues = [];
    var matematica = [];
    const labels = ['2005','2007','2009','2011','2013','2015','2017','2019','2021','2023','2025']    

    try {    
        if (escolas[0]){
            escola = await fetch(`/api/escola_barrasSaeb/${escolas[0].codigo}`);            
            dados.push(await escola.json());
        }

        if (escolas[1]){
            escola = await fetch(`/api/escola_barrasSaeb/${escolas[1].codigo}`);
            dados.push(await escola.json());

        }

        if (escolas[2]){
            escola = await fetch(`/api/escola_barrasSaeb/${escolas[2].codigo}`);
            dados.push(await escola.json());

        }       

        if (!escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }    
        
        if (dados[0]){            
            portugues.push({
                label:escolas[0].nome,
                data:dados[0].map(item => item.portugues),
                borderWidth: 1
            });
        
            matematica.push({
                label:escolas[0].nome,
                data:dados[0].map(item => item.matematica),
                borderWidth: 1
            });

        }

        if (dados[1]){
            portugues.push({
                label:escolas[1].nome,
                data:dados[1].map(item => item.portugues),
                borderWidth: 1
            });
        
            matematica.push({
                label:escolas[1].nome,
                data:dados[1].map(item => item.matematica),
                borderWidth: 1
            });
        }

        if (dados[2]){
            portugues.push({
                label:escolas[2].nome,
                data:dados[2].map(item => item.portugues),
                borderWidth: 1
            });
        
            matematica.push({
                label:escolas[2].nome,
                data:dados[2].map(item => item.matematica),
                borderWidth: 1
            });

        }  

        //Portugues
                       
        div.classList.remove("hidden"); 
    
        if (graficosBarrasPortugues) {        
            graficosBarrasPortugues.data.labels = labels;
            graficosBarrasPortugues.data.portugues = portugues;
            graficosBarrasPortugues.update();
        } else {
            graficosBarrasPortugues = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: portugues,                
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


        // Matemtatica
        div1.classList.remove("hidden"); 
    
        if (graficosBarrasMatematica) {        
            graficosBarrasMatemtatica.data.labels = labels;
            graficosBarrasMatemtatica.data.matematica = matematica;
            graficosBarrasMatemtatica.update();
        } else {
            graficosBarrasMatemtatica = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: matematica,                
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

async function carregarMetas(escolas){
    var dados = [];
    var escola;   
    let div    
    let nome
    let meta
    let resultado
    let textoMeta
    let textoResultado
    

    try {    
        if (escolas[0]){
            escola = await fetch(`/api/escola_barrasIdeb/${escolas[0].codigo}`);            
            dados.push(await escola.json());
        }

        if (escolas[1]){
            escola = await fetch(`/api/escola_barrasIdeb/${escolas[1].codigo}`);
            dados.push(await escola.json());

        }

        if (escolas[2]){
            escola = await fetch(`/api/escola_barrasIdeb/${escolas[2].codigo}`);
            dados.push(await escola.json());

        }       

        if (!escola.ok) {
            throw new Error(dados.erro || "Erro ao carregar dados da escola.");
        }    
        
        if (dados[0]){            
            div             = document.getElementById("divMeta1");
            nome            = document.getElementById("nomeMeta1");
            meta            = document.getElementById("meta1")
            resultado       = document.getElementById("resultado1")
            textoMeta       = document.getElementById("textoMeta1")
            textoResultado  = document.getElementById("textoResultado1")

            div.classList.remove("hidden");
            nome.textContent            = escolas[0].nome
            meta.style.width            = parseInt(dados[0][10].meta_ideb) * 10
            resultado.style.width       = parseInt(dados[0][10].valor_ideb) * 10
            textoMeta.innerHTML         = `Meta: <strong>${dados[0][10].meta_ideb}</strong>`;
            textoResultado.innerHTML    = `Resultado: ${dados[0][10].valor_ideb}`;


        }

        if (dados[1]){
            div             = document.getElementById("divMeta2");
            nome            = document.getElementById("nomeMeta2");
            meta            = document.getElementById("meta2")
            resultado       = document.getElementById("resultado2")
            textoMeta       = document.getElementById("textoMeta2")
            textoResultado  = document.getElementById("textoResultado2")

            div.classList.remove("hidden");
            nome.textContent            = escolas[1].nome
            meta.style.width            = parseInt(dados[1][10].meta_ideb) * 10
            resultado.style.width       = parseInt(dados[1][10].valor_ideb) * 10
            textoMeta.innerHTML         = `Meta: <strong>${dados[1][10].meta_ideb}</strong>`;
           textoResultado.innerHTML    = `Resultado: ${dados[1][10].valor_ideb}`;
        }

        if (dados[2]){
            div             = document.getElementById("divMeta3");
            nome            = document.getElementById("nomeMeta3");
            meta            = document.getElementById("meta3")
            resultado       = document.getElementById("resultado3")
            textoMeta       = document.getElementById("textoMeta3")
            textoResultado  = document.getElementById("textoResultado3")

            div.classList.remove("hidden");
            nome.textContent            = escolas[2].nome
            meta.style.width            = parseInt(dados[2][10].meta_ideb) * 10
            resultado.style.width       = parseInt(dados[2][10].valor_ideb) * 10
            textoMeta.innerHTML         = `Meta: <strong>${dados[2][10].meta_ideb}</strong>`;
            textoResultado.innerHTML    = `Resultado: ${dados[2][10].valor_ideb}`;            
        }  

    } catch (erro) {
        console.error("Erro ao buscar dados da escola:", erro);        
    }              

}
