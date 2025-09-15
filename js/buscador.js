document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const filterProducto = document.getElementById("filterProducto");
  const filterMarca = document.getElementById("filterMarca");
  const resultadosDiv = document.getElementById("resultados");

  let productos = [];

  try {
    const res = await fetch("../data/productos.json");
    productos = await res.json();
    renderizar(productos);
    llenarFiltros(productos);
  } catch (error) {
    console.error("Error al cargar productos.json:", error);
  }

  function renderizar(lista) {
    resultadosDiv.innerHTML = "";

    lista.forEach(p => {
      const imgPath = p.img || "../assets/img/placeholder.png";
      const pdfPath = p.pdf || "#";
      const dimensiones = `${p["Ancho (cm)"] || "?"} x ${p["Largo (cm)"] || "?"} x ${p["Alto (cm)"] || "?"} cm`;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="../${imgPath}" alt="${p.Referencia}" class="card-img" onerror="this.src='../assets/img/placeholder.png'">
        <h3>${p.Referencia}</h3>
        <p><strong>Producto:</strong> ${p.Producto}</p>
        <p><strong>Marca:</strong> ${p.Marca}</p>
        <p><strong>Peso:</strong> ${p["Peso(kg)"]} kg</p>
        <p><strong>Dimensiones:</strong> ${dimensiones}</p>
        <a href="../${pdfPath}" target="_blank" class="btn">Ver Ficha Técnica</a>
      `;
      resultadosDiv.appendChild(card);
    });
  }

  function llenarFiltros(lista) {
    const productosUnicos = [...new Set(lista.map(p => p.Producto).filter(Boolean))];
    const marcasUnicas = [...new Set(lista.map(p => p.Marca).filter(Boolean))];

    productosUnicos.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      filterProducto.appendChild(opt);
    });

    marcasUnicas.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      filterMarca.appendChild(opt);
    });
  }

  function filtrarResultados() {
    console.log("¡Filtrando!");
    const texto = searchInput.value.toLowerCase().trim();
    const productoFiltro = filterProducto.value;
    const marcaFiltro = filterMarca.value;

    const filtrados = productos.filter(p => {
      const referencia = typeof p.Referencia === 'string' ? p.Referencia.toLowerCase() : '';
      const coincideTexto = referencia.includes(texto);
      const coincideProducto = !productoFiltro || p.Producto === productoFiltro;
      const coincideMarca = !marcaFiltro || p.Marca === marcaFiltro;
      return coincideTexto && coincideProducto && coincideMarca;
    });

    renderizar(filtrados);
  }
  console.log("¡Botón conectado!");
  searchButton.addEventListener("click", filtrarResultados);
  searchInput.addEventListener("input", filtrarResultados);
  filterProducto.addEventListener("change", filtrarResultados);
  filterMarca.addEventListener("change", filtrarResultados);
});
searchButton.addEventListener("click", () => {
  console.log("¡Botón conectado!");
  filtrarResultados();
});

searchInput.addEventListener("input", () => {
  console.log("¡Filtrando!");
  filtrarResultados();
});
