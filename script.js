document.addEventListener("DOMContentLoaded", function () {
  var path = window.location.pathname;
  var basePath = path.includes("/paginas/") ? "../" : "./";

  /* =========================
     NAVBAR
  ========================= */
  var header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
    <h1>SOS DIGITAL</h1>
    <nav class="nav">
      <a class="nav-link" href="${basePath}index.html">Inicio</a>
      <a class="nav-link" href="${basePath}paginas/hadware.html">Hardware</a>
      <a class="nav-link" href="${basePath}paginas/software.html">Software</a>
      <a class="nav-link" href="${basePath}paginas/avances.html">Avances</a>
      <a class="nav-link" href="${basePath}paginas/estudiantes.html">Fundamentos</a>
      <a class="nav-link" href="${basePath}paginas/nosotros.html">Nosotros</a>
      <a class="nav-link" href="${basePath}paginas/conocenos.html">Contacto</a>
    </nav>
    <div class="header-actions">
      <button id="toggleDark" title="Cambiar tema">Modo oscuro</button>
    </div>
  `;
  document.body.prepend(header);

  /* =========================
     FOOTER
  ========================= */
  var footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-section">
        <h3>SOS DIGITAL</h3>
        <p>Aprende informatica desde cero con nosotros.</p>
      </div>
      <div class="footer-section">
        <h4>Contactanos</h4>
        <p><a href="mailto:sosdigitalcr@gmail.com">sosdigitalcr@gmail.com</a></p>
        <p><a href="https://wa.me/50671328864" target="_blank">WhatsApp</a></p>
      </div>
      <div class="footer-section">
        <h4>Colegio Tecnico Profesional de Puriscal</h4>
        <p>Estudiantes del curso de Servicios en la Nube</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 SOS DIGITAL &middot; Hecho por estudiantes</p>
    </div>
  `;
  document.body.appendChild(footer);

  /* =========================
     MODO OSCURO
  ========================= */
  var darkBtn = document.getElementById("toggleDark");
  if (darkBtn) {
    darkBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
    });
  }

  /* =========================
     MODAL DE TARJETA (detalles + descargas)
  ========================= */
  var cardModalOverlay = document.createElement("div");
  cardModalOverlay.className = "card-modal-overlay";
  cardModalOverlay.innerHTML = `
    <div class="card-modal">
      <button class="card-modal-close">&times;</button>
      <img class="card-modal-img" src="" alt="">
      <div class="card-modal-body">
        <h2 class="card-modal-title"></h2>
        <div class="card-modal-content"></div>
        <div class="card-modal-docs"></div>
      </div>
    </div>
  `;
  document.body.appendChild(cardModalOverlay);

  var modalImg = cardModalOverlay.querySelector(".card-modal-img");
  var modalTitle = cardModalOverlay.querySelector(".card-modal-title");
  var modalContent = cardModalOverlay.querySelector(".card-modal-content");
  var modalDocs = cardModalOverlay.querySelector(".card-modal-docs");
  var modalClose = cardModalOverlay.querySelector(".card-modal-close");

  function openCardModal(cardEl) {
    var img = cardEl.querySelector("img");
    var title = cardEl.querySelector("h3") || cardEl.querySelector("h2");
    var bodyItems = cardEl.querySelectorAll("ol li, p");
    var cardName = cardEl.getAttribute("data-card") || (title ? title.textContent : "");

    if (img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
    }

    modalTitle.textContent = title ? title.textContent : "";

    var contentHtml = "";
    bodyItems.forEach(function (item) {
      if (item.closest(".card-docs")) return;
      contentHtml += item.outerHTML;
    });
    modalContent.innerHTML = contentHtml;

    var docs = JSON.parse(localStorage.getItem("sos_card_docs") || "[]");
    var cardDocs = docs.filter(function (d) { return d.card === cardName; });

    if (cardDocs.length > 0) {
      var docsHtml = '<h3 class="card-modal-docs-title">Documentos disponibles</h3>';
      cardDocs.forEach(function (doc) {
        if (doc.fileData) {
          var byteString = atob(doc.fileData.split(",")[1]);
          var mimeString = doc.fileData.split(",")[0].split(":")[1].split(";")[0];
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          var blob = new Blob([ab], { type: mimeString });
          var blobUrl = URL.createObjectURL(blob);
          docsHtml += '<a href="' + blobUrl + '" download="' + (doc.fileName || doc.title) + '" class="card-download-btn"><span class="dl-icon">&#128196;</span> Descargar: ' + (doc.fileName || doc.title) + '</a>';
        } else if (doc.url) {
          docsHtml += '<a href="' + doc.url + '" target="_blank" class="card-download-btn"><span class="dl-icon">&#128196;</span> Ver: ' + doc.title + '</a>';
        }
      });
      modalDocs.innerHTML = docsHtml;
    } else {
      modalDocs.innerHTML = '<p class="card-modal-no-docs">No hay documentos disponibles para esta tarjeta.</p>';
    }

    cardModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCardModal() {
    cardModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeCardModal);
  cardModalOverlay.addEventListener("click", function (e) {
    if (e.target === cardModalOverlay) closeCardModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCardModal();
  });

  document.querySelectorAll(".card").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", function (e) {
      if (e.target.closest(".card-download-btn") || e.target.closest("a")) return;
      openCardModal(card);
    });
  });

});

/* =========================
   MOSTRAR "OTRO"
========================= */
window.mostrarOtro = function (select) {
  var otro = document.getElementById("otro-tema-wrap");
  if (!otro) return;
  otro.style.display = select.value === "Otro" ? "block" : "none";
};

/* =========================
   AGREGAR PRODUCTO
========================= */
window.enviarProducto = function (e) {
  e.preventDefault();
  var cat = document.getElementById("categoria");
  var nom = document.getElementById("nombre");
  var pre = document.getElementById("precio");
  var img = document.getElementById("imagen");
  var cont = document.getElementById("productos");
  if (!cat || !nom || !pre || !img || !cont) return;
  var card = document.createElement("div");
  card.className = "card";
  card.innerHTML = '<img src="' + img.value + '" alt="' + nom.value + '" style="cursor:pointer"><div class="info"><h3>' + cat.value + '</h3><p class="desc">' + nom.value + '</p><p class="precio">&#x20A1;' + pre.value + '</p></div>';
  cont.appendChild(card);
  e.target.reset();
};

/* =========================
   CONTRATAR PAQUETE
========================= */
window.contratarPaquete = function (nombre, precio) {
  var msg = "Hola SOS DIGITAL, estoy interesado en contratar el paquete: " + nombre + " (" + precio + "). Quiero mas informacion.";
  window.open("https://wa.me/50671328864?text=" + encodeURIComponent(msg), "_blank");
};

/* =========================
   ENVIAR SATISFACCION
========================= */
window.enviarSatisfaccion = function (e) {
  e.preventDefault();
  var form = document.getElementById("satForm");
  var thanks = document.getElementById("satThanks");
  if (form) form.style.display = "none";
  if (thanks) {
    thanks.style.display = "block";
    setTimeout(function () {
      thanks.style.display = "none";
      if (form) {
        form.style.display = "block";
        form.querySelector("form").reset();
      }
    }, 4000);
  }
};
