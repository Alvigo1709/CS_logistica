import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// js/cotizador.js
document.addEventListener("DOMContentLoaded", async () => {
  // -----------------------------
  // Referencias a elementos del DOM
  // -----------------------------
  const productosContainer = document.getElementById("productosContainer");
  const generarBtn = document.getElementById("generar");
  const pesoTotalSpan = document.getElementById("pesoTotal");
  const cubicajeTotalSpan = document.getElementById("cubicajeTotal");
  const paquetesSpan = document.getElementById("paquetes");
  const destinoInput = document.getElementById("destinoInput");
  const datalist = document.getElementById("destinoList");

  const resultadosEnvia = document.getElementById("resultadosEnvia");
  const resultadosCotranstame = document.getElementById("resultadosCotranstame");
  const resultadosTcc = document.getElementById("resultadosTcc");

  const origenPreferido = document.getElementById("origenPreferido");
  const proveedorPreferido = document.getElementById("proveedorPreferido");
  const valorFinalSpan = document.getElementById("valorFinal");
  const registrarBtn = document.getElementById("registrarCotizacion");

  // -----------------------------
  // Variables globales
  // -----------------------------
  let productos = [];
  let lugares = [];
  let enviaTarifas = [];
  let cotranstameTarifas = [];
  let tccTarifas = [];
  let precios = [];

  // -----------------------------
  // Cargar JSONs
  // -----------------------------
  try {
    productos = await (await fetch("../data/productos.json")).json();
    lugares = await (await fetch("../data/lugares.json")).json();
    enviaTarifas = await (await fetch("../data/envia.json")).json();
    cotranstameTarifas = await (await fetch("../data/contranstame.json")).json();
    tccTarifas = await (await fetch("../data/tcc.json")).json();
  } catch (error) {
    console.error("Error cargando datos:", error);
  }

  // -----------------------------
  // Rellenar lista de destinos
  // -----------------------------
  lugares.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.Lugares;
    datalist.appendChild(opt);
  });

  // -----------------------------
  // Evento: generar productos
  // -----------------------------
  generarBtn.addEventListener("click", () => {
    productosContainer.innerHTML = "";
    const cantidad = parseInt(document.getElementById("cantidadProductos").value);

    for (let i = 0; i < cantidad; i++) {
      const div = document.createElement("div");
      div.classList.add("producto-card");
      div.innerHTML = `
        <h3>Producto ${i + 1}</h3>
        <label>Seleccione producto</label>
        <select class="productoSelect form-control">
          <option value="">-- Seleccione --</option>
          ${productos.map(p => `<option value="${p.SKU}">${p.Referencia}</option>`).join("")}
        </select>
        <label>Cantidad</label>
        <input type="number" class="cantidadInput form-control" min="1" value="1" />
        <p><strong>Peso total:</strong> <span class="pesoTotal">0</span> kg</p>
        <p><strong>Cubicaje total:</strong> <span class="cubicajeTotal">0</span> m³</p>
      `;
      productosContainer.appendChild(div);
    }
    setTimeout(() => recalcularTotales(), 100);
  });

  // -----------------------------
  // Evento: recalcular al cambiar inputs
  // -----------------------------
  document.addEventListener("input", recalcularTotales);

  // -----------------------------
  // Función: recalcular totales
  // -----------------------------
  function recalcularTotales() {
    const cards = document.querySelectorAll(".producto-card");
    let pesoTotal = 0;
    let cubicajeTotal = 0;

    cards.forEach(card => {
      const select = card.querySelector(".productoSelect");
      const cantidad = parseInt(card.querySelector(".cantidadInput").value) || 0;
      const producto = productos.find(p => p.SKU === select.value);

      if (producto) {
        const peso = producto["Peso(kg)"] * cantidad;
        const volumen = (producto["Ancho (cm)"] * producto["Largo (cm)"] * producto["Alto (cm)"]) / 1000000 * cantidad;
        card.querySelector(".pesoTotal").textContent = peso.toFixed(2);
        card.querySelector(".cubicajeTotal").textContent = volumen.toFixed(3);
        pesoTotal += peso;
        cubicajeTotal += volumen;
      }
    });

    const paquetes = cards.length + 1;
    pesoTotalSpan.textContent = pesoTotal.toFixed(2);
    cubicajeTotalSpan.textContent = cubicajeTotal.toFixed(3);
    paquetesSpan.textContent = paquetes;

    calcularFletes(pesoTotal, cubicajeTotal, paquetes);
  }

  // -----------------------------
  // Función: actualizar valor final
  // -----------------------------
  function actualizarValorFinal() {
    const prov = proveedorPreferido.value;
    const ori = origenPreferido.value;
    const seleccionado = precios.find(p => p.proveedor === prov && p.origen === ori);
    if (valorFinalSpan) {
      valorFinalSpan.textContent = seleccionado ? seleccionado.valor.toFixed(2) : "0";
    }
  }

  // -----------------------------
  // Función: cálculo de fletes
  // -----------------------------
  function calcularFletes(pesoTotal, volumenTotal, paquetes) {
    resultadosEnvia.innerHTML = "";
    resultadosCotranstame.innerHTML = "";
    resultadosTcc.innerHTML = "";
    precios = [];

    const destino = destinoInput.value.trim();
    const precioCotizacion = parseFloat(document.getElementById("precioCotizacion").value) || 0;
    if (!destino || !precioCotizacion) return;

    const pesoCubico = volumenTotal * 400;
    const origenes = ["BARRANQUILLA - ATLANTICO", "CARTAGENA - BOLIVAR", "BOGOTA D.C. - CUNDINAMARCA"];

    origenes.forEach(origen => {
      const pesoUsadoEnvia = Math.max(pesoTotal, pesoCubico, 25);
      const tarifaEnvia = enviaTarifas.find(t => (t.RUTA || "").toLowerCase().trim() === `${origen} a ${destino}`.toLowerCase().trim());
      if (tarifaEnvia) {
        const base = tarifaEnvia.Tarifa * pesoUsadoEnvia;
        let manejo = (precioCotizacion * 0.21) * tarifaEnvia.MANEJO;
        const tipo = tarifaEnvia.Tipo || "";
        const minimoManejo = (tipo === "RX" || tipo === "RX-E") ? 6400 : 5000;
        manejo = Math.max(manejo, minimoManejo) * paquetes;
        const flete = base + manejo;
        precios.push({ proveedor: "Envia", origen, valor: flete });
      }

      const pesoUsadoContr = Math.max(pesoTotal, 30);
      const tarifaContr = cotranstameTarifas.find(t => (t.RUTA || "").toLowerCase().trim() === `${origen} a ${destino}`.toLowerCase().trim());
      if (tarifaContr) {
        let tarifaKg = tarifaContr["VALOR  Kg."];

        if (pesoUsadoContr >= 500 && pesoUsadoContr < 1000) {
          tarifaKg = tarifaContr["DE 500-999 Kg"];
        } else if (pesoUsadoContr >= 1000) {
          tarifaKg = tarifaContr["DE + 1000 Kg "];
        }

        let manejo = (precioCotizacion * 0.21) * tarifaContr.MANEJO;
        manejo = manejo * paquetes;
        const flete = (tarifaKg * pesoUsadoContr) + manejo;

        precios.push({ proveedor: "Cotranstame", origen, valor: flete });
      }

      const pesoUsadoTcc = Math.max(pesoTotal, pesoCubico, 20);
      const tarifaTcc = tccTarifas.find(t => (t.RUTA || "").toLowerCase().trim() === `${origen} a ${destino}`.toLowerCase().trim());
      if (tarifaTcc) {
        const base = tarifaTcc.Valor * pesoUsadoTcc;
        let manejoRate = (tarifaTcc.Tipo === "N" || tarifaTcc.Tipo === "U") ? 0.005 : 0.01;
        let manejo = (precioCotizacion * 0.21) * manejoRate;
        let minimoManejo = 7944;
        if (tarifaTcc.Tipo === "N") minimoManejo = 7608;
        if (tarifaTcc.Tipo === "U") minimoManejo = 6711;
        manejo = Math.max(manejo, minimoManejo) * paquetes;
        const flete = base + manejo;
        precios.push({ proveedor: "TCC", origen, valor: flete });
      }
    });

    const min = Math.min(...precios.map(p => p.valor));
    const max = Math.max(...precios.map(p => p.valor));

    precios.forEach(p => {
      const ratio = (p.valor - min) / (max - min || 1);
      let clase = "precio-verde";
      if (ratio > 0.66) clase = "precio-rojo";
      else if (ratio > 0.33) clase = "precio-amarillo";

      const li = `<li class="${clase}">${p.proveedor} (${p.origen}) → 💰 ${p.valor.toFixed(2)} COP</li>`;
      if (p.proveedor === "Envia") resultadosEnvia.innerHTML += li;
      if (p.proveedor === "Cotranstame") resultadosCotranstame.innerHTML += li;
      if (p.proveedor === "TCC") resultadosTcc.innerHTML += li;
    });

    actualizarValorFinal();
  }

  // -----------------------------
  // Escuchar cambios de preferencia solo UNA VEZ
  // -----------------------------
  origenPreferido.addEventListener("change", actualizarValorFinal);
  proveedorPreferido.addEventListener("change", actualizarValorFinal);

  // -----------------------------
  // Guardar cotización en Firestore
  // -----------------------------
  registrarBtn.addEventListener("click", async () => {
    try {
      const destino = destinoInput.value.trim();
      const numeroCotizacion = document.getElementById("numeroCotizacion").value.trim();
      const precioCotizacion = parseFloat(document.getElementById("precioCotizacion").value) || 0;
      const pesoTotal = parseFloat(pesoTotalSpan.textContent) || 0;
      const cubicajeTotal = parseFloat(cubicajeTotalSpan.textContent) || 0;
      const paquetes = parseInt(paquetesSpan.textContent) || 0;
      const origen = origenPreferido.value.trim();
      const proveedor = proveedorPreferido.value.trim();
      const valorFinal = parseFloat(valorFinalSpan.textContent) || 0;

      const productosSeleccionados = [];
      document.querySelectorAll(".producto-card").forEach(card => {
        const referencia = card.querySelector(".productoSelect").value;
        const cantidad = parseInt(card.querySelector(".cantidadInput").value) || 0;
        const peso = parseFloat(card.querySelector(".pesoTotal").textContent) || 0;
        const volumen = parseFloat(card.querySelector(".cubicajeTotal").textContent) || 0;
        if (referencia) {
          productosSeleccionados.push({ referencia, cantidad, peso, volumen });
        }
      });

      if (!destino || !numeroCotizacion || productosSeleccionados.length === 0) {
        alert("Por favor complete todos los campos antes de registrar la cotización.");
        return;
      }

      await addDoc(collection(db, "cotizaciones"), {
        destino,
        origen,
        proveedor,
        numeroCotizacion,
        precioCotizacion,
        pesoTotal,
        cubicajeTotal,
        paquetes,
        valorFinal,
        productos: productosSeleccionados,
        fecha: serverTimestamp(),
        usuario: localStorage.getItem("usuario") || "desconocido"
      });

      alert("✅ Cotización registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar cotización:", error);
      alert("❌ Hubo un error al registrar la cotización.");
    }
  });
});
