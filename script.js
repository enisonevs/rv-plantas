// ==========================================
// CONFIGURAÇÃO
// ==========================================
const TELEFONE = "5592984682393";
const CHAVE_CESTA = "rv-plantas-cesta";
const CHAVE_NOME = "rv-plantas-nome";

// Foto de cada produto: imagens/<id>.jpg
// (se a foto não existir, aparece "Foto em breve")
const SEM_FOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">' +
    '<rect width="100%" height="100%" fill="#e8efe9"/>' +
    '<text x="50%" y="50%" text-anchor="middle" fill="#6b8f77" ' +
    'font-family="sans-serif" font-size="18">Foto em breve</text></svg>'
  );

// ==========================================
// LISTA ÚNICA DE PRODUTOS
// Para adicionar um produto, basta incluir uma linha aqui.
// ==========================================
const produtos = [
  { id: "camomila", nome: "Camomila 20g", preco: 3, descricao: "Ajuda no relaxamento, melhora o sono e alivia má digestão." },
  { id: "hibisco", nome: "Hibisco 30g", preco: 3, descricao: "Ação diurética, antioxidante e auxilia no controle da pressão." },
  { id: "espinheira", nome: "Espinheira-santa 30g", preco: 3, descricao: "Tradicionalmente utilizada para desconfortos digestivos." },
  { id: "arruda", nome: "Arruda 20g", preco: 3, descricao: "Planta tradicionalmente utilizada em preparações populares." },
  { id: "cavalinha", nome: "Cavalinha 20g", preco: 3, descricao: "Tradicionalmente utilizada em preparações à base de plantas." },
  { id: "unha-gato", nome: "Unha-de-gato 20g", preco: 3, descricao: "Planta tradicionalmente utilizada em preparações populares." },
  { id: "uxi", nome: "Uxi amarelo 50g", preco: 3, descricao: "Planta tradicionalmente utilizada em preparações populares." },
  { id: "dente-leao", nome: "Dente-de-leão 20g", preco: 3, descricao: "Tradicionalmente utilizado em preparações à base de plantas." },
  { id: "ipe-roxo", nome: "Ipê-roxo 50g", preco: 3, descricao: "Planta tradicionalmente utilizada em preparações populares." },
  { id: "carapanauba", nome: "Carapanaúba 50g", preco: 3, descricao: "Planta tradicionalmente utilizada em preparações populares." }
];

// ==========================================
// ESTADO
// ==========================================
let cesta = {};
const quantidades = Object.fromEntries(produtos.map((p) => [p.id, 0]));

// ==========================================
// MONTAR OS CARDS
// ==========================================
function criarCards() {
  document.getElementById("produtos").innerHTML = produtos
    .map(
      (p) => `
    <div class="card">
      <img src="imagens/${p.id}.jpg" alt="${p.nome}" loading="lazy"
           onerror="this.onerror=null;this.src=SEM_FOTO">
      <div class="card-conteudo">
        <h2>${p.nome}</h2>
        <p class="descricao">${p.descricao}</p>
        <p class="preco">${formatarPreco(p.preco)}</p>
        <div class="quantidade">
          <button onclick="alterarQuantidade('${p.id}', -1)">−</button>
          <input type="number" id="quantidade-${p.id}" value="0" min="0"
                 onchange="corrigirQuantidade('${p.id}')">
          <button onclick="alterarQuantidade('${p.id}', 1)">+</button>
        </div>
      </div>
    </div>`
    )
    .join("");
}

// ==========================================
// QUANTIDADES NOS CARDS
// ==========================================
function alterarQuantidade(id, valor) {
  quantidades[id] = Math.max(0, quantidades[id] + valor);
  atualizarCampo(id);
}

function atualizarCampo(id) {
  document.getElementById("quantidade-" + id).value = quantidades[id];
}

function corrigirQuantidade(id) {
  const campo = document.getElementById("quantidade-" + id);
  let valor = Math.floor(parseInt(campo.value));
  if (isNaN(valor) || valor < 0) valor = 0;
  quantidades[id] = valor;
  campo.value = valor;
}

// ==========================================
// ADICIONAR SELECIONADOS À CESTA
// ==========================================
function adicionarSelecionados() {
  let adicionou = false;

  for (const p of produtos) {
    const quantidade = quantidades[p.id];
    if (quantidade <= 0) continue;

    adicionou = true;
    if (cesta[p.id]) {
      cesta[p.id].quantidade += quantidade;
    } else {
      cesta[p.id] = { nome: p.nome, preco: p.preco, quantidade };
    }
    quantidades[p.id] = 0;
    atualizarCampo(p.id);
  }

  atualizarCesta();
  mostrarMensagem(
    adicionou ? "Produtos adicionados à cesta!" : "Selecione pelo menos um produto."
  );
}

// ==========================================
// CESTA: SALVAR E CARREGAR (localStorage)
// ==========================================
function salvarCesta() {
  try {
    const simples = {};
    for (const id in cesta) simples[id] = cesta[id].quantidade;
    localStorage.setItem(CHAVE_CESTA, JSON.stringify(simples));
  } catch (e) {
    // sem armazenamento disponível: segue sem salvar
  }
}

function carregarCesta() {
  try {
    const salva = JSON.parse(localStorage.getItem(CHAVE_CESTA) || "{}");
    for (const id in salva) {
      const p = produtos.find((x) => x.id === id);
      const q = Math.floor(Number(salva[id]));
      // nome e preço vêm sempre da lista atual de produtos
      if (p && q > 0) cesta[id] = { nome: p.nome, preco: p.preco, quantidade: q };
    }
    document.getElementById("nome-cliente").value =
      localStorage.getItem(CHAVE_NOME) || "";
  } catch (e) {
    cesta = {};
  }
}

function salvarNome() {
  try {
    localStorage.setItem(CHAVE_NOME, document.getElementById("nome-cliente").value);
  } catch (e) {}
}

// ==========================================
// ATUALIZAR CESTA
// ==========================================
function atualizarCesta() {
  salvarCesta();

  const container = document.getElementById("itens-cesta");
  let total = 0;
  let quantidadeTotal = 0;
  let html = "";

  for (const id in cesta) {
    const item = cesta[id];
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    quantidadeTotal += item.quantidade;

    html += `
      <div class="item-cesta">
        <div class="item-cesta-topo">
          <h3>${item.nome}</h3>
          <span class="item-preco">${formatarPreco(subtotal)}</span>
        </div>
        <div class="controles-cesta">
          <div class="controle-quantidade">
            <button onclick="alterarQuantidadeCesta('${id}', -1)">−</button>
            <input type="number" min="0" value="${item.quantidade}"
                   onchange="editarQuantidadeCesta('${id}', this.value)">
            <button onclick="alterarQuantidadeCesta('${id}', 1)">+</button>
          </div>
          <button class="botao-remover" onclick="removerProduto('${id}')">Remover</button>
        </div>
      </div>`;
  }

  container.innerHTML = html || '<p class="cesta-vazia">Sua cesta está vazia.</p>';
  document.getElementById("total-cesta").textContent = formatarPreco(total);
  document.getElementById("contador-cesta").textContent = quantidadeTotal;
}

function alterarQuantidadeCesta(id, valor) {
  cesta[id].quantidade += valor;
  if (cesta[id].quantidade <= 0) delete cesta[id];
  atualizarCesta();
}

function editarQuantidadeCesta(id, valor) {
  valor = parseInt(valor);
  if (isNaN(valor) || valor <= 0) {
    delete cesta[id];
  } else {
    cesta[id].quantidade = Math.floor(valor);
  }
  atualizarCesta();
}

function removerProduto(id) {
  delete cesta[id];
  atualizarCesta();
}

// ==========================================
// ABRIR / FECHAR CESTA
// ==========================================
function abrirCesta() {
  document.getElementById("cesta").classList.add("aberto");
  document.getElementById("fundo-cesta").classList.add("aberto");
}

function fecharCesta() {
  document.getElementById("cesta").classList.remove("aberto");
  document.getElementById("fundo-cesta").classList.remove("aberto");
}

// ==========================================
// UTILITÁRIOS
// ==========================================
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mostrarMensagem(texto) {
  const mensagem = document.createElement("div");
  mensagem.textContent = texto;
  Object.assign(mensagem.style, {
    position: "fixed",
    bottom: "85px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1f5c35",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    zIndex: "200",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  });
  document.body.appendChild(mensagem);
  setTimeout(() => mensagem.remove(), 2000);
}

// ==========================================
// FINALIZAR PEDIDO (WhatsApp)
// ==========================================
function finalizarPedido() {
  if (Object.keys(cesta).length === 0) {
    alert("Sua cesta está vazia.");
    return;
  }

  const nome = document.getElementById("nome-cliente").value.trim();
  // Para tornar o nome OBRIGATÓRIO, descomente:
  // if (!nome) { alert("Por favor, informe seu nome."); return; }

  let texto = nome
    ? `Olá! Meu nome é ${nome}. Gostaria de fazer um pedido:\n\n`
    : "Olá! Gostaria de fazer um pedido:\n\n";
  let total = 0;

  for (const id in cesta) {
    const item = cesta[id];
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    texto += `${item.quantidade}x ${item.nome} - ${formatarPreco(subtotal)}\n`;
  }
  texto += `\n*Total: ${formatarPreco(total)}*`;

  const url = `https://wa.me/${TELEFONE}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
criarCards();
carregarCesta();
atualizarCesta();