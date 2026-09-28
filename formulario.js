// Variables globales compartidas con el juego
let jugadorNombre = "";
let jugadorPais = "";
let jugadorColor = 'rojo';
let formVisible = false;

const STORAGE_KEY_JUGADOR = 'jugadorActualLeñador';
const STORAGE_KEY_RANKING = 'rankingLeñador';
const STORAGE_KEY_AUDIO = 'audioLeñador';
let audioHabilitado = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIO) ?? 'true');

const paisesDisponibles = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda",
  "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice",
  "Benín", "Bielorrusia", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil",
  "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya",
  "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Colombia",
  "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica",
  "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador",
  "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España",
  "Estados Unidos", "Estonia", "Eswatini", "Etiopía", "Filipinas", "Finlandia", "Fiyi",
  "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala",
  "Guyana", "Guinea", "Guinea-Bisáu", "Guinea Ecuatorial", "Haití", "Honduras",
  "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Israel",
  "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán",
  "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia",
  "Liechtenstein", "Lituania", "Luxemburgo", "Macedonia del Norte", "Madagascar",
  "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio",
  "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria",
  "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Panamá",
  "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido",
  "República Centroafricana", "República Checa", "República Dominicana", "Rumania",
  "Rusia", "Ruanda", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas",
  "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona",
  "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica", "Sudán", "Sudán del Sur",
  "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental",
  "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu",
  "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Vaticano", "Venezuela",
  "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

// Función para mostrar el formulario al inicio
function obtenerJugadorGuardado() {
  const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY_JUGADOR) || 'null');
  return guardado || { nombre: '', pais: '', color: 'rojo' };
}

function guardarJugadorActual(nombre, pais, color = 'rojo') {
  const jugador = { nombre, pais, color };
  localStorage.setItem(STORAGE_KEY_JUGADOR, JSON.stringify(jugador));
  jugadorNombre = nombre;
  jugadorPais = pais;
  jugadorColor = color;
}

function setAudioHabilitado(habilitado) {
  audioHabilitado = habilitado;
  localStorage.setItem(STORAGE_KEY_AUDIO, JSON.stringify(habilitado));

  const btn = document.getElementById('btn-audio-toggle');
  if (btn) {
    btn.textContent = audioHabilitado ? '🔊 Audio: ON' : '🔇 Audio: OFF';
    btn.setAttribute('aria-pressed', String(audioHabilitado));
  }
}

function toggleAudio() {
  setAudioHabilitado(!audioHabilitado);
}

function mostrarFormularioInicio() {
  const jugadorGuardado = obtenerJugadorGuardado();

  if (jugadorGuardado.nombre) {
    jugadorNombre = jugadorGuardado.nombre;
    jugadorPais = jugadorGuardado.pais || 'Desconocido';
    jugadorColor = jugadorGuardado.color || 'rojo';
    iniciarJuego();
    return;
  }

  if (document.getElementById('formulario-juego')) return;

  let form = document.createElement('div');
  form.id = 'formulario-juego';
  form.className = 'overlay-form';

  form.innerHTML = `
    <h2 style="margin-top:0;">🪓 Nuevo Juego</h2>
    <p>Ingresa tus datos para comenzar:</p>
    <input type="text" id="inp-nombre" placeholder="Tu Apodo">
    <br>
    <div style="max-height: 220px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; margin: 8px auto; background: rgba(255,255,255,0.08); width: 85%; padding: 6px; box-sizing: border-box;">
      <select id="inp-pais" size="8" style="width: 100%; min-height: 160px; background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 6px; padding: 8px; font-size: 14px;">
        ${paisesDisponibles.map(pais => `<option value="${pais}">${pais}</option>`).join('')}
      </select>
    </div>
    <div style="margin-top: 12px; text-align: left; width: 85%; margin-left: auto; margin-right: auto;">
      <label style="display:block; margin-bottom:12px; font-weight:600;">Elige el color del hacha:</label>
      <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <button type="button" class="color-option selected" data-color="verde" style="width:52px; height:52px; border-radius:50%; border:3px solid #fff; background:#2ecc71; box-shadow:0 0 0 2px rgba(255,255,255,0.25); cursor:pointer;" title="Verde"></button>
        <button type="button" class="color-option" data-color="amarillo" style="width:52px; height:52px; border-radius:50%; border:3px solid #fff; background:#f1c40f; box-shadow:0 0 0 2px rgba(255,255,255,0.25); cursor:pointer;" title="Amarillo"></button>
        <button type="button" class="color-option" data-color="rojo" style="width:52px; height:52px; border-radius:50%; border:3px solid #fff; background:#e74c3c; box-shadow:0 0 0 2px rgba(255,255,255,0.25); cursor:pointer;" title="Rojo"></button>
        <button type="button" class="color-option" data-color="azul" style="width:52px; height:52px; border-radius:50%; border:3px solid #fff; background:#3498db; box-shadow:0 0 0 2px rgba(255,255,255,0.25); cursor:pointer;" title="Azul"></button>
      </div>
      <input type="hidden" id="inp-color-hacha" value="verde">
    </div>
    <br>
    <button id="btn-accion" class="btn-jugar">INICIAR JUEGO</button>
  `;

  document.body.appendChild(form);
  formVisible = true;

  document.querySelectorAll('.color-option').forEach((btn) => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.color-option').forEach((b) => {
        b.classList.remove('selected');
        b.style.transform = 'scale(1)';
        b.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.25)';
      });

      this.classList.add('selected');
      this.style.transform = 'scale(1.12)';
      this.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.7)';
      document.getElementById('inp-color-hacha').value = this.dataset.color;
    });
  });

  document.getElementById('btn-accion').onclick = function() {
    let nombre = document.getElementById('inp-nombre').value.trim() || "Anónimo";
    let pais = document.getElementById('inp-pais').value.trim() || "Desconocido";
    let colorSeleccionado = document.getElementById('inp-color-hacha').value || 'rojo';

    guardarJugadorActual(nombre, pais, colorSeleccionado);
    cerrarFormulario();
    iniciarJuego();
  };
}

// Función para mostrar pantalla de derrota
function mostrarPantallaDerrota(puntos, tiempoRestante, anchoBarraIni, textoMensaje) {
  if (document.getElementById('formulario-juego')) return;

  let tiempoInicialSegundos = anchoBarraIni / 10;
  let tiempoJugado = Math.max(0, tiempoInicialSegundos - tiempoRestante);
  
  let ahora = new Date();
  let fecha = ahora.toLocaleDateString();
  let hora = ahora.toLocaleTimeString();

  // Guardar datos usando la función de abajo
  guardarEnRanking(jugadorNombre, jugadorPais, jugadorColor, puntos, tiempoJugado, fecha, hora);

  let form = document.createElement('div');
  form.id = 'formulario-juego';
  form.className = 'overlay-form';
  form.style.background = 'rgba(103, 55, 58, 0.95)'; // Color Bordó

  form.innerHTML = `
    <h2 style="margin-top:0;">💀 ¡Juego Terminado!</h2>
    <p style="font-size:18px;">${textoMensaje}</p>
    <p>Puntos: <strong>${puntos}</strong> | Tiempo: <strong>${tiempoJugado}s</strong></p>
    <p>Jugador: ${jugadorNombre} (${jugadorPais})</p>
    <p>Hacha: <strong>${jugadorColor || 'rojo'}</strong></p>
    <div style="display:flex; gap:10px; justify-content:center; margin-top:20px; flex-wrap: wrap;">
      <button id="btn-reintentar" class="btn-reintentar">🔄 Jugar de Nuevo</button>
      <button id="btn-cambiar-usuario" class="btn-ranking">👤 Cambiar de Usuario</button>
      <button id="btn-audio-toggle" class="btn-toggle">${audioHabilitado ? '🔊 Audio: ON' : '🔇 Audio: OFF'}</button>
      <button id="btn-ranking" class="btn-ranking">🏆 Ver Ranking</button>
    </div>
  `;

  document.body.appendChild(form);
  formVisible = true;

  document.getElementById('btn-reintentar').onclick = function() {
    cerrarFormulario();

    const jugadorGuardado = obtenerJugadorGuardado();
    if (jugadorGuardado.nombre) {
      jugadorNombre = jugadorGuardado.nombre;
      jugadorPais = jugadorGuardado.pais || 'Desconocido';
      iniciarJuego();
    } else {
      mostrarFormularioInicio();
    }
  };

  document.getElementById('btn-cambiar-usuario').onclick = function() {
    localStorage.removeItem(STORAGE_KEY_JUGADOR);
    cerrarFormulario();
    mostrarFormularioInicio();
  };

  document.getElementById('btn-audio-toggle').onclick = function() {
    toggleAudio();
    this.textContent = audioHabilitado ? '🔊 Audio: ON' : '🔇 Audio: OFF';
  };

  document.getElementById('btn-ranking').onclick = function() {
    window.location.href = 'ranking.html';
  };
}

function cerrarFormulario() {
  let form = document.getElementById('formulario-juego');
  if (form) document.body.removeChild(form);
  formVisible = false;
}

function guardarEnRanking(nombre, pais, color, pts, tiempo, fecha, hora) {
  let nuevoRegistro = { nombre, pais, color: color || 'rojo', puntos: pts, tiempo, fecha, hora };
  let ranking = JSON.parse(localStorage.getItem(STORAGE_KEY_RANKING)) || [];

  let indice = ranking.findIndex(item => item.nombre.toLowerCase() === nombre.toLowerCase() && item.pais.toLowerCase() === pais.toLowerCase());

  if (indice === -1) {
    ranking.push(nuevoRegistro);
  } else {
    const registroActual = ranking[indice];
    ranking[indice] = {
      ...registroActual,
      color: color || registroActual.color || 'rojo',
      puntos: Math.max(registroActual.puntos, pts),
      tiempo: Math.min(registroActual.tiempo, tiempo),
      fecha,
      hora
    };
  }

  localStorage.setItem(STORAGE_KEY_RANKING, JSON.stringify(ranking));
}