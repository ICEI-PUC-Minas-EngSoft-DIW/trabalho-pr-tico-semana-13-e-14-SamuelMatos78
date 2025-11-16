const API_BASE = "http://localhost:3000";

async function getJSON(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`);
  return res.json();
}

async function popularCarousel() {
  const carouselInner = document.getElementById("carouselInner");
  if (!carouselInner) return;

  const noticias = await getJSON("noticias");
  const noticiasDestaque = noticias.slice(0, 3);
  carouselInner.innerHTML = "";

  noticiasDestaque.forEach((noticia, index) => {
    const activeClass = index === 0 ? " active" : "";
    const item = document.createElement("div");
    item.className = `carousel-item${activeClass}`;
    item.innerHTML = `
      <img src="${noticia.imagem_url}" class="d-block w-100" alt="${noticia.titulo}">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
        <h5>${noticia.titulo}</h5>
        <p>${noticia.sub_texto}</p>
        <small>${noticia.data} — ${noticia.fonte}</small>
      </div>
    `;

    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      const target = document.getElementById("noticias");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });

    carouselInner.appendChild(item);
  });
}

async function popularNoticias() {
  const noticiasCards = document.getElementById("noticiasCards");
  if (!noticiasCards) return;
  noticiasCards.innerHTML = "";

  const noticias = await getJSON("noticias");

  noticias.forEach((noticia) => {
    const card = `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm noticia-card" data-noticia-id="${noticia.id}" style="cursor:pointer;">
          <img src="${noticia.imagem_url}" class="card-img-top" alt="${noticia.titulo}">
          <div class="card-body">
            <h5 class="card-title">${noticia.titulo}</h5>
            <p class="card-text">${noticia.sub_texto}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">${noticia.data} — ${noticia.fonte}</small>
          </div>
        </div>
      </div>`;
    noticiasCards.innerHTML += card;
  });

  document.querySelectorAll(".noticia-card").forEach((card) => {
    card.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.noticiaId;
      const noticia = await getJSON(`noticias/${id}`);

      const modal = new bootstrap.Modal(document.getElementById("modalNoticia"));
      document.getElementById("modalNoticiaLabel").textContent = noticia.titulo;
      document.getElementById("modalNoticiaBody").innerHTML = `
        <p>${noticia.texto}</p>
        <p><small class="text-muted">${noticia.data} — ${noticia.fonte}</small></p>
        ${
          noticia.link
            ? `<a href="${noticia.link}" class="btn btn-primary btn-lg" target="_blank">Ler mais</a>`
            : `<p class="text-muted fst-italic">Fonte indisponível</p>`
        }
      `;
      modal.show();
    });
  });
}

async function popularRecomendados() {
  const recomendadosCards = document.getElementById("recomendadosCards");
  if (!recomendadosCards) return;
  recomendadosCards.innerHTML = "";

  const livros = await getJSON("livros");

  livros.forEach((livro) => {
    recomendadosCards.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <img src="${livro.capa_url}" class="card-img-top" alt="${livro.titulo}">
          <div class="card-body">
            <h5 class="card-title">${livro.titulo}</h5>
            <p class="card-text">Autor: ${livro.autor}</p>
            <button class="btn btn-info ver-info" data-livro-id="${livro.id}">Ver Informações</button>
          </div>
        </div>
      </div>`;
  });

  document.querySelectorAll(".ver-info").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.livroId;
      const livro = await getJSON(`livros/${id}`);
      document.getElementById("modalLivroLabel").textContent = livro.titulo;
      document.getElementById("modalLivroBody").innerHTML = `
        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Sinopse:</strong> ${livro.sinopse}</p>
        <a href="https://www.amazon.com.br/s?k=${encodeURIComponent(livro.titulo + ' ' + livro.autor)}" target="_blank" class="btn btn-amazon btn-lg">Comprar na Amazon</a>
      `;
      new bootstrap.Modal(document.getElementById("modalLivro")).show();
    });
  });
}

async function popularCuriosidade() {
  const curiosidadeContent = document.getElementById("curiosidadeContent");
  if (!curiosidadeContent) return;

  const curiosidades = await getJSON("curiosidades");
  const curiosidade = curiosidades[0];
  curiosidadeContent.innerHTML = `
    <h5 class="card-title">${curiosidade.titulo}</h5>
    <p class="card-text">${curiosidade.texto}</p>
    <p class="card-text"><small class="text-muted">Fonte: ${curiosidade.fonte}</small></p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  popularCarousel();
  popularNoticias();
  popularRecomendados();
  popularCuriosidade();
});
