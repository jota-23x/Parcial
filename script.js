"use strict";

const PUBLIC_KEY = "sTVI767pv2D8Agvck";
const SERVICE_ID = "service_3fwkauq";
const TEMPLATE_ID = "template_47hsl0l";

const formulario = document.getElementById("formulario-correo");
const boton = document.getElementById("boton-enviar");
const textoBoton = document.getElementById("texto-boton");
const estado = document.getElementById("estado");

const configuracionLista = [
  PUBLIC_KEY,
  SERVICE_ID,
  TEMPLATE_ID
].every(valor => valor && !valor.startsWith("TU_"));

if (configuracionLista && window.emailjs) {
  emailjs.init({
    publicKey: PUBLIC_KEY
  });
}

function mostrarEstado(mensaje, tipo) {
  estado.textContent = mensaje;
  estado.className = `estado ${tipo}`;
  estado.hidden = false;
}

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const nombre = formulario.elements.user_name.value.trim();
  const correo = formulario.elements.user_email.value.trim();
  const destinatario = formulario.elements.to_email.value.trim();
  const asunto = formulario.elements.subject.value.trim();
  const mensaje = formulario.elements.message.value.trim();

  if (nombre.length < 2) {
    mostrarEstado(
      "Ingresa un nombre de al menos 2 caracteres.",
      "error"
    );
    return;
  }

  if (
    correo.length > 254 ||
    destinatario.length > 254
  ) {
    mostrarEstado(
      "Revisa las direcciones de correo ingresadas.",
      "error"
    );
    return;
  }

  if (asunto.length < 3 || mensaje.length < 5) {
    mostrarEstado(
      "El asunto debe tener al menos 3 caracteres y el mensaje 5.",
      "error"
    );
    return;
  }

  if (!configuracionLista || !window.emailjs) {
    mostrarEstado(
      "Falta configurar EmailJS. Revisa las claves en script.js.",
      "error"
    );
    return;
  }

  boton.disabled = true;
  textoBoton.textContent = "Enviando...";
  estado.hidden = true;

  try {
    await emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID,
      formulario
    );

    mostrarEstado(
      "¡Correo enviado correctamente! La solicitud fue aceptada por EmailJS.",
      "exito"
    );

    formulario.reset();

  } catch (error) {
  console.error("Error al enviar el correo:", error);

  const detalle =
    error?.text ||
    error?.message ||
    "Error desconocido. Revisa la consola.";

  mostrarEstado(
    `No se pudo enviar el correo: ${detalle}`,
    "error"
  );

  } finally {
    boton.disabled = false;
    textoBoton.textContent = "✉ Enviar correo";
  }
});
