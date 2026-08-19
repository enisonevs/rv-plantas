// ==========================================
// CESTA
// ==========================================

let cesta = {};


// ==========================================
// QUANTIDADES SELECIONADAS NOS PRODUTOS
// ==========================================

let quantidades = {
    camomila: 0,
    hibisco: 0,
    espinheira: 0,
    arruda: 0,
    cavalinha: 0,
    "unha-gato": 0,
    uxi: 0,
    "dente-leao": 0,
    "ipe-roxo": 0,
    carapanauba: 0
};


// ==========================================
// ALTERAR QUANTIDADE
// ==========================================

function alterarQuantidade(produto, valor) {

    quantidades[produto] += valor;

    if (quantidades[produto] < 0) {
        quantidades[produto] = 0;
    }

    atualizarCampo(produto);
}


// ==========================================
// ATUALIZAR CAMPO
// ==========================================

function atualizarCampo(produto) {

    const campo = document.getElementById(
        "quantidade-" + produto
    );

    campo.value = quantidades[produto];
}


// ==========================================
// CORRIGIR QUANTIDADE DIGITADA
// ==========================================

function corrigirQuantidade(produto) {

    const campo = document.getElementById(
        "quantidade-" + produto
    );

    let valor = parseInt(campo.value);


    // Se não for número

    if (isNaN(valor) || valor < 0) {
        valor = 0;
    }


    // Apenas números inteiros

    valor = Math.floor(valor);


    quantidades[produto] = valor;

    campo.value = valor;
}


// ==========================================
// ADICIONAR TODOS OS SELECIONADOS
// ==========================================

function adicionarSelecionados() {

    let adicionou = false;


    // Percorre todos os produtos

    for (const id in quantidades) {

        const quantidade = quantidades[id];


        // Só adiciona se for maior que zero

        if (quantidade > 0) {

            adicionou = true;


            // Informações do produto

            const produtos = {

                camomila: {
                    nome: "Camomila 20g",
                    preco: 3
                },

                hibisco: {
                    nome: "Hibisco 30g",
                    preco: 3
                },

                espinheira: {
                    nome: "Espinheira-santa 30g",
                    preco: 3
                },

                arruda: {
                    nome: "Arruda 20g",
                    preco: 3
                },

                cavalinha: {
                    nome: "Cavalinha 20g",
                    preco: 3
                },

                "unha-gato": {
                    nome: "Unha-de-gato 20g",
                    preco: 3
                },

                uxi: {
                    nome: "Uxi amarelo 50g",
                    preco: 3
                },

                "dente-leao": {
                    nome: "Dente-de-leão 20g",
                    preco: 3
                },

                "ipe-roxo": {
                    nome: "Ipê-roxo 50g",
                    preco: 3
                },

                carapanauba: {
                    nome: "Carapanaúba 50g",
                    preco: 3
                }

            };


            const produto = produtos[id];


            // Se já existe na cesta, soma

            if (cesta[id]) {

                cesta[id].quantidade += quantidade;

            } else {

                cesta[id] = {

                    nome: produto.nome,

                    preco: produto.preco,

                    quantidade: quantidade

                };

            }


            // Zera a quantidade selecionada

            quantidades[id] = 0;

            atualizarCampo(id);
        }
    }


    // Atualiza contador e valores

    atualizarCesta();


    // IMPORTANTE:
    // Não abre a cesta automaticamente

    if (adicionou) {

        mostrarMensagem(
            "Produtos adicionados à cesta!"
        );

    } else {

        mostrarMensagem(
            "Selecione pelo menos um produto."
        );

    }
}


// ==========================================
// ATUALIZAR CESTA
// ==========================================

function atualizarCesta() {

    const container =
        document.getElementById("itens-cesta");

    container.innerHTML = "";


    let total = 0;

    let quantidadeTotal = 0;


    // Cesta vazia

    if (Object.keys(cesta).length === 0) {

        container.innerHTML = `
            <p class="cesta-vazia">
                Sua cesta está vazia.
            </p>
        `;

        document.getElementById(
            "total-cesta"
        ).textContent = formatarPreco(0);

        document.getElementById(
            "contador-cesta"
        ).textContent = 0;

        return;
    }


    // Produtos

    for (const id in cesta) {

        const item = cesta[id];


        const subtotal =
            item.preco * item.quantidade;


        total += subtotal;

        quantidadeTotal += item.quantidade;


        container.innerHTML += `

            <div class="item-cesta">

                <div class="item-cesta-topo">

                    <h3>
                        ${item.nome}
                    </h3>

                    <span class="item-preco">
                        ${formatarPreco(subtotal)}
                    </span>

                </div>


                <div class="controles-cesta">

                    <div class="controle-quantidade">

                        <button
                            onclick="alterarQuantidadeCesta('${id}', -1)">
                            −
                        </button>


                        <input
                            type="number"
                            min="0"
                            value="${item.quantidade}"
                            onchange="editarQuantidadeCesta('${id}', this.value)"
                        >


                        <button
                            onclick="alterarQuantidadeCesta('${id}', 1)">
                            +
                        </button>

                    </div>


                    <button
                        class="botao-remover"
                        onclick="removerProduto('${id}')">

                        Remover

                    </button>

                </div>

            </div>

        `;
    }


    // Total

    document.getElementById(
        "total-cesta"
    ).textContent = formatarPreco(total);


    // Contador

    document.getElementById(
        "contador-cesta"
    ).textContent = quantidadeTotal;
}


// ==========================================
// ALTERAR QUANTIDADE DENTRO DA CESTA
// ==========================================

function alterarQuantidadeCesta(id, valor) {

    cesta[id].quantidade += valor;


    if (cesta[id].quantidade <= 0) {

        delete cesta[id];

    }


    atualizarCesta();
}


// ==========================================
// DIGITAR QUANTIDADE NA CESTA
// ==========================================

function editarQuantidadeCesta(id, valor) {

    valor = parseInt(valor);


    if (isNaN(valor) || valor <= 0) {

        delete cesta[id];

    } else {

        cesta[id].quantidade = Math.floor(valor);

    }


    atualizarCesta();
}


// ==========================================
// REMOVER PRODUTO
// ==========================================

function removerProduto(id) {

    delete cesta[id];

    atualizarCesta();
}


// ==========================================
// ABRIR CESTA
// ==========================================

function abrirCesta() {

    document
        .getElementById("cesta")
        .classList.add("aberto");

    document
        .getElementById("fundo-cesta")
        .classList.add("aberto");
}


// ==========================================
// FECHAR CESTA
// ==========================================

function fecharCesta() {

    document
        .getElementById("cesta")
        .classList.remove("aberto");

    document
        .getElementById("fundo-cesta")
        .classList.remove("aberto");
}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==========================================
// MENSAGEM TEMPORÁRIA
// ==========================================

function mostrarMensagem(texto) {

    const mensagem = document.createElement("div");

    mensagem.textContent = texto;

    mensagem.style.position = "fixed";
    mensagem.style.bottom = "85px";
    mensagem.style.left = "50%";
    mensagem.style.transform = "translateX(-50%)";

    mensagem.style.background = "#1f5c35";
    mensagem.style.color = "white";

    mensagem.style.padding = "12px 20px";

    mensagem.style.borderRadius = "8px";

    mensagem.style.zIndex = "200";

    mensagem.style.boxShadow =
        "0 4px 15px rgba(0,0,0,0.2)";

    document.body.appendChild(mensagem);


    setTimeout(() => {

        mensagem.remove();

    }, 2000);
}


// ==========================================
// FINALIZAR PEDIDO
// ==========================================

function finalizarPedido() {

    if (Object.keys(cesta).length === 0) {

        alert("Sua cesta está vazia.");

        return;
    }


    let mensagem =
        "Olá! Gostaria de fazer um pedido:%0A%0A";


    let total = 0;


    for (const id in cesta) {

        const item = cesta[id];


        const subtotal =
            item.preco * item.quantidade;


        total += subtotal;


        mensagem +=
            `${item.quantidade}x ${item.nome} - ${formatarPreco(subtotal)}%0A`;
    }


    mensagem +=
        `%0A*Total: ${formatarPreco(total)}*`;


    // COLOQUE O WHATSAPP DA RV PLANTAS AQUI

    const telefone = "559291525084";


    const url =
        `https://wa.me/${telefone}?text=${mensagem}`;


    window.open(url, "_blank");
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarCesta();