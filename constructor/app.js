let etiquetas = [];
let secciones = [];

function agregarEtiqueta() {
  const input = document.getElementById("etiquetaInput");
  const valor = input.value.trim();

  if (!valor) return;

  etiquetas.push(valor);
  input.value = "";
  renderEtiquetas();
}

function renderEtiquetas() {
  const contenedor = document.getElementById("listaEtiquetas");
  contenedor.innerHTML = "";

  etiquetas.forEach((etiqueta, index) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = etiqueta + " ×";
    chip.onclick = () => {
      etiquetas.splice(index, 1);
      renderEtiquetas();
    };
    contenedor.appendChild(chip);
  });
}

function agregarSeccion() {
  const tipo = document.getElementById("tipoSeccion").value;

  secciones.push({
    tipo,
    contenido: ""
  });

  renderSecciones();
}

function renderSecciones() {
  const contenedor = document.getElementById("contenedorSecciones");
  contenedor.innerHTML = "";

  secciones.forEach((sec, index) => {
    const div = document.createElement("div");
    div.className = "seccion";

    div.innerHTML = `
      <h3>${sec.tipo}</h3>
      <textarea placeholder="Escribe aquí ${sec.tipo}">${sec.contenido}</textarea>
      <button onclick="eliminarSeccion(${index})">Eliminar</button>
    `;

    const textarea = div.querySelector("textarea");
    textarea.addEventListener("input", () => {
      secciones[index].contenido = textarea.value;
    });

    contenedor.appendChild(div);
  });
}

function eliminarSeccion(index) {
  secciones.splice(index, 1);
  renderSecciones();
}

function convertirYoutubeEmbed(url) {
  if (!url) return "";

  let id = "";

  if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    id = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("/embed/")) {
    return url;
  }

  return id ? `https://www.youtube.com/embed/${id}` : url;
}

function generarCodigo() {
  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const tono = document.getElementById("tono").value.trim();
  const youtube = convertirYoutubeEmbed(document.getElementById("youtube").value.trim());
  const pdf = document.getElementById("pdf").value.trim();

  const cancion = {
    titulo,
    autor,
    tono,
    etiquetas
  };

  secciones.forEach(sec => {
    if (sec.contenido.trim()) {
      cancion[sec.tipo] = sec.contenido.trim();
    }
  });

  if (youtube || pdf) {
    cancion.partitura = {
      video: youtube,
      pdf: pdf
    };
  }

  const codigo = JSON.stringify(cancion, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/\\n/g, "\n");

  document.getElementById("resultado").value = codigo;
}

function copiarCodigo() {
  const resultado = document.getElementById("resultado");
  resultado.select();
  document.execCommand("copy");
  alert("Código copiado");
}