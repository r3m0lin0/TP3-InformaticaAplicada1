// ==========================================
// LÓGICA DEL RANKING
// ==========================================

// Muestra el ranking guardado en localStorage dentro del contenedor indicado
function mostrarRanking(idContenedor, claveLS) {
  let contenedor = document.querySelector(idContenedor);
  contenedor.innerHTML = ""; // Limpia el contenido actual

  // Obtiene los datos o crea un arreglo vacío si no hay nada
  let ranking = JSON.parse(localStorage.getItem(claveLS)) || [];

  if (ranking.length === 0) {
    let p = document.createElement("p");
    p.textContent = "No hay puntajes registrados aún. ¡Juega para aparecer aquí!";
    p.style.textAlign = "center";
    p.style.fontStyle = "italic";
    p.style.color = "#666";
    contenedor.appendChild(p);
    return;
  }

  // Ordenar por PUNTOS de mayor a menor (Algoritmo Burbuja)
  for (let i = 0; i < ranking.length - 1; i++) {
    for (let j = 0; j < ranking.length - 1 - i; j++) {
      if (ranking[j].puntos < ranking[j + 1].puntos) {
        let temp = ranking[j];
        ranking[j] = ranking[j + 1];
        ranking[j + 1] = temp;
      }
    }
  }

  // Crear la estructura de la tabla
  let tabla = document.createElement("table");
  
  // Encabezados de la tabla
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  let headers = ["Pos", "Apodo", "País", "Color", "Puntos", "Tiempo (s)", "Fecha", "Hora"];
  
  headers.forEach(text => {
    let th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  tabla.appendChild(thead);

  // Cuerpo de la tabla con los datos de los jugadores
  let tbody = document.createElement("tbody");
  for (let i = 0; i < ranking.length; i++) {
    let jugador = ranking[i];
    let row = document.createElement("tr");
    
    // Datos a mostrar en cada fila
    const colorTexto = {
      verde: '#2ecc71',
      amarillo: '#f1c40f',
      rojo: '#e74c3c',
      azul: '#3498db'
    };

    let celdas = [
      i + 1,             // Posición
      jugador.nombre,    // Apodo
      jugador.pais,      // País
      jugador.color || "rojo", // Color del hacha
      jugador.puntos,    // Puntaje
      jugador.tiempo,    // Tiempo sobrevivido
      jugador.fecha,     // Fecha de juego
      jugador.hora       // Hora de juego
    ];

    celdas.forEach((dato, index) => {
      let td = document.createElement("td");
      if (index === 3) {
        let color = (jugador.color || 'rojo').toLowerCase();
        td.textContent = dato;
        td.style.color = colorTexto[color] || '#e74c3c';
        td.style.fontWeight = '700';
      } else {
        td.textContent = dato;
      }
      row.appendChild(td);
    });

    tbody.appendChild(row);
  }
  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);
}

// Función para borrar todo el historial
function reiniciarRanking(claveLS, idContenedor) {
  if(confirm("¿Estás seguro de que quieres borrar todo el historial de puntajes?")) {
    localStorage.removeItem(claveLS);
    mostrarRanking(idContenedor, claveLS);
  }
}

// Se ejecuta automáticamente cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function() {
  mostrarRanking("#rankingLeñador", "rankingLeñador");
});

// Evento para el botón de borrar ranking
let btnReiniciar = document.querySelector("#reiniciarRanking");
if (btnReiniciar) {
  btnReiniciar.onclick = function() {
    reiniciarRanking("rankingLeñador", "#rankingLeñador");
  };
}