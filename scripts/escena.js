/**
 * escena.js — las partes cinematográficas del juego.
 *
 *  - introJefe(): viñetas estilo manga antes de pelear con el jefe del distrito.
 *  - animarPortada(): la escena que corre sola en la pantalla de inicio.
 *  - galeriaPersonajes(): las tarjetas con los bichos que el alumno va a encontrar.
 *
 * Nada de esto afecta a la lógica del juego: si se quita, el juego sigue andando.
 */
import { pintar, miniatura, medida } from "./sprites.js";
import { Audio } from "./audio.js";

/* ==============================================================
   1. VIÑETAS DEL JEFE
   ============================================================== */
const capa = document.getElementById("manga");

export function introJefe({ nombre, sprite, distrito, retos }, alTerminar) {
  let cerrado = false;
  const cerrar = () => {
    if (cerrado) return;
    cerrado = true;
    capa.classList.remove("visible");
    capa.hidden = true;
    capa.innerHTML = "";
    clearTimeout(temporizador);
    alTerminar();
  };

  capa.innerHTML = `
    <div class="manga-tiras">
      <div class="vineta v1">
        <div class="lineas"></div>
        <span class="texto">Algo grande se mueve al final de ${distrito}…</span>
      </div>
      <div class="vineta v2">
        <div class="lineas rapidas"></div>
        <span class="retrato" id="manga-jefe"></span>
        <span class="nombre">${nombre}</span>
      </div>
      <div class="vineta v3">
        <span class="retrato chico" id="manga-jose"></span>
        <span class="texto">«${retos} preguntas y cae.»</span>
      </div>
      <div class="estampa">¡A PELEAR!</div>
    </div>
    <button class="saltar">Saltar ▸</button>`;

  capa.querySelector("#manga-jefe").appendChild(miniatura(sprite, 5));
  capa.querySelector("#manga-jose").appendChild(miniatura("jose_quieto", 5));
  capa.hidden = false;
  setTimeout(() => capa.classList.add("visible"), 16);   // deja que aplique la transición

  // golpes de sonido acompañando cada viñeta
  [0, 550, 1100].forEach((ms, i) => setTimeout(() => Audio.tono(160 + i * 90, 0.18, "square", 0.05), ms));
  setTimeout(() => Audio.golpe(), 1750);

  capa.addEventListener("click", cerrar, { once: true });
  const temporizador = setTimeout(cerrar, 2900);
}

/* ==============================================================
   2. ESCENA ANIMADA DE LA PORTADA
   ============================================================== */
export function animarPortada(lienzo) {
  const ctx = lienzo.getContext("2d");
  const A = lienzo.width, H = lienzo.height;
  const SUELO = H - 26;
  let t = 0, corriendo = true;

  // objetos que cruzan la escena
  const monedas = [0, 1, 2].map((i) => ({ x: 180 + i * 260, y: SUELO - 74 }));
  const bichos = [
    { x: 320, sprite: "gaviota" },
    { x: 700, sprite: "cono" },
  ];

  function cuadro() {
    if (!corriendo) return;
    t++;
    const desp = t * 1.7;   // la escena se desplaza sola

    // cielo del amanecer
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1b2b52"); g.addColorStop(0.6, "#4a6ea8"); g.addColorStop(1, "#f0b26b");
    ctx.fillStyle = g; ctx.fillRect(0, 0, A, H);

    // cerros y grúas al fondo
    for (let i = 0; i < 8; i++) {
      const x = (i * 190 - (desp * 0.25) % 190 + A + 190) % (A + 380) - 190;
      ctx.fillStyle = "#243b56";
      ctx.fillRect(x + 30, SUELO - 96, 7, 96);
      ctx.fillRect(x + 30, SUELO - 100, 74, 6);
      ctx.fillStyle = "#2f6b8f";
      ctx.fillRect(x + 110, SUELO - 34, 40, 20);
      ctx.fillStyle = "#c14a22";
      ctx.fillRect(x + 110, SUELO - 54, 40, 20);
    }

    // piso
    ctx.fillStyle = "#5d6b78"; ctx.fillRect(0, SUELO, A, H - SUELO);
    ctx.fillStyle = "#8fa3b0"; ctx.fillRect(0, SUELO, A, 5);
    for (let i = 0; i < 30; i++) {
      const x = (i * 61 - desp % 61 + A) % (A + 61) - 30;
      ctx.fillStyle = "rgba(0,0,0,.16)";
      ctx.fillRect(x, SUELO + 12, 9, 5);
    }

    // monedas girando
    monedas.forEach((m, i) => {
      const x = (m.x - desp % (A + 300) + A + 300) % (A + 300) - 60;
      const gira = Math.floor((t + i * 9) / 9) % 4;
      pintar(ctx, gira === 2 ? "moneda_b" : "moneda_a", x, m.y + Math.sin((t + i * 20) / 20) * 3);
    });

    // bichos con su globito
    bichos.forEach((b, i) => {
      const x = (b.x - desp % (A + 400) + A + 400) % (A + 400) - 60;
      const flota = Math.sin((t + i * 30) / 16) * 2;
      pintar(ctx, b.sprite, x, SUELO - 26 + flota, true);
      ctx.fillStyle = "rgba(18,16,42,.85)";
      ctx.fillRect(x + 8, SUELO - 44 + flota, 14, 12);
      ctx.fillStyle = "#ffd166";
      ctx.font = "bold 11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("?", x + 15, SUELO - 34 + flota);
      ctx.textAlign = "left";
    });

    // José corriendo en el sitio, con saltitos cada cierto rato
    const cicloSalto = t % 200;
    const salto = cicloSalto < 40 ? -Math.sin((cicloSalto / 40) * Math.PI) * 54 : 0;
    const enAire = salto < -1;
    const sprite = enAire ? "jose_salta" : (Math.floor(t / 6) % 2 ? "jose_paso_a" : "jose_paso_b");
    const m = medida(sprite);
    pintar(ctx, sprite, 96, SUELO - m.alto + salto);

    // garúa
    ctx.strokeStyle = "rgba(200,225,255,.30)"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      const x = (i * 137 + t * 2.4) % (A + 40) - 20;
      const y = (i * 71 + t * 7) % H;
      ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9);
    }
    ctx.stroke();

    requestAnimationFrame(cuadro);
  }
  cuadro();

  return () => { corriendo = false; };
}

/* ==============================================================
   3. TARJETAS DE PERSONAJES
   ============================================================== */
const FICHAS = [
  { sprite: "jose_quieto", nombre: "José", texto: "Tú. Corre, salta y responde." },
  { sprite: "gaviota", nombre: "Gaviota Encuestadora", texto: "Quiere encuestar a toda la población, uno por uno." },
  { sprite: "contenedor", nombre: "Contenedor Sesgado", texto: "Elige siempre la muestra que más le conviene." },
  { sprite: "pulpo", nombre: "El Pulpo del Censo", texto: "Jefe del puerto: insiste en censar hasta el último panetón." },
  { sprite: "paloma", nombre: "Paloma Presumida", texto: "Confunde estratos con conglomerados." },
  { sprite: "combi", nombre: "La Combi Polietápica", texto: "Jefa del malecón: cambia de ruta en cada etapa." },
  { sprite: "cuy", nombre: "Cuy Cualitativo", texto: "Cree que todo número mide algo." },
  { sprite: "torito", nombre: "El Torito de las Escalas", texto: "Jefe de la plaza: confunde intervalo con razón." },
  { sprite: "flor", nombre: "La Flor sin Título", texto: "Dibuja tablas y gráficos preciosos, pero sin título." },
  { sprite: "ardilla", nombre: "La Ardilla del Pastel", texto: "Quiere un gráfico circular hasta para las jerárquicas." },
  { sprite: "monumento", nombre: "El Monumento sin Leyenda", texto: "Jefe de Jesús María: compara dos grupos y no rotula ninguno." },
  { sprite: "globo", nombre: "El Globo Asimétrico", texto: "Nunca sabe hacia qué lado se le fue la colita." },
  { sprite: "diana", nombre: "La Diana Bimodal", texto: "Tiene dos modas y jura que la distribución es unimodal." },
  { sprite: "payaso", nombre: "El Payaso de un Solo Plano", texto: "Jefe de Lince: mete dos grupos discretos en el mismo plano cartesiano." },
  { sprite: "maletin", nombre: "El Maletín Redondeado", texto: "Redondea el TIC como se le antoja y deja datos fuera." },
  { sprite: "cafe", nombre: "El Café Acumulado", texto: "Confunde la frecuencia simple con la acumulada." },
  { sprite: "ejecutivo", nombre: "El Ejecutivo de los Tallos", texto: "Jefe de San Isidro: nunca sabe dónde partir el número." },
  { sprite: "parapente", nombre: "El Parapente sin Cerrar", texto: "Su polígono se queda abierto y no sabe por qué." },
  { sprite: "cangrejo", nombre: "El Cangrejo de las Marcas", texto: "Lee el rango en las marcas de clase y se queda corto." },
  { sprite: "gato", nombre: "El Gato Superpuesto", texto: "Jefe de Miraflores: compara dos grupos tapando un histograma con el otro." },
  { sprite: "guitarra", nombre: "La Guitarra de Chabuca", texto: "Toca las notas una por una y nunca las suma: su ojiva sale sin acumular." },
  { sprite: "aerosol", nombre: "El Aerosol de la Bajada", texto: "Pinta murales cuesta abajo y le sale una ojiva que decrece." },
  { sprite: "cajon", nombre: "El Cajón al Revés", texto: "Se sienta encima y ya no distingue el «menor que» del «mayor que»." },
  { sprite: "bohemio", nombre: "El Bohemio del Puente", texto: "Jefe de Barranco: cuando el punto no cae en la reja, pide un deseo en vez de interpolar." },
  { sprite: "bote", nombre: "El Bote de la Herradura", texto: "Como la bahía, va y vuelve: cree que el eje del tiempo también puede ir para atrás." },
  { sprite: "red", nombre: "La Red de un Solo Eje", texto: "Echa litros y soles a la misma red, cuando eso pedía un gráfico de doble eje." },
  { sprite: "pelicano", nombre: "El Pelícano de Villa", texto: "Se posa en cualquier orden, y así mismo arma su Pareto." },
  { sprite: "pescador", nombre: "El Pescador sin Prioridad", texto: "Jefe de Chorrillos: jala toda la red de un tirón sin elegir qué problema vale la pena arreglar." },
  { sprite: "carretilla", nombre: "La Carretilla Desnivelada", texto: "Carga todo de un lado: con un solo dato atípico se le va el promedio." },
  { sprite: "ladrillo", nombre: "El Ladrillo sin Peso", texto: "Promedia lotes de distinto tamaño como si todos pesaran igual." },
  { sprite: "casco", nombre: "El Casco Desordenado", texto: "Quiere al del medio de la fila, pero nunca forma la fila." },
  { sprite: "capataz", nombre: "El Capataz del Grupo Residencial", texto: "Jefe de Villa El Salvador: busca el centro contando manzanas, no familias." },
  { sprite: "maniqui", nombre: "El Maniquí Amodal", texto: "En su vitrina todos los modelos se venden igualito, así que ninguno es el más usual." },
  { sprite: "carrete", nombre: "El Carrete de Dos Colores", texto: "Dos intervalos empatan en el fi más alto y él insiste en que la moda es una sola." },
  { sprite: "tijera", nombre: "La Tijera del Intervalo", texto: "Corta con el TIC del intervalo de al lado y le sale una moda fuera de sitio." },
  { sprite: "jalador", nombre: "El Jalador de la Galería", texto: "Jefe de La Victoria: le sube lo mismo a todos los precios y jura que las medidas no se mueven." },
  { sprite: "boleto", nombre: "El Boleto sin Ordenar", texto: "Pide el dato de la posición 6 sin haber hecho antes la cola de menor a mayor." },
  { sprite: "tarjeta", nombre: "La Tarjeta del Porcentaje", texto: "Le preguntan por el P45 y responde «45»: confunde el valor del cuantil con su porcentaje." },
  { sprite: "tope", nombre: "El Tope del Cien", texto: "Se para en el final de la vía y jura que ahí todavía hay un percentil 100." },
  { sprite: "tren", nombre: "El Tren sin Interpolar", texto: "Jefe de San Juan de Lurigancho: la posición le sale 3,25 y él se baja en la estación 3." },
  { sprite: "piedra", nombre: "La Piedra del Huaico", texto: "Baja sola por la quebrada y con ese único dato le infla el rango a todo el valle." },
  { sprite: "termometro", nombre: "El Termómetro sin Comparar", texto: "Pone dos desviaciones estándar lado a lado sin fijarse en que los promedios son distintos." },
  { sprite: "cinta", nombre: "La Cinta al Cuadrado", texto: "Mide en metros y jura que la varianza también sale en metros." },
  { sprite: "chacarero", nombre: "El Chacarero de la Constante", texto: "Jefe de Chaclacayo: le suma lo mismo a cada planta y jura que ahora su chacra quedó más dispersa." },
  { sprite: "neblina", nombre: "La Neblina de una Sola Ladera", texto: "Ve la colita de un lado y bautiza la asimetría del otro." },
  { sprite: "lucuma", nombre: "La Lúcuma sin Raíz", texto: "Le dan la varianza y la mete a la fórmula de Pearson sin sacarle la raíz." },
  { sprite: "caballo", nombre: "El Caballo de los Dos Pasos", texto: "Tiene dos modas y aun así quiere que le calculen el coeficiente de Pearson." },
  { sprite: "guia", nombre: "El Guía de las Lomas", texto: "Jefe de Pachacámac: te sube a medir qué tan paradita está la puntita sin revisar si el cerro tiene una sola." },
  { sprite: "sombrilla", nombre: "La Sombrilla del Medio", texto: "Planta su sombrilla en el promedio y jura que ahí adentro va la línea de la mediana." },
  { sprite: "flotador", nombre: "El Flotador sin el 1,5", texto: "Arma los límites con el puro recorrido intercuartílico y se olvida de multiplicarlo por 1,5." },
  { sprite: "yate", nombre: "El Yate Fondeado Lejos", texto: "Se ancló fuera de los límites y aun así cree que el bigote se estira hasta él." },
  { sprite: "salvavidas", nombre: "El Salvavidas de la Bahía", texto: "Jefe de Ancón: decide a ojo quién se salió del grupo en vez de calcular los límites." },
  { sprite: "varilla", nombre: "La Varilla del Promedio Simple", texto: "Suma los porcentajes y los divide entre los años, como si el crecimiento se sumara." },
  { sprite: "mezcladora", nombre: "La Mezcladora sin Factor", texto: "Echa los porcentajes crudos a la raíz en vez de los índices de crecimiento." },
  { sprite: "escalera", nombre: "La Escalera que no Resta el Uno", texto: "Se queda con el índice y lo canta como si ya fuera la tasa de crecimiento." },
  { sprite: "maestro", nombre: "El Maestro de Obra del Cono Norte", texto: "Jefe de Los Olivos: saca el promedio de crecimiento sumando y dividiendo, y por eso su edificio nunca cuadra." },
  { sprite: "colibri", nombre: "El Colibrí que se Sale del Mapa", texto: "Geoglifo de Nazca: cree que un evento puede tener más elementos que su propio espacio muestral." },
  { sprite: "mono", nombre: "El Mono de la Cola Infinita", texto: "Jura que todo espacio muestral infinito es continuo, y se olvida de los infinitos numerables." },
  { sprite: "arana", nombre: "La Araña de las Patas Cruzadas", texto: "Ve que la intersección de los tres es vacía y de ahí concluye que son excluyentes de dos en dos." },
  { sprite: "astronauta", nombre: "El Astronauta Desubicado", texto: "Mete el conjunto vacío y todo omega dentro de una partición, que es justo lo que no puede entrar." },
  { sprite: "puquio", nombre: "El Puquio que Suma de Más", texto: "Junta los dos conjuntos sin restar lo que comparten, y termina contando dos veces lo mismo." },
  { sprite: "piloto", nombre: "El Piloto del Sobrevuelo", texto: "Jefe de Nazca: es el único que ve el dibujo entero desde arriba, y aun así cuenta mal los casos." },
  { sprite: "friso", nombre: "El Friso de los Peces Volteados", texto: "Chan Chan: usa combinatorias cuando el orden sí importa, y el friso le sale igualito al revés." },
  { sprite: "panuelo", nombre: "La Pañoleta de la Marinera", texto: "Usa permutaciones cuando el orden no importa, y cuenta el mismo grupo muchas veces." },
  { sprite: "vasija", nombre: "La Vasija del Mismo Diseño", texto: "Con elementos repetidos no divide entre los factoriales de lo que se repite." },
  { sprite: "adobe", nombre: "El Adobe del Signo Más", texto: "Cuando hay dos grupos y hay que elegir de los dos, suma en lugar de multiplicar." },
  { sprite: "perro", nombre: "El Perro Sin Pelo de la Huaca", texto: "No se fija si el nombre vuelve a la bolsa o no, y mezcla el con reemplazo con el sin reemplazo." },
  { sprite: "curaca", nombre: "El Curaca de Chan Chan", texto: "Jefe de Trujillo: manda tejer el friso sin decidir antes si cambiar el orden cambia el diseño." },
  { sprite: "paiche", nombre: "El Paiche del Porcentaje", texto: "Belén: canta la probabilidad en porcentaje cuando en Esta 1 va siempre en decimales." },
  { sprite: "charapa", nombre: "La Charapa que No Devuelve", texto: "Saca y no repone, pero sigue calculando como si todo volviera a la bolsa." },
  { sprite: "pequepeque", nombre: "El Peque-Peque de los Denominadores", texto: "Con reemplazo le baja el denominador en cada saque, cuando ahí el total no se mueve." },
  { sprite: "saco", nombre: "El Saco del «Al Menos Uno»", texto: "Se pone a sumar caso por caso en vez de irse por el complemento, que es una sola resta." },
  { sprite: "camucamu", nombre: "El Camu Camu del Orden", texto: "El enunciado dice «uno tras otro» y él igual mete combinatorias." },
  { sprite: "casero", nombre: "El Casero de Belén", texto: "Jefe de Iquitos: te vende del saco sin dejarte mirar adentro, y encima cuenta mal lo que queda." },
];

export function galeriaPersonajes(contenedor) {
  contenedor.innerHTML = "";
  FICHAS.forEach((f, i) => {
    const t = document.createElement("figure");
    t.className = "ficha";
    t.style.animationDelay = `${i * 90}ms`;
    t.appendChild(miniatura(f.sprite, 3));
    t.insertAdjacentHTML("beforeend",
      `<figcaption><b>${f.nombre}</b><span>${f.texto}</span></figcaption>`);
    contenedor.appendChild(t);
  });
}
