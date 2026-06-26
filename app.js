const canciones = [
  ...baladas,
  ...rancheras,
  ...rock
];

let etiquetaActiva = "";
let cancionActual = null;

const buscador = document.getElementById("buscador");
const listaCanciones = document.getElementById("listaCanciones");
const contenedorEtiquetas = document.getElementById("etiquetas");

buscador.addEventListener("input", renderCanciones);

function obtenerEtiquetas() {
  const todas = canciones.flatMap(c => c.etiquetas || []);
  return [...new Set(todas)].sort();
}

function renderEtiquetas() {
  contenedorEtiquetas.innerHTML = "";

  const todas = document.createElement("span");
  todas.className = "chip" + (etiquetaActiva === "" ? " activa" : "");
  todas.textContent = "Todas";
  todas.onclick = () => {
    etiquetaActiva = "";
    renderEtiquetas();
    renderCanciones();
  };
  contenedorEtiquetas.appendChild(todas);

  obtenerEtiquetas().forEach(etiqueta => {
    const chip = document.createElement("span");
    chip.className = "chip" + (etiquetaActiva === etiqueta ? " activa" : "");
    chip.textContent = etiqueta;
    chip.onclick = () => {
      etiquetaActiva = etiqueta;
      renderEtiquetas();
      renderCanciones();
    };
    contenedorEtiquetas.appendChild(chip);
  });
}

function renderCanciones() {
  const texto = buscador.value.toLowerCase();

  const filtradas = canciones.filter(c => {
    const coincideTexto =
      c.titulo.toLowerCase().includes(texto) ||
      (c.autor || "").toLowerCase().includes(texto) ||
      (c.letra || "").toLowerCase().includes(texto);

    const coincideEtiqueta =
      !etiquetaActiva || (c.etiquetas || []).includes(etiquetaActiva);

    return coincideTexto && coincideEtiqueta;
  });

  listaCanciones.innerHTML = "";

  filtradas.forEach(cancion => {
    const div = document.createElement("div");
    div.className = "cancion";
    div.innerHTML = `
      <h3>${cancion.titulo}</h3>
      <p>${cancion.autor || "Autor desconocido"} · Tono: ${cancion.tono || "-"}</p>
    `;
    div.onclick = () => abrirCancion(cancion);
    listaCanciones.appendChild(div);
  });
}

function abrirCancion(cancion) {
  cancionActual = cancion;

  document.getElementById("inicio").classList.add("oculto");
  document.getElementById("vistaCancion").classList.remove("oculto");

  document.getElementById("tituloCancion").textContent = cancion.titulo;
  document.getElementById("autorCancion").textContent = cancion.autor || "";
  document.getElementById("tonoCancion").textContent = "Tono: " + (cancion.tono || "-");

  document.getElementById("letraCancion").textContent = cancion.letra || "";
  document.getElementById("tablaturaCancion").textContent = cancion.tablatura || "";
  document.getElementById("notasCancion").textContent = cancion.notas || "";

  document.getElementById("tabTablatura").style.display = cancion.tablatura ? "inline" : "none";
  document.getElementById("tabNotas").style.display = cancion.notas ? "inline" : "none";

  const chips = document.getElementById("chipsCancion");
  chips.innerHTML = "";

  (cancion.etiquetas || []).forEach(e => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = e;
    chips.appendChild(chip);
  });

  mostrarSeccion("letra");
}

function mostrarSeccion(seccion) {
  document.getElementById("letraCancion").classList.add("oculto");
  document.getElementById("tablaturaCancion").classList.add("oculto");
  document.getElementById("notasCancion").classList.add("oculto");

  if (seccion === "letra") {
    document.getElementById("letraCancion").classList.remove("oculto");
  }

  if (seccion === "tablatura") {
    document.getElementById("tablaturaCancion").classList.remove("oculto");
  }

  if (seccion === "notas") {
    document.getElementById("notasCancion").classList.remove("oculto");
  }
}

function volver() {
  document.getElementById("vistaCancion").classList.add("oculto");
  document.getElementById("inicio").classList.remove("oculto");
}

renderEtiquetas();
renderCanciones();