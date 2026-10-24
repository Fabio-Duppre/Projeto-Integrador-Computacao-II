async function AtualizarDados(escolas){
    if (escolas[0]){
        console.log(escolas[0].codigo)

    }

    if (escolas[1]){
        console.log("Escola 1")
    }

    if (escolas[2]){
        console.log("Escola 2")
    }

    
    // Carrega os dados da escola
    await carregarGraficoLinha(escolas);

    // Carregar o grafico de linha da escola
    await carregargraficoDoughnut(escolas);
/*    
    // Carregar o grafico de barra(ideb) da escola
    await carregarGraficoBarraIdeb(codigoEscola);

    // Carregar o grafico de barra(ideb) da escola
    await carregarGraficoBarraSaeb(codigoEscola);*/
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

        console.log("AQUI")
        console.log(dados)
        console.log(datasets[0].data)
                       
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

