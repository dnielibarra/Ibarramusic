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

  

  const chips = document.getElementById("chipsCancion");
  chips.innerHTML = "";

  (cancion.etiquetas || []).forEach(e => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = e;
    chips.appendChild(chip);
  });

  crearSecciones(cancion);
}

const seccionesDisponibles = [
  { clave: "letra", nombre: "Letra", tipo: "acordes" },
  { clave: "tablatura", nombre: "Tablatura", tipo: "pre" },
  { clave: "notas", nombre: "Notas", tipo: "pre" },
  { clave: "intro", nombre: "Intro", tipo: "pre" },
  { clave: "solo", nombre: "Solo", tipo: "pre" },
  { clave: "arreglo", nombre: "Arreglo", tipo: "pre" },
  { clave: "historia", nombre: "Historia", tipo: "pre" }
];

function crearSecciones(cancion) {
  const tabs = document.getElementById("tabsSecciones");
  const contenido = document.getElementById("contenidoSeccion");

  tabs.innerHTML = "";
  contenido.innerHTML = "";

  const seccionesConContenido = seccionesDisponibles.filter(sec => {
    return cancion[sec.clave] && cancion[sec.clave].trim() !== "";
  });

  seccionesConContenido.forEach((sec, index) => {
    const tab = document.createElement("span");
    tab.textContent = sec.nombre;
    tab.onclick = () => mostrarSeccion(sec, cancion, tab);
    tabs.appendChild(tab);

    if (index === 0) {
      mostrarSeccion(sec, cancion, tab);
    }
  });
}

function mostrarSeccion(sec, cancion, tabActivo) {
  const tabs = document.querySelectorAll("#tabsSecciones span");
  const contenido = document.getElementById("contenidoSeccion");

  tabs.forEach(t => t.classList.remove("activo"));
  tabActivo.classList.add("activo");

  if (sec.tipo === "acordes") {
    contenido.innerHTML = `
      <pre id="letraCancion">${formatearAcordes(cancion[sec.clave])}</pre>
    `;
  } else {
    contenido.innerHTML = `
      <pre class="bloque-pre">${cancion[sec.clave]}</pre>
    `;
  }
}

function volver() {
  document.getElementById("vistaCancion").classList.add("oculto");
  document.getElementById("inicio").classList.remove("oculto");
}

function formatearAcordes(texto) {
  return texto
    .trim()
    .split("\n")
    .map(linea => {
      if (!linea.includes("[")) {
        return `<div class="linea-simple">${linea}</div>`;
      }

      let acordes = "";
      let letra = "";
      let pos = 0;

      const partes = linea.split(/(\[[^\]]+\])/g);

      partes.forEach(parte => {
        if (parte.startsWith("[") && parte.endsWith("]")) {
          const acorde = parte.slice(1, -1);
          acordes += " ".repeat(Math.max(letra.length - pos, 0)) + acorde;
          pos = letra.length + acorde.length;
        } else {
          letra += parte;
        }
      });

      return `
        <div class="linea-canto">
          <div class="linea-acordes">${acordes}</div>
          <div class="linea-letra">${letra}</div>
        </div>
      `;
    })
    .join("");
}

renderEtiquetas();
renderCanciones();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

function buscarActualizacion() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.update().then(() => {
          alert("Buscando actualización. La app se recargará.");
          location.reload();
        });
      } else {
        location.reload();
      }
    });
  } else {
    location.reload();
  }
}