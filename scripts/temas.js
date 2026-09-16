/**
 * temas.js — la identidad visual de cada distrito.
 *
 * Un tema decide TODO lo que hace que un distrito se sienta distinto:
 * cielo, arquitectura de fondo, vegetación, clima, colores del suelo,
 * qué bichos aparecen y cómo se llaman.
 *
 * Para crear un distrito nuevo: agrega una entrada acá y apunta a ella
 * desde el JSON del nivel con "tema": "nombreDelTema".
 */
import { CFG } from "./config.js";

const T = CFG.TILE;

/* Utilidad: repite un elemento de fondo a lo largo del nivel con parallax. */
function repetir(ctx, cam, paso, factor, dibujo) {
  const desfase = (cam * factor) % paso;
  for (let i = -1; i < Math.ceil(CFG.ANCHO_VISTA / paso) + 2; i++) {
    dibujo(i * paso - desfase, i);
  }
}

export const TEMAS = {
  /* =========================================================
     CALLAO — puerto al amanecer, garúa fina, grúas y contenedores
     ========================================================= */
  puerto: {
    nombre: "Puerto",
    cielo: [[0, "#1b2b52"], [0.45, "#3f5f8f"], [0.75, "#c98a5e"], [1, "#f2c078"]],
    suelo: { cara: "#5d6b78", borde: "#8fa3b0", tierra: "#3b4650", plataforma: "#c96a3c", plataformaBorde: "#e89a63" },
    acento: "#38bdf8",
    bichos: ["gaviota", "ancla", "contenedor"],
    nombresBichos: ["Gaviota Encuestadora", "Ancla Terca", "Contenedor Sesgado"],
    jefe: "pulpo",
    nombreJefe: "El Pulpo del Censo",

    fondo(ctx, cam, t) {
      // mar al fondo
      ctx.fillStyle = "#20406b";
      ctx.fillRect(0, 300, CFG.ANCHO_VISTA, 84);
      for (let i = 0; i < 26; i++) {
        const x = (i * 63 - (cam * 0.12) % 63 + 800) % 860 - 30;
        const y = 312 + ((i * 17) % 60);
        ctx.fillStyle = "rgba(255,255,255,.18)";
        ctx.fillRect(x, y, 16, 2);
      }
      // barcos lejanos
      repetir(ctx, cam, 420, 0.18, (x) => {
        ctx.fillStyle = "#16233d";
        ctx.fillRect(x + 40, 292, 78, 14);
        ctx.fillRect(x + 62, 274, 10, 18);
        ctx.fillRect(x + 82, 280, 6, 12);
      });
      // grúas del puerto
      repetir(ctx, cam, 260, 0.42, (x) => {
        ctx.fillStyle = "#243b56";
        ctx.fillRect(x + 30, 232, 9, 152);
        ctx.fillRect(x + 30, 226, 104, 8);
        ctx.fillRect(x + 124, 234, 6, 30);
        ctx.fillStyle = "#ff9f45";
        ctx.fillRect(x + 26, 220, 17, 8);
      });
      // faro (queda al fondo, sobre la línea del horizonte)
      repetir(ctx, cam, 900, 0.3, (x) => {
        ctx.fillStyle = "#f2f6ff"; ctx.fillRect(x + 700, 244, 16, 92);
        ctx.fillStyle = "#ff5470";
        ctx.fillRect(x + 700, 262, 16, 9); ctx.fillRect(x + 700, 286, 16, 9);
        ctx.fillStyle = "#ffd166"; ctx.fillRect(x + 702, 234, 12, 10);
      });
      // pila de contenedores
      repetir(ctx, cam, 190, 0.62, (x, i) => {
        const cols = ["#2f6b8f", "#c14a22", "#3f7d5c", "#8f5da8"];
        for (let k = 0; k < 4; k++) {
          const cx = x + 20 + (k % 2) * 52, cy = 336 - Math.floor(k / 2) * 26;
          ctx.fillStyle = cols[(i + k) % cols.length];
          ctx.fillRect(cx, cy, 48, 24);
          ctx.fillStyle = "rgba(0,0,0,.25)";
          ctx.fillRect(cx, cy + 20, 48, 4);
        }
      });
    },

    clima(ctx, t) {
      // garúa chalaca: líneas finas y diagonales
      ctx.strokeStyle = "rgba(200,225,255,.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 70; i++) {
        const x = (i * 137 + t * 2.2) % 860 - 30;
        const y = (i * 71 + t * 6.5) % 500;
        ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9);
      }
      ctx.stroke();
      // banda de neblina
      ctx.fillStyle = "rgba(226,236,255,.10)";
      ctx.fillRect(0, 250 + Math.sin(t / 90) * 6, CFG.ANCHO_VISTA, 60);
    },
  },

  /* =========================================================
     SAN MIGUEL — parque frente al mar, sol, cometas y áreas verdes
     ========================================================= */
  parque: {
    nombre: "Parque",
    cielo: [[0, "#2f8fd6"], [0.5, "#6cc4ec"], [0.82, "#bfe8f7"], [1, "#e8f6c9"]],
    suelo: { cara: "#8a6a48", borde: "#5ec46a", tierra: "#5f452e", plataforma: "#9aa7c7", plataformaBorde: "#d8e2ff" },
    acento: "#4ade80",
    bichos: ["paloma", "cometa", "cono"],
    nombresBichos: ["Paloma Presumida", "Cometa Enredada", "Cono Mandón"],
    jefe: "combi",
    nombreJefe: "La Combi Polietápica",

    fondo(ctx, cam, t) {
      // sol
      ctx.fillStyle = "rgba(255,231,150,.95)";
      ctx.beginPath(); ctx.arc(690, 92, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,231,150,.18)";
      ctx.beginPath(); ctx.arc(690, 92, 54, 0, Math.PI * 2); ctx.fill();
      // mar al fondo
      ctx.fillStyle = "#2f8fd6";
      ctx.fillRect(0, 296, CFG.ANCHO_VISTA, 30);
      // cometas en el cielo
      repetir(ctx, cam, 340, 0.15, (x, i) => {
        const cy = 70 + ((i * 53) % 90) + Math.sin(t / 40 + i) * 8;
        const cx = x + 120;
        ctx.fillStyle = ["#ff5470", "#ffd166", "#4ade80"][i % 3];
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx + 10, cy); ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 10, cy);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, cy + 12); ctx.quadraticCurveTo(cx - 14, cy + 34, cx + 4, cy + 52); ctx.stroke();
      });
      // edificios del malecón
      repetir(ctx, cam, 200, 0.45, (x, i) => {
        const alto = 90 + ((i * 37) % 60);
        ctx.fillStyle = ["#e8e2d2", "#f4d9c0", "#dce6ef"][i % 3];
        ctx.fillRect(x + 24, 326 - alto, 96, alto);
        ctx.fillStyle = "rgba(90,110,130,.55)";
        for (let fy = 326 - alto + 12; fy < 316; fy += 20)
          for (let fx = x + 34; fx < x + 112; fx += 20) ctx.fillRect(fx, fy, 10, 12);
        ctx.fillStyle = "#c9553f";
        ctx.fillRect(x + 20, 326 - alto - 8, 104, 8);
      });
      // arboleda del parque
      repetir(ctx, cam, 150, 0.68, (x, i) => {
        const bx = x + 40, by = 350 - (i % 2) * 8;
        ctx.fillStyle = "#6b4a2c"; ctx.fillRect(bx + 12, by, 8, 34);
        ctx.fillStyle = i % 2 ? "#3f9d55" : "#4fbb63";
        ctx.beginPath(); ctx.arc(bx + 16, by - 6, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.15)";
        ctx.beginPath(); ctx.arc(bx + 9, by - 13, 9, 0, Math.PI * 2); ctx.fill();
      });
    },

    clima(ctx, t) {
      // hojitas y destellos que cruzan la pantalla
      for (let i = 0; i < 22; i++) {
        const x = (i * 191 - t * 1.4) % 860 - 30;
        const y = 60 + ((i * 83) % 300) + Math.sin(t / 30 + i) * 14;
        ctx.fillStyle = i % 3 ? "rgba(120,220,140,.55)" : "rgba(255,240,170,.65)";
        ctx.fillRect(x, y, 5, 4);
      }
    },
  },

  /* =========================================================
     PUEBLO LIBRE — plaza colonial al mediodía, casonas y palmeras
     ========================================================= */
  plaza: {
    nombre: "Plaza",
    cielo: [[0, "#5fb2e8"], [0.55, "#9ad6f2"], [0.85, "#ffe9c2"], [1, "#f7d9a0"]],
    suelo: { cara: "#c9a877", borde: "#e8cfa0", tierra: "#8f7448", plataforma: "#b8543f", plataformaBorde: "#e08f74" },
    acento: "#ff9f45",
    bichos: ["cuy", "farol", "paloma"],
    nombresBichos: ["Cuy Cualitativo", "Farol Apagado", "Paloma Ordinal"],
    jefe: "torito",
    nombreJefe: "El Torito de las Escalas",

    fondo(ctx, cam, t) {
      // sol de mediodía bien alto
      ctx.fillStyle = "rgba(255,244,200,.95)";
      ctx.beginPath(); ctx.arc(120, 62, 30, 0, Math.PI * 2); ctx.fill();
      // cerros secos al fondo
      for (let i = 0; i < 10; i++) {
        const hx = i * 300 - (cam * 0.2) % 3000;
        ctx.fillStyle = "#c2a882";
        ctx.beginPath();
        ctx.moveTo(hx, 330); ctx.lineTo(hx + 130, 214); ctx.lineTo(hx + 260, 330);
        ctx.closePath(); ctx.fill();
      }
      // casonas coloniales con balcones y teja
      repetir(ctx, cam, 210, 0.45, (x, i) => {
        const alto = 110 + ((i * 41) % 46);
        const cuerpo = ["#f4e7d2", "#f2d6b8", "#e8dcc0"][i % 3];
        ctx.fillStyle = cuerpo;
        ctx.fillRect(x + 20, 330 - alto, 118, alto);
        ctx.fillStyle = "#a8452c";                       // techo de teja
        ctx.fillRect(x + 12, 330 - alto - 12, 134, 12);
        ctx.fillStyle = "#7a5c3a";                       // balcón de madera
        ctx.fillRect(x + 36, 330 - alto + 30, 86, 26);
        ctx.fillStyle = "#3d2c1a";
        for (let bx = x + 40; bx < x + 118; bx += 10) ctx.fillRect(bx, 330 - alto + 34, 4, 18);
        ctx.fillStyle = "#5b7d99";                       // portón
        ctx.fillRect(x + 62, 330 - 42, 34, 42);
      });
      // palmeras de la plaza
      repetir(ctx, cam, 160, 0.66, (x, i) => {
        const px = x + 50, py = 352 - (i % 2) * 6;
        ctx.fillStyle = "#8a6a3f";
        ctx.fillRect(px + 8, py - 46, 7, 46);
        ctx.fillStyle = i % 2 ? "#3f9d55" : "#4fbb63";
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.ellipse(px + 11 + k * 13, py - 50, 15, 6, k * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      // banderitas de fiesta cruzando la plaza
      repetir(ctx, cam, 240, 0.55, (x) => {
        ctx.strokeStyle = "rgba(60,40,20,.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 150); ctx.quadraticCurveTo(x + 120, 178, x + 240, 150); ctx.stroke();
        for (let k = 1; k < 8; k++) {
          const bx = x + k * 30, by = 150 + Math.sin((k / 8) * Math.PI) * 26;
          ctx.fillStyle = ["#ff5470", "#ffd166", "#4ade80", "#38bdf8"][k % 4];
          ctx.beginPath();
          ctx.moveTo(bx, by); ctx.lineTo(bx + 9, by); ctx.lineTo(bx + 4, by + 12);
          ctx.closePath(); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // polvillo dorado flotando en el aire caliente
      for (let i = 0; i < 26; i++) {
        const x = (i * 173 + t * 0.6) % 860 - 30;
        const y = 90 + ((i * 97) % 280) + Math.sin(t / 40 + i) * 10;
        ctx.fillStyle = "rgba(255,226,160,.55)";
        ctx.fillRect(x, y, 3, 3);
      }
    },
  },

  /* =========================================================
     JESÚS MARÍA — Campo de Marte por la tarde: jacarandás en flor,
     las torres de la Residencial San Felipe y jardines geométricos
     ========================================================= */
  campo: {
    nombre: "Campo",
    cielo: [[0, "#3d5a9e"], [0.42, "#7f8fd0"], [0.78, "#e2a6c8"], [1, "#ffd9b0"]],
    suelo: { cara: "#6f8f4a", borde: "#9ed46b", tierra: "#4a5b30", plataforma: "#8f7bbd", plataformaBorde: "#c9b6ef" },
    acento: "#c084fc",
    bichos: ["flor", "banca", "ardilla"],
    nombresBichos: ["La Flor sin Título", "La Banca Descuadrada", "La Ardilla del Pastel"],
    jefe: "monumento",
    nombreJefe: "El Monumento sin Leyenda",

    fondo(ctx, cam, t) {
      // sol bajo de la tarde
      ctx.fillStyle = "rgba(255,214,170,.95)";
      ctx.beginPath(); ctx.arc(610, 150, 38, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,196,150,.16)";
      ctx.beginPath(); ctx.arc(610, 150, 66, 0, Math.PI * 2); ctx.fill();

      // torres de la Residencial San Felipe: bloques altos y parejos
      repetir(ctx, cam, 260, 0.32, (x, i) => {
        const alto = 150 + ((i * 53) % 70);
        ctx.fillStyle = ["#b9b0a4", "#a8a396", "#c6bcae"][i % 3];
        ctx.fillRect(x + 30, 330 - alto, 78, alto);
        // ventanas en rejilla, algunas ya encendidas
        for (let fy = 330 - alto + 14; fy < 318; fy += 18) {
          for (let fx = x + 38; fx < x + 102; fx += 16) {
            const encendida = ((fx + fy + i * 7) % 5) === 0;
            ctx.fillStyle = encendida ? "rgba(255,214,140,.9)" : "rgba(70,80,96,.6)";
            ctx.fillRect(fx, fy, 9, 11);
          }
        }
      });

      // jacarandás en flor: copa morada y tronco delgado
      repetir(ctx, cam, 145, 0.66, (x, i) => {
        const bx = x + 36, by = 352 - (i % 2) * 10;
        ctx.fillStyle = "#5b4630"; ctx.fillRect(bx + 13, by - 34, 6, 34);
        ctx.fillStyle = i % 2 ? "#8b5cf6" : "#a678f0";
        ctx.beginPath(); ctx.arc(bx + 16, by - 42, 20, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 3, by - 34, 13, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 29, by - 34, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.16)";
        ctx.beginPath(); ctx.arc(bx + 9, by - 50, 8, 0, Math.PI * 2); ctx.fill();
      });

      // jardines geométricos del parque, en franjas horizontales
      repetir(ctx, cam, 96, 0.82, (x, i) => {
        ctx.fillStyle = ["#e05f8f", "#ffd166", "#f2f6ff"][i % 3];
        for (let k = 0; k < 4; k++) ctx.fillRect(x + 10 + k * 18, 362 - (i % 2) * 4, 9, 5);
        ctx.fillStyle = "#4c6b33";
        ctx.fillRect(x + 6, 368 - (i % 2) * 4, 82, 4);
      });
    },

    clima(ctx, t) {
      // pétalos de jacarandá cayendo en diagonal
      for (let i = 0; i < 24; i++) {
        const x = (i * 167 - t * 0.9) % 860 - 30;
        const y = (50 + i * 89 + t * 0.7) % 380;
        ctx.fillStyle = i % 4 ? "rgba(168,120,240,.6)" : "rgba(255,214,180,.65)";
        ctx.fillRect(x, y, 4, 6);
      }
    },
  },

  /* =========================================================
     LINCE — feria de noche: carpa de circo, rueda de la fortuna,
     guirnaldas de focos y confeti en el aire
     ========================================================= */
  feria: {
    nombre: "Feria",
    cielo: [[0, "#140d2e"], [0.45, "#2b1b58"], [0.8, "#5b2a72"], [1, "#a3486b"]],
    suelo: { cara: "#7a4a8f", borde: "#c98adf", tierra: "#3f2455", plataforma: "#e0b23c", plataformaBorde: "#ffe28a" },
    acento: "#ffd166",
    bichos: ["globo", "diana", "algodon"],
    nombresBichos: ["El Globo Asimétrico", "La Diana Bimodal", "El Algodón de Barras"],
    jefe: "payaso",
    nombreJefe: "El Payaso de un Solo Plano",

    fondo(ctx, cam, t) {
      // luna y estrellas
      ctx.fillStyle = "rgba(255,247,214,.95)";
      ctx.beginPath(); ctx.arc(690, 74, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1b1240";
      ctx.beginPath(); ctx.arc(700, 66, 22, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 40; i++) {
        const x = (i * 197 - (cam * 0.05)) % 900 - 20;
        const y = 20 + ((i * 71) % 200);
        const brillo = 0.35 + 0.45 * Math.abs(Math.sin(t / 30 + i));
        ctx.fillStyle = `rgba(255,255,255,${brillo.toFixed(2)})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // rueda de la fortuna al fondo
      repetir(ctx, cam, 520, 0.22, (x) => {
        const cx = x + 150, cy = 208, r = 72;
        ctx.strokeStyle = "rgba(255,209,102,.75)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + t / 120;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
          ctx.fillStyle = ["#ff5470", "#ffd166", "#4ade80", "#38bdf8"][k % 4];
          ctx.fillRect(cx + Math.cos(a) * r - 5, cy + Math.sin(a) * r - 5, 10, 10);
        }
        ctx.strokeStyle = "rgba(200,160,90,.6)";
        ctx.beginPath(); ctx.moveTo(cx - 26, 330); ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 26, 330); ctx.stroke();
      });

      // carpas de circo a rayas
      repetir(ctx, cam, 230, 0.48, (x, i) => {
        const bx = x + 30, base = 330, alto = 96 + ((i * 29) % 26);
        ctx.fillStyle = i % 2 ? "#d94f6b" : "#e0396b";
        ctx.beginPath();
        ctx.moveTo(bx + 62, base - alto - 26);
        ctx.lineTo(bx + 124, base); ctx.lineTo(bx, base);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,245,225,.85)";
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.moveTo(bx + 62, base - alto - 26);
          ctx.lineTo(bx + 20 + k * 34, base); ctx.lineTo(bx + 32 + k * 34, base);
          ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = "#ffd166";
        ctx.beginPath(); ctx.arc(bx + 62, base - alto - 30, 5, 0, Math.PI * 2); ctx.fill();
      });

      // guirnaldas de focos cruzando la feria
      repetir(ctx, cam, 250, 0.7, (x) => {
        ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 172); ctx.quadraticCurveTo(x + 125, 214, x + 250, 172); ctx.stroke();
        for (let k = 1; k < 9; k++) {
          const p = k / 9;
          const fx = x + 250 * p;
          const fy = 172 + Math.sin(p * Math.PI) * 40;
          const on = ((k + Math.floor(t / 18)) % 3) !== 0;
          ctx.fillStyle = on ? ["#ffd166", "#ff8fab", "#8ef2c0"][k % 3] : "rgba(120,110,150,.5)";
          ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI * 2); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // confeti cayendo y girando
      for (let i = 0; i < 30; i++) {
        const x = (i * 149 + Math.sin(t / 40 + i) * 22) % 860 - 20;
        const y = (i * 73 + t * 1.1) % 400;
        ctx.fillStyle = ["rgba(255,209,102,.75)", "rgba(255,143,171,.75)", "rgba(142,242,192,.7)", "rgba(139,180,255,.7)"][i % 4];
        const ancho = 3 + (i % 2) * 2;
        ctx.fillRect(x, y, ancho, 5);
      }
    },
  },

  /* =========================================================
     SAN ISIDRO — el distrito financiero al mediodía: torres de
     vidrio, los olivos del Olivar y garúa fina de Lima
     ========================================================= */
  torres: {
    nombre: "Torres",
    cielo: [[0, "#8fa8c4"], [0.45, "#b6c8db"], [0.8, "#d8e3ec"], [1, "#eef3f7"]],
    suelo: { cara: "#8d99a6", borde: "#5f8f52", tierra: "#5b6470", plataforma: "#3f6f9e", plataformaBorde: "#8fc4ea" },
    acento: "#2f7fc4",
    bichos: ["maletin", "corbata", "cafe"],
    nombresBichos: ["El Maletín Redondeado", "La Corbata sin Unidad", "El Café Acumulado"],
    jefe: "ejecutivo",
    nombreJefe: "El Ejecutivo de los Tallos",

    fondo(ctx, cam, t) {
      // sol tapado por la garúa limeña
      ctx.fillStyle = "rgba(255,255,240,.45)";
      ctx.beginPath(); ctx.arc(560, 88, 40, 0, Math.PI * 2); ctx.fill();

      // torres de vidrio, altas y de distinto tono
      repetir(ctx, cam, 190, 0.3, (x, i) => {
        const alto = 170 + ((i * 61) % 90);
        const tono = ["#6f8ba8", "#7e99b4", "#607d9b"][i % 3];
        ctx.fillStyle = tono;
        ctx.fillRect(x + 24, 330 - alto, 92, alto);
        for (let fy = 330 - alto + 10; fy < 322; fy += 14) {
          ctx.fillStyle = "rgba(200,226,245,.55)";
          ctx.fillRect(x + 30, fy, 80, 7);
        }
        ctx.fillStyle = "rgba(255,255,255,.22)";
        ctx.fillRect(x + 30, 330 - alto, 18, alto);
        ctx.fillStyle = "#4a5b6b";
        ctx.fillRect(x + 68, 330 - alto - 18, 3, 18);
      });

      // torres bajas de segunda fila
      repetir(ctx, cam, 120, 0.5, (x, i) => {
        const alto = 70 + ((i * 37) % 40);
        ctx.fillStyle = ["#93a7ba", "#a4b5c5"][i % 2];
        ctx.fillRect(x + 14, 330 - alto, 62, alto);
        ctx.fillStyle = "rgba(70,90,110,.45)";
        for (let fy = 330 - alto + 8; fy < 324; fy += 12)
          for (let fx = x + 20; fx < x + 70; fx += 12) ctx.fillRect(fx, fy, 7, 7);
      });

      // los olivos del Olivar
      repetir(ctx, cam, 132, 0.7, (x, i) => {
        const bx = x + 40, by = 354 - (i % 2) * 8;
        ctx.fillStyle = "#6b5a3f"; ctx.fillRect(bx + 12, by - 30, 7, 30);
        ctx.fillStyle = i % 2 ? "#6f9a5c" : "#7fae6a";
        ctx.beginPath(); ctx.ellipse(bx + 15, by - 38, 22, 15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.18)";
        ctx.beginPath(); ctx.ellipse(bx + 8, by - 43, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
      });
    },

    clima(ctx, t) {
      // garúa fina: hilitos verticales muy tenues
      for (let i = 0; i < 34; i++) {
        const x = (i * 131 - t * 0.5) % 860 - 20;
        const y = (i * 97 + t * 2.6) % 400;
        ctx.fillStyle = "rgba(226,238,248,.35)";
        ctx.fillRect(x, y, 1, 9);
      }
    },
  },

  /* =========================================================
     MIRAFLORES — el malecón al atardecer: acantilado sobre el
     Pacífico, parapentes en el cielo y el sol metiéndose al mar
     ========================================================= */
  acantilado: {
    nombre: "Acantilado",
    cielo: [[0, "#1f3a6e"], [0.4, "#5a6fae"], [0.72, "#e8896b"], [1, "#ffd39b"]],
    suelo: { cara: "#9a7f5e", borde: "#7fae5c", tierra: "#6b563c", plataforma: "#2f7fc4", plataformaBorde: "#93cdf2" },
    acento: "#ff9f45",
    bichos: ["parapente", "tabla", "cangrejo"],
    nombresBichos: ["El Parapente sin Cerrar", "La Tabla Despegada", "El Cangrejo de las Marcas"],
    jefe: "gato",
    nombreJefe: "El Gato Superpuesto",

    fondo(ctx, cam, t) {
      // sol metiéndose al mar
      ctx.fillStyle = "rgba(255,214,140,.95)";
      ctx.beginPath(); ctx.arc(600, 240, 44, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,180,120,.20)";
      ctx.beginPath(); ctx.arc(600, 240, 74, 0, Math.PI * 2); ctx.fill();

      // el Pacífico, con el reflejo del sol
      ctx.fillStyle = "#274a80";
      ctx.fillRect(0, 258, CFG.ANCHO_VISTA, 76);
      for (let i = 0; i < 30; i++) {
        const x = (i * 61 - (cam * 0.08)) % 880 - 30;
        const y = 268 + ((i * 23) % 56);
        const cerca = Math.abs(x - 600) < 110;
        ctx.fillStyle = cerca ? "rgba(255,214,150,.45)" : "rgba(255,255,255,.16)";
        ctx.fillRect(x, y, 18, 2);
      }

      // parapentes cruzando el cielo
      repetir(ctx, cam, 300, 0.12, (x, i) => {
        const px = x + 90;
        const py = 80 + ((i * 47) % 70) + Math.sin(t / 50 + i) * 10;
        ctx.fillStyle = ["#e0562f", "#ffd166", "#4ade80"][i % 3];
        ctx.beginPath();
        ctx.moveTo(px - 22, py); ctx.quadraticCurveTo(px, py - 14, px + 22, py);
        ctx.quadraticCurveTo(px, py + 5, px - 22, py);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - 14, py + 2); ctx.lineTo(px, py + 18);
        ctx.moveTo(px + 14, py + 2); ctx.lineTo(px, py + 18); ctx.stroke();
        ctx.fillStyle = "#2f3a56";
        ctx.fillRect(px - 3, py + 18, 6, 8);
      });

      // edificios del malecón, en el borde del acantilado
      repetir(ctx, cam, 165, 0.42, (x, i) => {
        const alto = 96 + ((i * 43) % 54);
        ctx.fillStyle = ["#e6ddd0", "#d8cfc2", "#efe6da"][i % 3];
        ctx.fillRect(x + 18, 334 - alto, 74, alto);
        ctx.fillStyle = "rgba(90,110,140,.5)";
        for (let fy = 334 - alto + 10; fy < 328; fy += 15)
          for (let fx = x + 24; fx < x + 86; fx += 14) ctx.fillRect(fx, fy, 8, 9);
        ctx.fillStyle = "rgba(255,200,150,.5)";
        ctx.fillRect(x + 18, 334 - alto, 74, 4);
      });

      // la baranda del malecón y el pasto del borde
      repetir(ctx, cam, 64, 0.72, (x) => {
        ctx.fillStyle = "#5f7a4a";
        ctx.fillRect(x, 356, 64, 8);
        ctx.strokeStyle = "rgba(240,240,235,.55)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, 348); ctx.lineTo(x + 64, 348); ctx.stroke();
        ctx.fillStyle = "rgba(240,240,235,.55)";
        ctx.fillRect(x + 8, 348, 3, 10);
        ctx.fillRect(x + 44, 348, 3, 10);
      });
    },

    clima(ctx, t) {
      // brisa del mar: motitas claras cruzando en horizontal
      for (let i = 0; i < 22; i++) {
        const x = (i * 179 - t * 2.2) % 900 - 30;
        const y = 70 + ((i * 89) % 260) + Math.sin(t / 26 + i) * 6;
        ctx.fillStyle = "rgba(255,236,210,.4)";
        ctx.fillRect(x, y, 9, 1);
      }
    },
  },
  barranco: {
    nombre: "Barranco",
    cielo: [[0, "#160f33"], [0.4, "#33205c"], [0.75, "#7a3f76"], [1, "#c9705f"]],
    suelo: { cara: "#7b6b8f", borde: "#c9a4d6", tierra: "#3d3350", plataforma: "#e07a3f", plataformaBorde: "#ffbc82" },
    acento: "#ff8fab",
    bichos: ["guitarra", "aerosol", "cajon"],
    nombresBichos: ["La Guitarra de Chabuca", "El Aerosol de la Bajada", "El Cajón al Revés"],
    jefe: "bohemio",
    nombreJefe: "El Bohemio del Puente",

    fondo(ctx, cam, t) {
      // luna llena sobre el mar
      ctx.fillStyle = "rgba(255,246,222,.92)";
      ctx.beginPath(); ctx.arc(650, 84, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,230,190,.14)";
      ctx.beginPath(); ctx.arc(650, 84, 52, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 34; i++) {
        const x = (i * 173 - (cam * 0.04)) % 900 - 20;
        const y = 18 + ((i * 67) % 170);
        ctx.fillStyle = `rgba(255,255,255,${(0.3 + 0.4 * Math.abs(Math.sin(t / 34 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // el mar al fondo, con el reflejo de la luna
      ctx.fillStyle = "#1d2b52";
      ctx.fillRect(0, 250, CFG.ANCHO_VISTA, 52);
      for (let i = 0; i < 24; i++) {
        const x = (i * 71 - (cam * 0.07)) % 880 - 30;
        const y = 258 + ((i * 19) % 38);
        ctx.fillStyle = Math.abs(x - 650) < 90 ? "rgba(255,240,200,.4)" : "rgba(255,255,255,.12)";
        ctx.fillRect(x, y, 14, 2);
      }

      // el Puente de los Suspiros, en silueta
      repetir(ctx, cam, 430, 0.26, (x) => {
        const bx = x + 60, base = 302;
        ctx.fillStyle = "#2c2140";
        ctx.fillRect(bx, base - 8, 150, 10);
        // arco
        ctx.beginPath();
        ctx.moveTo(bx + 30, base + 2);
        ctx.quadraticCurveTo(bx + 75, base - 34, bx + 120, base + 2);
        ctx.lineTo(bx + 120, base + 26); ctx.lineTo(bx + 30, base + 26);
        ctx.closePath(); ctx.fill();
        // barandas
        ctx.fillStyle = "#3d2f56";
        for (let k = 0; k < 10; k++) ctx.fillRect(bx + 6 + k * 15, base - 22, 3, 14);
        ctx.fillRect(bx, base - 24, 150, 3);
        // farolitos
        ctx.fillStyle = "rgba(255,209,120,.9)";
        ctx.beginPath(); ctx.arc(bx + 8, base - 30, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx + 142, base - 30, 3.5, 0, Math.PI * 2); ctx.fill();
      });

      // casonas de colores con murales
      repetir(ctx, cam, 158, 0.48, (x, i) => {
        const alto = 104 + ((i * 47) % 44);
        const cuerpo = ["#e0568f", "#f0a03c", "#4fb0a8", "#8f6fd0"][i % 4];
        ctx.fillStyle = cuerpo;
        ctx.fillRect(x + 16, 334 - alto, 78, alto);
        // teja
        ctx.fillStyle = "#8f3b2c";
        ctx.fillRect(x + 10, 334 - alto - 9, 90, 9);
        // ventanas encendidas
        ctx.fillStyle = "rgba(255,220,150,.85)";
        for (let fy = 334 - alto + 16; fy < 322; fy += 22)
          for (let fx = x + 24; fx < x + 86; fx += 22) ctx.fillRect(fx, fy, 11, 13);
        // mural en la pared
        ctx.fillStyle = "rgba(255,255,255,.22)";
        ctx.beginPath(); ctx.arc(x + 55, 334 - 30, 13, 0, Math.PI * 2); ctx.fill();
      });

      // guirnaldas de foquitos sobre la bajada
      repetir(ctx, cam, 220, 0.72, (x) => {
        ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 190); ctx.quadraticCurveTo(x + 110, 228, x + 220, 190); ctx.stroke();
        for (let k = 1; k < 8; k++) {
          const p = k / 8;
          const fx = x + 220 * p, fy = 190 + Math.sin(p * Math.PI) * 36;
          ctx.fillStyle = ["#ffd166", "#ff8fab", "#8ef2c0", "#9fc4ff"][k % 4];
          ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // luciérnagas tibias flotando entre las casonas
      for (let i = 0; i < 20; i++) {
        const x = (i * 157 + Math.sin(t / 50 + i) * 30) % 880 - 20;
        const y = 120 + ((i * 83) % 230) + Math.cos(t / 38 + i) * 12;
        const brillo = 0.25 + 0.5 * Math.abs(Math.sin(t / 22 + i * 1.7));
        ctx.fillStyle = `rgba(255,214,140,${brillo.toFixed(2)})`;
        ctx.fillRect(x, y, 3, 3);
      }
    },
  },
  muelle: {
    nombre: "Chorrillos",
    cielo: [[0, "#1d3a5c"], [0.34, "#4a6c96"], [0.7, "#e8a06a"], [1, "#ffd9a0"]],
    suelo: { cara: "#8a6a48", borde: "#c49a68", tierra: "#4a3826", plataforma: "#5b4630", plataformaBorde: "#e0a03c" },
    acento: "#ffb04a",
    bichos: ["bote", "red", "pelicano"],
    nombresBichos: ["El Bote de la Herradura", "La Red de un Solo Eje", "El Pelícano de Villa"],
    jefe: "pescador",
    nombreJefe: "El Pescador sin Prioridad",

    fondo(ctx, cam, t) {
      // el sol saliendo, todavía bajo y anaranjado
      ctx.fillStyle = "rgba(255,214,140,.16)";
      ctx.beginPath(); ctx.arc(178, 206, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,196,110,.95)";
      ctx.beginPath(); ctx.arc(178, 206, 38, 0, Math.PI * 2); ctx.fill();

      // el Morro Solar en silueta, con la cruz en la cumbre
      repetir(ctx, cam, 620, 0.16, (x) => {
        const bx = x + 380;
        ctx.fillStyle = "#3b4d6b";
        ctx.beginPath();
        ctx.moveTo(bx - 160, 262);
        ctx.lineTo(bx - 44, 148);
        ctx.lineTo(bx + 12, 170);
        ctx.lineTo(bx + 126, 262);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#2c3a52";
        ctx.fillRect(bx - 46, 126, 5, 24);
        ctx.fillRect(bx - 54, 134, 21, 4);
      });

      // el mar, con el camino del sol encima
      ctx.fillStyle = "#2f5b78";
      ctx.fillRect(0, 258, CFG.ANCHO_VISTA, 48);
      for (let i = 0; i < 28; i++) {
        const x = (i * 63 - (cam * 0.08)) % 880 - 30;
        const y = 264 + ((i * 23) % 38);
        ctx.fillStyle = Math.abs(x - 178) < 100 ? "rgba(255,206,140,.5)" : "rgba(255,255,255,.13)";
        ctx.fillRect(x, y, 13, 2);
      }

      // botes amarrados, meciéndose con el oleaje
      repetir(ctx, cam, 196, 0.4, (x, i) => {
        const bx = x + 28, mece = Math.sin(t / 26 + i) * 2.5;
        ctx.fillStyle = "#5b4630";
        ctx.fillRect(bx + 20, 246 + mece, 3, 26);
        ctx.fillStyle = "rgba(255,250,240,.9)";
        ctx.beginPath();
        ctx.moveTo(bx + 23, 246 + mece);
        ctx.lineTo(bx + 44, 262 + mece);
        ctx.lineTo(bx + 23, 268 + mece);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = ["#c9553f", "#e0a03c", "#4f8fa8", "#d8d2c4"][i % 4];
        ctx.beginPath();
        ctx.moveTo(bx, 270 + mece);
        ctx.lineTo(bx + 54, 270 + mece);
        ctx.lineTo(bx + 44, 282 + mece);
        ctx.lineTo(bx + 10, 282 + mece);
        ctx.closePath(); ctx.fill();
      });

      // el muelle de madera, adelante, con las cajas de pescado apiladas encima
      repetir(ctx, cam, 132, 0.66, (x) => {
        ctx.fillStyle = "#6b5236";
        ctx.fillRect(x + 12, 336, 108, 7);
        ctx.fillStyle = "#5a4229";
        for (let k = 0; k < 4; k++) ctx.fillRect(x + 20 + k * 30, 343, 6, 41);
        ctx.fillStyle = "#a8b8c4"; ctx.fillRect(x + 70, 320, 24, 16);
        ctx.fillStyle = "#8a9aa8"; ctx.fillRect(x + 75, 306, 20, 14);
      });

      // pelícanos cruzando en fila, esperando su turno
      repetir(ctx, cam, 340, 0.9, (x, i) => {
        const y = 94 + ((i * 37) % 46) + Math.sin(t / 30 + i) * 5;
        ctx.strokeStyle = "rgba(40,52,70,.55)"; ctx.lineWidth = 2;
        for (let k = 0; k < 3; k++) {
          const px = x + k * 28, py = y + k * 9;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(px + 7, py - 6, px + 14, py);
          ctx.stroke();
        }
      });
    },

    clima(ctx, t) {
      // salpicadura salada: la reventazón levanta gotitas contra el muelle
      for (let i = 0; i < 22; i++) {
        const ciclo = (t / 2 + i * 17) % 120;
        const x = (i * 137) % 880 - 20;
        const y = 300 - ciclo * 0.9;
        const alfa = Math.max(0, 0.42 - ciclo / 290);
        ctx.fillStyle = `rgba(226,240,250,${alfa.toFixed(2)})`;
        ctx.fillRect(x, y, 2, 3);
      }
    },
  },

  /* =========================================================
     VILLA EL SALVADOR — mediodía en los arenales. El distrito se
     planificó desde el primer día en grupos residenciales: cada
     manzana de casitas rodea una plaza que queda justo AL CENTRO.
     Al fondo, las dunas del Lomo de Corvina, las torres de alta
     tensión y los talleres del parque industrial.
     ========================================================= */
  arenal: {
    nombre: "Villa El Salvador",
    cielo: [[0, "#4a8fc4"], [0.42, "#8fc0dd"], [0.78, "#e8d3a8"], [1, "#f0dcb4"]],
    suelo: { cara: "#c9a86a", borde: "#e8d09a", tierra: "#8a6f42", plataforma: "#5f5348", plataformaBorde: "#e8823c" },
    acento: "#e8823c",
    bichos: ["carretilla", "ladrillo", "casco"],
    nombresBichos: ["La Carretilla Desnivelada", "El Ladrillo sin Peso", "El Casco Desordenado"],
    jefe: "capataz",
    nombreJefe: "El Capataz del Grupo Residencial",

    fondo(ctx, cam, t) {
      // el sol del mediodía, blanco y sin piedad
      ctx.fillStyle = "rgba(255,250,225,.20)";
      ctx.beginPath(); ctx.arc(600, 66, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,252,238,.95)";
      ctx.beginPath(); ctx.arc(600, 66, 30, 0, Math.PI * 2); ctx.fill();

      // las dunas del Lomo de Corvina, una detrás de otra
      repetir(ctx, cam, 520, 0.14, (x) => {
        ctx.fillStyle = "#c2a173";
        ctx.beginPath();
        ctx.moveTo(x - 60, 300);
        ctx.quadraticCurveTo(x + 130, 176, x + 330, 300);
        ctx.closePath(); ctx.fill();
      });
      repetir(ctx, cam, 380, 0.24, (x) => {
        ctx.fillStyle = "#d4b585";
        ctx.beginPath();
        ctx.moveTo(x - 40, 308);
        ctx.quadraticCurveTo(x + 100, 216, x + 250, 308);
        ctx.closePath(); ctx.fill();
      });

      // torres de alta tensión cruzando el arenal
      repetir(ctx, cam, 300, 0.36, (x) => {
        const bx = x + 40, base = 306, alto = 118;
        ctx.strokeStyle = "#6b6357"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx - 14, base); ctx.lineTo(bx, base - alto);
        ctx.moveTo(bx + 14, base); ctx.lineTo(bx, base - alto);
        for (let k = 1; k <= 4; k++) {
          const y = base - (alto / 5) * k, w = 13 - k * 2.4;
          ctx.moveTo(bx - w, y); ctx.lineTo(bx + w, y);
        }
        ctx.moveTo(bx - 22, base - alto + 16); ctx.lineTo(bx + 22, base - alto + 16);
        ctx.stroke();
        // los cables colgando hacia la siguiente torre
        ctx.strokeStyle = "rgba(70,66,58,.55)";
        ctx.beginPath();
        ctx.moveTo(bx + 22, base - alto + 16);
        ctx.quadraticCurveTo(bx + 150, base - alto + 46, bx + 300 - 22, base - alto + 16);
        ctx.stroke();
      });

      // los grupos residenciales, lejos y lavados por el calor: dos manzanas
      // de casitas bajas y, entre ellas, la loza deportiva con su arquito, su
      // arbolito y el mástil. Ese centro es el que el nivel entero anda buscando.
      repetir(ctx, cam, 232, 0.42, (x, i) => {
        const bx = x + 8, base = 318;
        const tonos = ["#dcd2c0", "#d8c6ae", "#ccd2d4", "#e2d6c0"];
        const casita = (cx, alto, tono) => {
          ctx.fillStyle = tono;
          ctx.fillRect(cx, base - alto, 28, alto);
          ctx.fillStyle = "rgba(120,110,90,.28)";             // el techo plano
          ctx.fillRect(cx, base - alto, 28, 3);
          ctx.fillStyle = "rgba(110,135,150,.38)";            // ventanitas
          ctx.fillRect(cx + 5, base - alto + 9, 7, 8);
          ctx.fillRect(cx + 16, base - alto + 9, 7, 8);
          ctx.fillStyle = "rgba(120,100,70,.45)";             // puerta
          ctx.fillRect(cx + 11, base - 11, 7, 11);
        };
        casita(bx, 30 + ((i * 17) % 12), tonos[i % 4]);
        casita(bx + 30, 27 + ((i * 23) % 13), tonos[(i + 2) % 4]);

        // la loza deportiva: en Villa cada grupo tiene la suya, al centro
        ctx.fillStyle = "rgba(214,196,166,.85)";
        ctx.fillRect(bx + 66, base - 4, 88, 4);
        ctx.strokeStyle = "rgba(150,140,120,.7)"; ctx.lineWidth = 2;   // el arquito
        ctx.beginPath();
        ctx.moveTo(bx + 78, base - 4); ctx.lineTo(bx + 78, base - 20);
        ctx.lineTo(bx + 98, base - 20); ctx.lineTo(bx + 98, base - 4);
        ctx.stroke();
        ctx.fillStyle = "#7d6a48";                            // el tronco
        ctx.fillRect(bx + 118, base - 20, 3, 20);
        ctx.fillStyle = "#8aa063";                            // la copa del árbol
        ctx.beginPath(); ctx.arc(bx + 119, base - 26, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#9aa0a6";                            // el mástil
        ctx.fillRect(bx + 146, base - 42, 2, 42);
        ctx.fillStyle = "#e8823c";
        ctx.fillRect(bx + 148, base - 42, 12, 7);

        casita(bx + 160, 29 + ((i * 19) % 12), tonos[(i + 1) % 4]);
        casita(bx + 190, 32 + ((i * 13) % 11), tonos[(i + 3) % 4]);
      });

      // los talleres del parque industrial, espaciados, con techo de calamina
      repetir(ctx, cam, 262, 0.56, (x, i) => {
        const bx = x + 26, alto = 70 + ((i * 29) % 30), base = 338;
        ctx.fillStyle = ["#c9bda6", "#d4b88f", "#b9c2c2", "#dcc39c"][i % 4];
        ctx.fillRect(bx, base - alto, 108, alto);
        // techo de calamina en dientes de sierra
        ctx.fillStyle = "#7c838b";
        for (let k = 0; k < 6; k++) {
          ctx.beginPath();
          ctx.moveTo(bx + k * 18, base - alto);
          ctx.lineTo(bx + k * 18 + 9, base - alto - 12);
          ctx.lineTo(bx + k * 18 + 18, base - alto);
          ctx.closePath(); ctx.fill();
        }
        // el portón del taller, sus ventanitas y el letrero
        ctx.fillStyle = "#5e564a";
        ctx.fillRect(bx + 14, base - 34, 34, 34);
        ctx.fillStyle = "rgba(80,110,132,.6)";
        for (let fx = bx + 60; fx < bx + 100; fx += 18) ctx.fillRect(fx, base - alto + 26, 12, 14);
        ctx.fillStyle = "#e8823c";
        ctx.fillRect(bx + 60, base - 22, 40, 7);
      });
    },

    clima(ctx, t) {
      // la arena que levanta el viento, de costado
      for (let i = 0; i < 26; i++) {
        const x = (i * 149 - t * 3.1) % 880 - 20;
        const y = 150 + ((i * 61) % 200) + Math.sin(t / 18 + i) * 7;
        ctx.fillStyle = `rgba(232,214,168,${(0.16 + 0.2 * Math.abs(Math.sin(t / 26 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 9, 2);
      }
    },
  },

  /* =========================================================
     LA VICTORIA — Gamarra a media mañana. Mil galerías vendiendo
     el MISMO modelo: el emporio de la moda es, literalmente, el
     distrito de lo que más se repite. Las galerías apiladas, los
     toldos a rayas y las guirnaldas de ropa cruzando la calle.
     ========================================================= */
  emporio: {
    nombre: "La Victoria",
    cielo: [[0, "#8fa8c4"], [0.4, "#b8c8d4"], [0.75, "#dcd4c4"], [1, "#e8dcc0"]],
    suelo: { cara: "#8a8a90", borde: "#b8b8c0", tierra: "#4a4a52", plataforma: "#c04a5c", plataformaBorde: "#f0909c" },
    acento: "#e0562f",
    bichos: ["maniqui", "carrete", "tijera"],
    nombresBichos: ["El Maniquí Amodal", "El Carrete de Dos Colores", "La Tijera del Intervalo"],
    jefe: "jalador",
    nombreJefe: "El Jalador de la Galería",

    fondo(ctx, cam, t) {
      // el cielo cargado de Lima, sin sol definido
      ctx.fillStyle = "rgba(255,250,235,.14)";
      ctx.beginPath(); ctx.arc(560, 70, 70, 0, Math.PI * 2); ctx.fill();

      // las galerías del fondo, apiladas piso sobre piso
      repetir(ctx, cam, 240, 0.2, (x, i) => {
        const bx = x + 20, pisos = 5 + (i % 3), alto = pisos * 26;
        ctx.fillStyle = ["#c4b8a4", "#b0a894", "#ccc0ac"][i % 3];
        ctx.fillRect(bx, 300 - alto, 150, alto);
        // las ventanas de cada piso
        for (let p = 0; p < pisos; p++) {
          const py = 300 - alto + 8 + p * 26;
          ctx.fillStyle = "rgba(70,80,95,.5)";
          for (let fx = bx + 10; fx < bx + 138; fx += 24) ctx.fillRect(fx, py, 15, 14);
        }
        // el letrero de la galería en la azotea
        ctx.fillStyle = ["#e0562f", "#3f8fc4", "#e8c15a"][i % 3];
        ctx.fillRect(bx + 24, 300 - alto - 14, 102, 12);
      });

      // la fila de tiendas de la calle, con sus toldos
      repetir(ctx, cam, 130, 0.5, (x, i) => {
        const bx = x + 10, base = 336;
        ctx.fillStyle = ["#e8dcc4", "#dfe4e8", "#f0e0d0"][i % 3];
        ctx.fillRect(bx, base - 62, 108, 62);
        // el toldo a rayas
        for (let k = 0; k < 6; k++) {
          ctx.fillStyle = k % 2 ? "#e0562f" : "#f2f6ff";
          ctx.fillRect(bx - 4 + k * 19, base - 68, 19, 12);
        }
        // el escaparate iluminado
        ctx.fillStyle = "rgba(255,236,180,.75)";
        ctx.fillRect(bx + 12, base - 44, 82, 30);
        // dos maniquíes en la vitrina
        ctx.fillStyle = "#8a7a6a";
        ctx.fillRect(bx + 26, base - 40, 8, 24);
        ctx.fillRect(bx + 68, base - 40, 8, 24);
      });

      // las guirnaldas de ropa colgada cruzando la calle
      repetir(ctx, cam, 180, 0.74, (x) => {
        ctx.strokeStyle = "rgba(90,90,100,.4)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, 196); ctx.quadraticCurveTo(x + 90, 226, x + 180, 196); ctx.stroke();
        for (let k = 1; k < 7; k++) {
          const p = k / 7;
          const px = x + 180 * p, py = 196 + Math.sin(p * Math.PI) * 29;
          ctx.fillStyle = ["#e0562f", "#3f8fc4", "#e8c15a", "#4fb0a8", "#d0486a"][k % 5];
          ctx.fillRect(px - 5, py, 10, 14);
        }
      });
    },

    clima(ctx, t) {
      // el polvillo de tela que flota en el aire del emporio
      for (let i = 0; i < 24; i++) {
        const x = (i * 139 - t * 0.7) % 880 - 20;
        const y = 130 + ((i * 67) % 200) + Math.sin(t / 36 + i) * 9;
        ctx.fillStyle = `rgba(240,236,225,${(0.14 + 0.2 * Math.abs(Math.sin(t / 28 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 2, 2);
      }
    },
  },

  /* =========================================================
     SAN JUAN DE LURIGANCHO — media mañana bajo el viaducto de la
     Línea 1. El distrito más poblado del país, con los cerros
     cubiertos de casitas de colores y, cruzándolo todo, la vía
     elevada del tren: una fila ordenada de estaciones donde cada
     posición está numerada. Justo lo que hace falta para partir
     una distribución en pedazos.
     ========================================================= */
  linea: {
    nombre: "San Juan de Lurigancho",
    cielo: [[0, "#4fa0dc"], [0.45, "#8fc8e8"], [0.8, "#d6e6ea"], [1, "#e8dcc8"]],
    suelo: { cara: "#6b6b73", borde: "#9a9aa2", tierra: "#43434a", plataforma: "#b8323f", plataformaBorde: "#ffd166" },
    acento: "#3f8f55",

    bichos: ["boleto", "tarjeta", "tope"],
    nombresBichos: ["El Boleto sin Ordenar", "La Tarjeta del Porcentaje", "El Tope del Cien"],
    jefe: "tren",
    nombreJefe: "El Tren sin Interpolar",

    fondo(ctx, cam, t) {
      // el sol de media mañana, ya alto
      ctx.fillStyle = "rgba(255,246,214,.20)";
      ctx.beginPath(); ctx.arc(140, 74, 56, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,250,230,.92)";
      ctx.beginPath(); ctx.arc(140, 74, 26, 0, Math.PI * 2); ctx.fill();

      // los cerros de San Juan, cubiertos de casitas hasta arriba
      repetir(ctx, cam, 480, 0.13, (x, i) => {
        const bx = x + 200;
        ctx.fillStyle = "#a8977f";
        ctx.beginPath();
        ctx.moveTo(bx - 240, 300);
        ctx.quadraticCurveTo(bx - 20, 132, bx + 220, 300);
        ctx.closePath(); ctx.fill();
        // las casitas trepando la ladera: van pegadas a la curva del cerro,
        // calculando el punto de la misma Bézier con la que se dibujó
        const tonos = ["#e8d2b0", "#d9a95c", "#cfd6dc", "#e0562f", "#dcd6c8", "#4fb0a8"];
        const P0x = -240, P1x = -20, P2x = 220, P0y = 300, P1y = 132, P2y = 300;
        for (let k = 0; k < 26; k++) {
          const u = (k + 0.5) / 26, mu = 1 - u;
          const hx = bx + mu * mu * P0x + 2 * u * mu * P1x + u * u * P2x;
          const hy = mu * mu * P0y + 2 * u * mu * P1y + u * u * P2y + 3 + ((k * 13) % 9);
          ctx.fillStyle = tonos[(i + k) % 6];
          ctx.fillRect(hx - 7, hy - 11, 14, 11);
          ctx.fillStyle = "rgba(0,0,0,.16)";
          ctx.fillRect(hx - 7, hy - 3, 14, 3);
        }
      });

      // los edificios de la avenida, apretados
      repetir(ctx, cam, 176, 0.36, (x, i) => {
        const bx = x + 12, base = 318, alto = 66 + ((i * 31) % 38);
        ctx.fillStyle = ["#d6cdbc", "#c4c8cc", "#dcc9a8", "#cbd2cf"][i % 4];
        ctx.fillRect(bx, base - alto, 120, alto);
        ctx.fillStyle = "rgba(90,110,130,.45)";
        for (let fy = base - alto + 12; fy < base - 14; fy += 18)
          for (let fx = bx + 10; fx < bx + 110; fx += 20) ctx.fillRect(fx, fy, 11, 11);
        ctx.fillStyle = ["#e0562f", "#3f8f55", "#e8c15a"][i % 3];
        ctx.fillRect(bx + 10, base - 22, 60, 8);
      });

      // EL VIADUCTO DE LA LÍNEA 1: la viga elevada que cruza todo el nivel
      const yViga = 236;
      ctx.fillStyle = "#8f9298";
      ctx.fillRect(0, yViga, CFG.ANCHO_VISTA, 16);
      ctx.fillStyle = "#a9adb3";
      ctx.fillRect(0, yViga, CFG.ANCHO_VISTA, 4);
      ctx.fillStyle = "rgba(0,0,0,.20)";
      ctx.fillRect(0, yViga + 12, CFG.ANCHO_VISTA, 4);
      repetir(ctx, cam, 118, 0.46, (x, i) => {
        // los pilares en forma de Y que la sostienen
        ctx.fillStyle = "#7f8288";
        ctx.fillRect(x + 46, yViga + 16, 16, 96);
        ctx.beginPath();
        ctx.moveTo(x + 34, yViga + 16); ctx.lineTo(x + 74, yViga + 16);
        ctx.lineTo(x + 62, yViga + 34); ctx.lineTo(x + 46, yViga + 34);
        ctx.closePath(); ctx.fill();
        // la baranda de la vía, tramo por tramo
        ctx.fillStyle = "rgba(255,255,255,.35)";
        ctx.fillRect(x + 8, yViga - 9, 100, 3);
        for (let k = 0; k < 5; k++) ctx.fillRect(x + 8 + k * 24, yViga - 9, 3, 9);
        // cada cierto tramo, una estación con su techo curvo
        if (i % 3 === 1) {
          ctx.fillStyle = "#e8e2d2";
          ctx.fillRect(x + 4, yViga - 46, 112, 38);
          ctx.fillStyle = "#3f8f55";
          ctx.beginPath();
          ctx.moveTo(x - 2, yViga - 46);
          ctx.quadraticCurveTo(x + 60, yViga - 72, x + 122, yViga - 46);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgba(90,120,140,.45)";
          for (let fx = x + 14; fx < x + 108; fx += 22) ctx.fillRect(fx, yViga - 36, 14, 20);
        }
      });

      // los paraderos y los postes de la avenida, ya abajo
      repetir(ctx, cam, 142, 0.72, (x, i) => {
        const bx = x + 14, base = 350;
        if (i % 2 === 0) {
          ctx.fillStyle = "#5c5c66";                        // el paradero
          ctx.fillRect(bx, base - 30, 3, 30);
          ctx.fillRect(bx + 52, base - 30, 3, 30);
          ctx.fillStyle = "#e0562f";
          ctx.fillRect(bx - 4, base - 36, 63, 7);
          ctx.fillStyle = "rgba(255,255,255,.5)";
          ctx.fillRect(bx + 6, base - 24, 42, 16);
        } else {
          ctx.fillStyle = "#7f8288";                        // el poste con su letrero
          ctx.fillRect(bx + 70, base - 52, 3, 52);
          ctx.fillStyle = "#3f8f55";
          ctx.fillRect(bx + 64, base - 58, 18, 9);
        }
      });
    },

    clima(ctx, t) {
      // el polvo fino que levanta la avenida
      for (let i = 0; i < 20; i++) {
        const x = (i * 167 - t * 1.6) % 880 - 20;
        const y = 150 + ((i * 73) % 200) + Math.sin(t / 26 + i) * 9;
        ctx.fillStyle = `rgba(232,220,196,${(0.10 + 0.16 * Math.abs(Math.sin(t / 32 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 5, 2);
      }
    },
  },

  /* =========================================================
     CHACLACAYO — media mañana en el valle del Rímac, donde Lima
     por fin encuentra el sol. Los cerros secos a los dos lados,
     las quebradas por donde baja el huaico, el río abajo y las
     casas de campo desperdigadas entre huertos y palmeras: nada
     está a la misma distancia de nada. El valle de la dispersión.
     ========================================================= */
  valle: {
    nombre: "Chaclacayo",
    cielo: [[0, "#2f86d0"], [0.42, "#79bce4"], [0.78, "#d4e4d8"], [1, "#e8dcbc"]],
    suelo: { cara: "#b09a70", borde: "#d4c294", tierra: "#7a674a", plataforma: "#9c4230", plataformaBorde: "#ffd166" },
    acento: "#e8a83c",

    bichos: ["piedra", "termometro", "cinta"],
    nombresBichos: ["La Piedra del Huaico", "El Termómetro sin Comparar", "La Cinta al Cuadrado"],
    jefe: "chacarero",
    nombreJefe: "El Chacarero de la Constante",

    fondo(ctx, cam, t) {
      // el sol eterno de Chaclacayo, alto y sin una nube
      ctx.fillStyle = "rgba(255,246,204,.26)";
      ctx.beginPath(); ctx.arc(640, 66, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,252,224,.98)";
      ctx.beginPath(); ctx.arc(640, 66, 28, 0, Math.PI * 2); ctx.fill();

      // los cerros secos del fondo, con sus quebradas marcadas
      repetir(ctx, cam, 460, 0.14, (x, i) => {
        const bx = x + 40;
        ctx.fillStyle = i % 2 ? "#9d8a6c" : "#8e7c60";
        ctx.beginPath();
        ctx.moveTo(bx - 120, 300);
        ctx.lineTo(bx + 60, 132);
        ctx.lineTo(bx + 130, 168);
        ctx.lineTo(bx + 300, 300);
        ctx.closePath(); ctx.fill();
        // la quebrada por donde baja el huaico
        ctx.strokeStyle = "rgba(120,102,74,.75)"; ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(bx + 60, 140);
        ctx.quadraticCurveTo(bx + 24, 220, bx + 66, 300);
        ctx.stroke();
      });

      // los cerros de adelante, más claros por el sol
      repetir(ctx, cam, 320, 0.26, (x) => {
        ctx.fillStyle = "#b8a37e";
        ctx.beginPath();
        ctx.moveTo(x - 70, 312);
        ctx.quadraticCurveTo(x + 80, 208, x + 240, 312);
        ctx.closePath(); ctx.fill();
      });

      // el río Rímac, angosto y con las piedras del cauce
      ctx.fillStyle = "#4f8fae";
      ctx.fillRect(0, 306, CFG.ANCHO_VISTA, 18);
      for (let i = 0; i < 28; i++) {
        const x = (i * 61 - (cam * 0.2)) % 880 - 30;
        ctx.fillStyle = "rgba(255,255,255,.30)";
        ctx.fillRect(x, 310 + ((i * 13) % 10), 12, 2);
      }
      ctx.fillStyle = "#a8a098";
      for (let i = 0; i < 18; i++) {
        const x = (i * 97 - (cam * 0.2)) % 880 - 30;
        ctx.fillRect(x, 318 + ((i * 7) % 5), 9, 5);
      }

      // las casas de campo, desperdigadas: nunca a la misma distancia
      repetir(ctx, cam, 196, 0.5, (x, i) => {
        const bx = x + 14 + ((i * 53) % 46), base = 338;
        const alto = 42 + ((i * 31) % 20);
        ctx.fillStyle = ["#f0e4cc", "#e4d0b4", "#dce8dc", "#f0d8c0"][i % 4];
        ctx.fillRect(bx, base - alto, 84, alto);
        ctx.fillStyle = "#b5503a";                          // el techo de tejas
        ctx.beginPath();
        ctx.moveTo(bx - 8, base - alto);
        ctx.lineTo(bx + 42, base - alto - 20);
        ctx.lineTo(bx + 92, base - alto);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(90,120,140,.45)";             // ventanas
        ctx.fillRect(bx + 12, base - alto + 14, 18, 15);
        ctx.fillRect(bx + 54, base - alto + 14, 18, 15);
        ctx.fillStyle = "#7a5c3a";
        ctx.fillRect(bx + 34, base - 20, 16, 20);
        // la piscina o el huerto del costado, según toque
        if (i % 2) {
          ctx.fillStyle = "#5fb8d4";
          ctx.fillRect(bx + 94, base - 12, 34, 12);
        } else {
          ctx.fillStyle = "#4f8f3a";
          for (let k = 0; k < 3; k++) ctx.fillRect(bx + 96 + k * 12, base - 16, 8, 16);
        }
      });

      // las palmeras y los molles del valle, en primer plano
      repetir(ctx, cam, 128, 0.76, (x, i) => {
        const bx = x + 20, base = 356, alto = 54 + ((i * 37) % 26);
        ctx.fillStyle = "#7a5c3a";
        ctx.fillRect(bx, base - alto, 5, alto);
        ctx.fillStyle = i % 2 ? "#3f8f4a" : "#4f9d58";
        for (let k = 0; k < 5; k++) {
          const ang = -Math.PI / 2 + (k - 2) * 0.55;
          ctx.beginPath();
          ctx.moveTo(bx + 2, base - alto + 3);
          ctx.quadraticCurveTo(
            bx + 2 + Math.cos(ang) * 20, base - alto - 6 + Math.sin(ang) * 14,
            bx + 2 + Math.cos(ang) * 32, base - alto + 6 + Math.sin(ang) * 20);
          ctx.lineTo(bx + 2, base - alto + 7);
          ctx.closePath(); ctx.fill();
        }
      });
    },

    clima(ctx, t) {
      // el polvo seco del valle brillando a contraluz
      for (let i = 0; i < 22; i++) {
        const x = (i * 149 - t * 1.5) % 880 - 20;
        const y = 120 + ((i * 69) % 220) + Math.sin(t / 26 + i) * 11;
        ctx.fillStyle = `rgba(255,240,196,${(0.10 + 0.18 * Math.abs(Math.sin(t / 30 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 4, 3);
      }
    },
  },
  /* =========================================================
     PACHACÁMAC — las lomas de Lúcumo en pleno invierno. La
     camanchaca entra del mar y moja UNA sola ladera: ese lado
     amanece verde y el de atrás se queda pelado. Abajo, los
     campestres con sus ramadas, los corrales de caballo de paso
     y las chacras de lúcumo. Un cerro que no se parece de un
     lado al otro es justo lo que hay que medir hoy.
     ========================================================= */
  lomas: {
    nombre: "Pachacámac",
    cielo: [[0, "#8fb4c8"], [0.4, "#c2d2d8"], [0.76, "#dfe4dc"], [1, "#e8e8d8"]],
    suelo: { cara: "#8a9464", borde: "#b4c084", tierra: "#5e5a3c", plataforma: "#4a3324", plataformaBorde: "#ffd166" },
    acento: "#3f8f5a",

    bichos: ["neblina", "lucuma", "caballo"],
    nombresBichos: ["La Neblina de una Sola Ladera", "La Lúcuma sin Raíz", "El Caballo de los Dos Pasos"],
    jefe: "guia",
    nombreJefe: "El Guía de las Lomas",

    fondo(ctx, cam, t) {
      // el sol de invierno, apenas una mancha detrás de la camanchaca
      ctx.fillStyle = "rgba(250,248,230,.22)";
      ctx.beginPath(); ctx.arc(628, 82, 66, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(252,250,238,.55)";
      ctx.beginPath(); ctx.arc(628, 82, 30, 0, Math.PI * 2); ctx.fill();

      // LAS LOMAS: cada cerro verde por la ladera que le pega la neblina y pelado por la otra
      repetir(ctx, cam, 470, 0.15, (x, i) => {
        const bx = x + 60, base = 306, alto = 150 + ((i * 41) % 34), ancho = 210;
        ctx.fillStyle = "#8a7f68";                          // la ladera seca, la de atrás
        ctx.beginPath();
        ctx.moveTo(bx - ancho, base);
        ctx.lineTo(bx, base - alto);
        ctx.lineTo(bx + ancho, base);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#6f8a52";                          // la ladera que sí se moja
        ctx.beginPath();
        ctx.moveTo(bx - ancho, base);
        ctx.lineTo(bx, base - alto);
        ctx.lineTo(bx, base);
        ctx.closePath(); ctx.fill();
      });
      repetir(ctx, cam, 340, 0.26, (x, i) => {
        const bx = x + 40, base = 318, alto = 96 + ((i * 29) % 26), ancho = 150;
        ctx.fillStyle = "#9d9478";                          // la ladera seca
        ctx.beginPath();
        ctx.moveTo(bx - ancho, base);
        ctx.lineTo(bx, base - alto);
        ctx.lineTo(bx + ancho, base);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#86a05e";                          // la que amanece verde
        ctx.beginPath();
        ctx.moveTo(bx - ancho, base);
        ctx.lineTo(bx, base - alto);
        ctx.lineTo(bx, base);
        ctx.closePath(); ctx.fill();
        // el manchón de flor de amancaes en la parte verde
        ctx.fillStyle = "rgba(232,200,90,.55)";
        for (let k = 0; k < 7; k++) {
          const fx = bx - 20 - k * 16, fy = base - 26 - ((k * 23) % 40);
          ctx.fillRect(fx, fy, 5, 4);
        }
      });

      // la camanchaca metiéndose entre los cerros, en bandas lentas
      for (let k = 0; k < 4; k++) {
        const y = 226 + k * 22;
        const x = ((t / 3 + k * 140) % 1100) - 200;
        ctx.fillStyle = `rgba(232,238,238,${(0.30 - k * 0.05).toFixed(2)})`;
        ctx.fillRect(x, y, 380, 13);
        ctx.fillRect(x - 520, y, 300, 13);
      }

      // LOS CAMPESTRES: ramadas de estera, el horno de barro y las mesas largas
      repetir(ctx, cam, 214, 0.52, (x, i) => {
        const bx = x + 18, base = 352;
        ctx.fillStyle = "#d8c8a0";                          // la pared de adobe
        ctx.fillRect(bx, base - 46, 104, 46);
        ctx.fillStyle = "#c2b088";
        ctx.fillRect(bx, base - 46, 104, 5);
        ctx.fillStyle = "#a8763f";                          // el techo de estera a un agua
        ctx.beginPath();
        ctx.moveTo(bx - 8, base - 46);
        ctx.lineTo(bx + 112, base - 62);
        ctx.lineTo(bx + 112, base - 54);
        ctx.lineTo(bx - 8, base - 38);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#6b4a30";                          // los horcones
        ctx.fillRect(bx + 6, base - 44, 5, 44);
        ctx.fillRect(bx + 92, base - 56, 5, 56);
        ctx.fillStyle = "#3f5f7d";                          // la puerta
        ctx.fillRect(bx + 40, base - 26, 22, 26);
        ctx.fillStyle = "#8a5a3c";                          // el horno de barro con su boca
        ctx.beginPath();
        ctx.arc(bx + 128, base - 12, 16, Math.PI, 0); ctx.fill();
        ctx.fillRect(bx + 112, base - 12, 32, 12);
        ctx.fillStyle = "#2e2620";
        ctx.fillRect(bx + 122, base - 12, 12, 10);
        ctx.fillStyle = "#e8823c";                          // la candela
        ctx.fillRect(bx + 125, base - 8, 6, 6);
        // el humito del horno
        for (let k = 0; k < 2; k++) {
          const sube = ((t / 2.6 + k * 30 + i * 9) % 64);
          ctx.fillStyle = `rgba(222,222,214,${(0.30 - sube / 230).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(bx + 128 + Math.sin((sube + k * 20) / 14) * 7, base - 34 - sube, 5 + sube * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // la trocha de tierra por donde se llega a los campestres
      ctx.fillStyle = "#cdbf9c";
      ctx.fillRect(0, 356, CFG.ANCHO_VISTA, 30);
      ctx.fillStyle = "#bfae88";
      ctx.fillRect(0, 356, CFG.ANCHO_VISTA, 4);
      for (let i = 0; i < 26; i++) {                        // las piedritas y los matojos del borde
        const x = (i * 63 - (cam * 0.6)) % 900 - 40;
        ctx.fillStyle = i % 3 ? "rgba(150,140,110,.45)" : "rgba(110,140,80,.55)";
        ctx.fillRect(x, 366 + ((i * 11) % 12), i % 3 ? 7 : 5, 3);
      }

      // LA CHACRA DE LÚCUMO y el corral del caballo de paso
      repetir(ctx, cam, 186, 0.6, (x, i) => {
        const bx = x + 12, base = 358;
        // los lúcumos, en fila
        for (let k = 0; k < 3; k++) {
          const tx = bx + k * 28, alto = 24 + ((i + k) % 3) * 4;
          ctx.fillStyle = "#6b4a30";
          ctx.fillRect(tx + 7, base - alto, 5, alto);
          ctx.fillStyle = ["#3f7a4a", "#4a8a52", "#367044"][(i + k) % 3];
          ctx.beginPath();
          ctx.arc(tx + 9, base - alto - 4, 11, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(232,161,60,.75)";           // las lúcumas colgando
          ctx.fillRect(tx + 3, base - alto - 5, 3, 3);
          ctx.fillRect(tx + 13, base - alto - 1, 3, 3);
        }
        // el cerco del corral, de palos
        ctx.fillStyle = "#a8763f";
        ctx.fillRect(bx + 100, base - 18, 52, 3);
        ctx.fillRect(bx + 100, base - 10, 52, 3);
        for (let k = 0; k < 4; k++) ctx.fillRect(bx + 100 + k * 17, base - 21, 3, 21);
      });
    },

    clima(ctx, t) {
      // la garúa finita de las lomas, casi sin peso
      for (let i = 0; i < 30; i++) {
        const x = (i * 131 - t * 1.1) % 880 - 20;
        const y = (i * 53 + t * 1.7) % 400;
        ctx.fillStyle = `rgba(226,236,238,${(0.16 + 0.14 * Math.abs(Math.sin(t / 30 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 2, 7);
      }
    },
  },
  /* =========================================================
     ANCÓN — la bahía en pleno verano, a mediodía. El agua quieta
     en su herradura, los yates fondeados en el medio y unos pocos
     bien lejos, el muelle largo metiéndose al mar y, del otro lado
     de la bahía, las casonas de colores del malecón. Toda la data
     junta en el centro y los que se fueron lejos bien a la vista.
     ========================================================= */
  bahia: {
    nombre: "Ancón",
    cielo: [[0, "#2f86d0"], [0.4, "#79bce4"], [0.74, "#bcdcea"], [1, "#e4ecdc"]],
    suelo: { cara: "#e0cfa8", borde: "#f0e2c0", tierra: "#a89060", plataforma: "#6b4a30", plataformaBorde: "#ffd166" },
    acento: "#1f9ec4",

    bichos: ["sombrilla", "flotador", "yate"],
    nombresBichos: ["La Sombrilla del Medio", "El Flotador sin el 1,5", "El Yate Fondeado Lejos"],
    jefe: "salvavidas",
    nombreJefe: "El Salvavidas de la Bahía",

    fondo(ctx, cam, t) {
      // el sol de verano, blanco y alto
      ctx.fillStyle = "rgba(255,250,214,.28)";
      ctx.beginPath(); ctx.arc(170, 62, 64, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,253,232,.96)";
      ctx.beginPath(); ctx.arc(170, 62, 28, 0, Math.PI * 2); ctx.fill();

      // el brazo de cerro que cierra la herradura
      repetir(ctx, cam, 620, 0.1, (x) => {
        ctx.fillStyle = "#9d9478";                          // el cerro seco del brazo
        ctx.beginPath();
        ctx.moveTo(x - 90, 262);
        ctx.lineTo(x + 130, 176);
        ctx.lineTo(x + 340, 262);
        ctx.closePath(); ctx.fill();
      });

      // las casonas de colores del malecón, chiquitas al otro lado de la bahía
      repetir(ctx, cam, 62, 0.16, (x, i) => {
        const alto = 26 + ((i * 17) % 16), base = 264;
        ctx.fillStyle = ["#e8c15a", "#e8823c", "#7ec4d8", "#f2ead8", "#c2264a", "#8fb86a"][i % 6];
        ctx.fillRect(x + 6, base - alto, 42, alto);
        ctx.fillStyle = "rgba(255,255,255,.35)";            // el techito
        ctx.fillRect(x + 4, base - alto - 4, 46, 5);
        ctx.fillStyle = "rgba(60,70,80,.32)";               // las ventanitas del balcón
        for (let k = 0; k < 3; k++) ctx.fillRect(x + 11 + k * 12, base - alto + 8, 7, 9);
      });

      // EL MAR DE LA BAHÍA, quieto como piscina
      ctx.fillStyle = "#1f9ec4";
      ctx.fillRect(0, 264, CFG.ANCHO_VISTA, 92);
      ctx.fillStyle = "#3bb4d6";
      ctx.fillRect(0, 264, CFG.ANCHO_VISTA, 16);
      for (let i = 0; i < 34; i++) {                        // el brillo del sol sobre el agua
        const x = (i * 51 - (cam * 0.2)) % 900 - 40;
        const y = 282 + ((i * 29) % 62);
        ctx.fillStyle = "rgba(255,255,255,.30)";
        ctx.fillRect(x, y + Math.sin(t / 26 + i) * 2, 17, 2);
      }

      // los yates fondeados: casi todos juntitos y un par bien lejos
      repetir(ctx, cam, 178, 0.3, (x, i) => {
        const lejos = i % 4 === 3;                          // el atípico de la bahía
        const bx = x + (lejos ? 96 : 18), base = lejos ? 292 : 330, esc = lejos ? 0.62 : 1;
        ctx.fillStyle = "#5e5c58";                          // el palo
        ctx.fillRect(bx + 22 * esc, base - 34 * esc, 2, 34 * esc);
        ctx.fillStyle = "#f2ead8";                          // la vela
        ctx.beginPath();
        ctx.moveTo(bx + 24 * esc, base - 34 * esc);
        ctx.lineTo(bx + 40 * esc, base - 6 * esc);
        ctx.lineTo(bx + 24 * esc, base - 6 * esc);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#cfd6dc";                          // el casco
        ctx.fillRect(bx + 6 * esc, base - 8 * esc, 44 * esc, 7 * esc);
        ctx.fillStyle = "#3f6f9d";
        ctx.fillRect(bx + 6 * esc, base - 4 * esc, 44 * esc, 3 * esc);
        ctx.fillStyle = "rgba(255,255,255,.35)";            // el reflejo en el agua
        ctx.fillRect(bx + 8 * esc, base + 2 * esc, 40 * esc, 2);
      });

      // EL MUELLE DE ANCÓN, metiéndose derecho al mar sobre sus pilotes
      const yTab = 316;
      ctx.fillStyle = "#cfc4a8";                            // el tablero
      ctx.fillRect(0, yTab, CFG.ANCHO_VISTA, 18);
      ctx.fillStyle = "#e0d8bc";
      ctx.fillRect(0, yTab, CFG.ANCHO_VISTA, 4);
      repetir(ctx, cam, 58, 0.45, (x) => {
        ctx.fillStyle = "#8a7a60";                          // los pilotes clavados en el agua
        ctx.fillRect(x + 10, yTab + 18, 7, 22);
        ctx.fillStyle = "rgba(255,255,255,.22)";
        ctx.fillRect(x + 10, yTab + 37, 7, 3);
      });
      repetir(ctx, cam, 116, 0.45, (x) => {                 // la baranda
        ctx.fillStyle = "#b0a488";
        ctx.fillRect(x + 20, yTab - 14, 4, 14);
        ctx.fillRect(x + 78, yTab - 14, 4, 14);
        ctx.fillStyle = "#c2b89c";
        ctx.fillRect(x + 18, yTab - 16, 66, 3);
      });

      // LA ARENA con sus toldos y sombrillas, ya en la orilla
      ctx.fillStyle = "#e8d8b0";
      ctx.fillRect(0, 356, CFG.ANCHO_VISTA, 30);
      ctx.fillStyle = "rgba(255,255,255,.34)";              // la espuma de la orilla
      for (let i = 0; i < 28; i++) {
        const x = (i * 59 - (cam * 0.55)) % 900 - 40;
        ctx.fillRect(x, 356 + Math.abs(Math.sin(t / 30 + i)) * 3, 26, 3);
      }
      repetir(ctx, cam, 152, 0.7, (x, i) => {
        const bx = x + 14, base = 368;
        // el toldo de estera de siempre
        ctx.fillStyle = "#8a7a60";
        ctx.fillRect(bx + 2, base - 22, 3, 22);
        ctx.fillRect(bx + 54, base - 22, 3, 22);
        ctx.fillStyle = ["#e8823c", "#3bb4d6", "#e8c15a", "#c2264a"][i % 4];
        ctx.beginPath();
        ctx.moveTo(bx - 4, base - 26);
        ctx.lineTo(bx + 62, base - 26);
        ctx.lineTo(bx + 56, base - 18);
        ctx.lineTo(bx + 2, base - 18);
        ctx.closePath(); ctx.fill();
      });
    },

    clima(ctx, t) {
      // el resplandor del mediodía de verano, pura luz rebotando
      for (let i = 0; i < 18; i++) {
        const x = (i * 167 - t * 0.7) % 880 - 20;
        const y = 90 + ((i * 71) % 180);
        ctx.fillStyle = `rgba(255,252,226,${(0.06 + 0.07 * Math.abs(Math.sin(t / 34 + i))).toFixed(2)})`;
        ctx.fillRect(x, y, 26, 5);
      }
    },
  },
};

/** Pinta el cielo del tema (degradado vertical). */
export function pintarCielo(ctx, tema) {
  const g = ctx.createLinearGradient(0, 0, 0, CFG.ALTO_VISTA);
  (TEMAS[tema] || TEMAS.puerto).cielo.forEach(([p, c]) => g.addColorStop(p, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CFG.ANCHO_VISTA, CFG.ALTO_VISTA);
}

/** Dibuja un bloque de suelo o plataforma con los colores del tema. */
export function pintarTile(ctx, tema, tipo, px, py) {
  const p = (TEMAS[tema] || TEMAS.puerto).suelo;
  if (tipo === "suelo") {
    ctx.fillStyle = p.cara; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = p.borde; ctx.fillRect(px, py, T, 6);
    ctx.fillStyle = "rgba(0,0,0,.16)";
    ctx.fillRect(px + 4, py + 12, 8, 5); ctx.fillRect(px + 20, py + 21, 7, 5);
  } else if (tipo === "tierra") {
    ctx.fillStyle = p.tierra; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = "rgba(0,0,0,.14)";
    ctx.fillRect(px + 6, py + 7, 6, 5); ctx.fillRect(px + 19, py + 18, 6, 5);
  } else { // plataforma
    ctx.fillStyle = p.plataforma; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = p.plataformaBorde; ctx.fillRect(px, py, T, 5);
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(px, py + T - 4, T, 4);
  }
}
