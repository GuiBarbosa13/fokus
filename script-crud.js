"use strict";
let estadoInicial = {
    tarefas: [
        {
            descricao: 'Tarefa concluída',
            concluida: true
        },
        {
            descricao: 'Tarefa pendente 1',
            concluida: false
        },
        {
            descricao: 'Tarefa pendente 2',
            concluida: false
        }
    ],
    tarefaSelecionada: null,
    editando: false,
};
const selecionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa });
};
const adicionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefas: [...estado.tarefas, tarefa] });
};
const deletar = (estado) => {
    if (estado.tarefaSelecionada) {
        const tarefas = estado.tarefas.filter(tarefa => tarefa != estado.tarefaSelecionada);
        return Object.assign(Object.assign({}, estado), { tarefas, tarefaSelecionada: null, editando: false });
    }
    else {
        return estado;
    }
};
const deletarTodas = (estado) => {
    return Object.assign(Object.assign({}, estado), { tarefas: [], tarefaSelecionada: null, editando: false });
};
const deletarConcluidas = (estado) => {
    const tarefas = estado.tarefas.filter(tarefa => !tarefa.concluida);
    return Object.assign(Object.assign({}, estado), { tarefas, tarefaSelecionada: null, editando: false });
};
const editarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { editando: !estado.editando, tarefaSelecionada: tarefa });
};
const atualizarUI = () => {
    const taskIconSvg = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
    </svg>
    `;
    const ulTarefas = document.querySelector(".app__section-task-list");
    const formAdicionarTarefa = document.querySelector('.app__form-add-task');
    const formAdicionarTarefaLabel = document.querySelector('.app__form-label');
    const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
    const textArea = document.querySelector('.app__form-textarea');
    const labelTarefaAtiva = document.querySelector('.app__section-active-task-description');
    const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
    const btnDeletar = document.querySelector('.app__form-footer__button--delete');
    const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas');
    const btnDeletarTodas = document.querySelector('#btn-remover-todas');
    labelTarefaAtiva.textContent = estadoInicial.tarefaSelecionada ? estadoInicial.tarefaSelecionada.descricao : null;
    if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
        formAdicionarTarefa.classList.remove('hidden');
        textArea.value = estadoInicial.tarefaSelecionada.descricao;
    }
    else {
        formAdicionarTarefa.classList.add('hidden');
        textArea.value = "";
    }
    if (ulTarefas) {
        ulTarefas.innerHTML = "";
    }
    if (!btnAdicionarTarefa) {
        throw Error("Não foi possível localizar o elemento do botão no HTML");
    }
    btnAdicionarTarefa.onclick = () => {
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle('hidden');
        formAdicionarTarefaLabel.innerText = "Adicionando tarefa";
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.reset();
    };
    formAdicionarTarefa.onsubmit = (evento) => {
        evento.preventDefault();
        if (estadoInicial.editando) {
            estadoInicial.tarefaSelecionada.descricao = textArea.value;
            estadoInicial.tarefaSelecionada = null;
            atualizarUI();
            formAdicionarTarefa.classList.toggle('hidden');
            estadoInicial.editando = false;
        }
        else {
            const descricao = textArea.value;
            estadoInicial = adicionarTarefa(estadoInicial, {
                descricao,
                concluida: false
            });
            estadoInicial.tarefaSelecionada = null;
        }
        if (estadoInicial.tarefaSelecionada) {
            return Object.assign(Object.assign({}, estadoInicial), { tarefaSelecionada: null });
        }
        atualizarUI();
        formAdicionarTarefa.reset();
    };
    btnCancelar.onclick = () => {
        formAdicionarTarefa.classList.add('hidden');
    };
    btnDeletar.onclick = () => {
        estadoInicial = deletar(estadoInicial);
        formAdicionarTarefa.classList.add('hidden');
        atualizarUI();
    };
    btnDeletarConcluidas.onclick = () => {
        estadoInicial = deletarConcluidas(estadoInicial);
        atualizarUI();
    };
    btnDeletarTodas.onclick = () => {
        estadoInicial = deletarTodas(estadoInicial);
        atualizarUI();
    };
    estadoInicial.tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        const svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;
        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = tarefa.descricao;
        const button = document.createElement('button');
        button.classList.add('app_button-edit');
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', '/imagens/edit.png');
        button.appendChild(editIcon);
        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        if (tarefa === estadoInicial.tarefaSelecionada) {
            li.classList.add('app__section-task-list-item-active');
        }
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        if (!tarefa.concluida) {
            li.appendChild(button);
        }
        if (!tarefa.concluida) {
            li.addEventListener('click', () => {
                estadoInicial = selecionarTarefa(estadoInicial, tarefa);
                atualizarUI();
            });
        }
        if (!tarefa.concluida) {
            editIcon.onclick = (evento) => {
                evento.stopPropagation();
                estadoInicial = editarTarefa(estadoInicial, tarefa);
                formAdicionarTarefaLabel.innerText = 'Editando tarefa';
                atualizarUI();
            };
        }
        ulTarefas === null || ulTarefas === void 0 ? void 0 : ulTarefas.appendChild(li);
    });
};
document.addEventListener('TarefaFinalizada', () => {
    if (estadoInicial.tarefaSelecionada) {
        estadoInicial.tarefaSelecionada.concluida = true;
        estadoInicial.tarefaSelecionada = null;
        atualizarUI();
    }
});
atualizarUI();
