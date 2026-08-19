// ==========================================
// CESTA DE COMPRAS
// ==========================================

let cesta = {};


// ==========================================
// QUANTIDADE DOS PRODUTOS
// ==========================================

let quantidades = {
    camomila: 1,
    hibisco: 1,
    espinheira: 1,
    arruda: 1,
    cavalinha: 1,
    "unha-gato": 1,
    uxi: 1,
    "dente-leao": 1,
    "ipe-roxo": 1,
    carapanauba: 1
};


// ==========================================
// ALTERAR QUANTIDADE NO CARD
// ==========================================

function alterarQuantidade(produto, valor) {

    quantidades[produto] += valor;

    if (quantidades[produto] < 1) {
        quantidades[produto] = 1;
    }

    document.getElementById(
        "quantidade-" + produto
    ).textContent = quantidades[produto];
}


// ==========================================
// ADICIONAR PRODUTO À CESTA
// ==========================================

function adicionarCesta(id, nome, preco) {

    const quantidade = quantidades[id];

    if (cesta[id]) {

        cesta[id].quantidade += quantidade;

    } else {

        cesta[id] = {
            nome: nome,
            preco: preco,
            quantidade: quantidade
        };

    }

    atualizarCesta();

    abrirCesta();

    // Volta a quantidade do card para 1
    quantidades[id] = 1;

    document.getElementById(
        "quantidade-" + id
    ).textContent = 1;
}


// ==========================================
// ATUALIZAR CESTA
// ==========================================

function atualizarCesta() {

    const container = document.getElementById("itens-cesta");

    container.innerHTML = "";

    let total = 0;

    let quantidadeTotal = 0;


    // Verifica se a cesta está vazia

    if (Object.keys(cesta).length === 0) {

        container.innerHTML = `
            <p class="cesta-vazia">
                Sua cesta está vazia.
            </p>
        `;

        document.getElementById("total-cesta").textContent =
            formatarPreco(0);

        document.getElementById("contador-cesta").textContent = 0;

        return;
    }


    // Percorre todos os produtos

    for (const id in cesta) {

        const item = cesta[id];

        const subtotal = item.preco * item.quantidade;

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

                        <span>
                            ${item.quantidade}
                        </span>

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


    // Atualiza total

    document.getElementById("total-cesta").textContent =
        formatarPreco(total);


    // Atualiza contador

    document.getElementById("contador-cesta").textContent =
        quantidadeTotal;
}


// ==========================================
// ALTERAR QUANTIDADE DENTRO DA CESTA
// ==========================================

function alterarQuantidadeCesta(id, valor) {

    cesta[id].quantidade += valor;


    // Se chegar a zero, remove

    if (cesta[id].quantidade <= 0) {

        delete cesta[id];

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

    document.getElementById("cesta")
        .classList.add("aberto");

    document.getElementById("fundo-cesta")
        .classList.add("aberto");
}


// ==========================================
// FECHAR CESTA
// ==========================================

function fecharCesta() {

    document.getElementById("cesta")
        .classList.remove("aberto");

    document.getElementById("fundo-cesta")
        .classList.remove("aberto");
}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ==========================================
// FINALIZAR PEDIDO
// ==========================================

function finalizarPedido() {

    if (Object.keys(cesta).length === 0) {

        alert("Sua cesta está vazia.");

        return;
    }


    let mensagem = "Olá! Gostaria de fazer um pedido:%0A%0A";

    let total = 0;


    for (const id in cesta) {

        const item = cesta[id];

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;


        mensagem +=
            `${item.quantidade}x ${item.nome} - ${formatarPreco(subtotal)}%0A`;
    }


    mensagem += `%0A*Total: ${formatarPreco(total)}*`;


    // ======================================
    // COLOQUE AQUI O NÚMERO DO WHATSAPP
    // ======================================

    const telefone = "55929285528649";


    const url =
        `https://wa.me/${telefone}?text=${mensagem}`;


    window.open(url, "_blank");
}