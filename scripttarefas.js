// 1. Selecionar os elementos do HTML
const inputTarefa = document.getElementById('nova-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const elementoContador = document.querySelector('#contador span');

// 2. Buscar tarefas já salvas no LocalStorage ou iniciar um array vazio
let tarefas = JSON.parse(localStorage.getItem('minhas_tarefas')) || [];

// 3. Função para desenhar as tarefas na tela
function renderizarTarefas() {
    // Limpa a lista antes de desenhar para não duplicar
    listaTarefas.innerHTML = '';
    
    let pendentes = 0;

    tarefas.forEach((tarefa, posicao) => {
        const novaLi = document.createElement('li');
        novaLi.innerText = tarefa.texto;

        // Se a tarefa estiver concluída no banco, adiciona a classe CSS
        if (tarefa.concluida) {
            novaLi.classList.add('concluida');
        } else {
            pendentes++; // Só soma se não estiver concluída
        }

        // Evento: Clicar na tarefa altera o estado de concluída
        novaLi.onclick = function(evento) {
            // Evita que o clique no botão de deletar ative a conclusão da tarefa
            if (evento.target.tagName !== 'BUTTON') {
                tarefas[posicao].concluida = !tarefas[posicao].concluida;
                salvarEAtualizar();
            }
        };

        // Criar o botão de deletar (X)
        const btnDeletar = document.createElement('button');
        btnDeletar.innerText = 'X';
        btnDeletar.onclick = function() {
            tarefas.splice(posicao, 1); // Remove o item do Array
            salvarEAtualizar();
        };

        // Monta a estrutura final
        novaLi.appendChild(btnDeletar);
        listaTarefas.appendChild(novaLi);
    });

    // Atualiza o número do contador
    elementoContador.innerText = pendentes;
}

// 4. Salva o estado atual do Array no navegador e redesenha a tela
function salvarEAtualizar() {
    localStorage.setItem('minhas_tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
}

// 5. Função para adicionar uma nova tarefa ao Array
function adicionarTarefa() {
    const textoTarefa = inputTarefa.value.trim();

    if (textoTarefa === "") {
        alert("Por favor, digite alguma tarefa!");
        return;
    }

    tarefas.push({
        texto: textoTarefa,
        concluida: false
    });

    inputTarefa.value = "";
    inputTarefa.focus();

    salvarEAtualizar();
}

// 6. Configurar os ouvintes de eventos (Cliques e Teclado)
btnAdicionar.addEventListener('click', adicionarTarefa);

inputTarefa.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});

// 7. Executa assim que a página abre para carregar os dados salvos
renderizarTarefas();