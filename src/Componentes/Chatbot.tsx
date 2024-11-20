import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Estilos para el botón flotante
const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25d366;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

// Estilos para el modal de chat
const ChatModal = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: #fdf5e6; /* Fondo color crema */
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 350px;
  max-height: 450px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  font-family: Arial, sans-serif;
`;

// Contenedor de mensajes
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

// Input para mensajes
const MessageInput = styled.input`
  border: none;
  padding: 10px;
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

// Mensaje de WhatsApp
const WhatsAppMessage = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background: #eaf7ea;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;

  a {
    margin-left: 5px;
    color: #25d366;
    text-decoration: none;
    font-weight: bold;
  }

  img {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      const welcomeMessage =
        "¡Hola! Soy Laguito, tu asistente virtual de la Junta de Vecinos Villa Los Lagos. Estoy aquí para ayudarte. Pregúntame sobre actividades, horarios o cualquier información que necesites.";
      setMessages([`<div style="display: flex; align-items: center;"><img src="./public/favicon.ico" alt="favicon" style="width: 50px; height: 50px; margin-right: 5px;" /><strong>Laguito: </strong> ${welcomeMessage}</div>`]);
      
    }
  }, [isOpen]);

  // Respuestas predeterminadas
  const predefinedResponses: { [key: string]: string } = {
    ayuda: "<br/>¡Hola! ¿En qué puedo ayudarte?",
    horario: "Nuestros horarios de atención son de 9:00 a 18:00 de lunes a viernes.",
    actividades: "Las próximas actividades son una limpieza vecinal y un bingo comunitario para reconstruir el ano de Nelson Maury.",
    reunión: "La próxima reunión será el día sábado a las 16:00.",
    ofensivo: `Lamento no ser de tu ayuda, pero no me hables así por favor 😢.`,
    menu: `Para más información escoge una de las siguientes opciones:<br/><br/>
              1. Obtener Certificado de Residencia<br/>
              2. Participar en actividades<br/>
              3. Inscríbete en proyectos vecinales<br/>
              4. Solicitar cancha o plaza<br/>
              5. Ser contactado por la directiva<br/><br/>
              Escribe solo el número de la opción que necesitas.<br/>`,
    "1": `<br/>Para obtener tu certificado de residencia debes ingresar a nuestra página web <a href="/inicio">aquí</a>.
    <br/>Registrarte presionando el botón verde que dice 'Ingresa'.
    <br/>Una vez registrado, debes iniciar sesión y pinchar el botón de SOLICITUDES o seguir este enlace: <a href="/solicitudes">Solicitudes</a>
    <br/>Y seleccionar en el menú la opción de certificado de residencia.`,
    "2": `<br/>Para participar en actividades debes primeramente estar registrado o registrada en nuestra página web <a href="/inicio">en este enlace</a>.
    <br/>Luego de esto debes iniciar sesión y dirigirte a la opción PARTICIPA en el menú de navegación.
    <br/>Una vez dentro debes seleccionar la actividad para luego inscribirte.`,
    "3": `<br/>Para participar en proyectos vecinales debes primeramente estar registrado o registrada en nuestra página web <a href="/inicio">en este enlace</a>.
    <br/>Luego de esto debes iniciar sesión y dirigirte a la opción PARTICIPA en el menú de navegación.
    <br/>Una vez dentro debes seleccionar la opción del proyecto vecinal en el que deseas participar para luego inscribirte.`,
    "4": `<br/>Para solicitar uso de canchas o plazas debes ingresar a nuestra página web <a href="https://proyecto-de-titulo-e4070.web.app">aquí.</a>
    <br/>Registrarte presionando el botón verde que dice 'Conéctate'.
    <br/>Una vez registrado debes iniciar sesión y pinchar el botón de SOLICITUDES o seguir este enlace: <a href="/solicitudes">Solicitudes</a>
    <br/>Y seleccionar en el menú la opción de CANCHAS o PLAZAS, luego seleccionar la fecha y hora dentro del calendario de nuestra página.`,
    "5": `<br/>Para ser contactado por un miembro de nuestra directiva debes seguir los siguientes pasos:
    <br/>Ingresar a nuestra página web de contacto: <a href="/contacto">Contacto</a>
    <br/>Llenar el formulario de contacto con tus datos
    <br/>Luego de llenarlo, te llegará un correo de confirmación del contacto y serás contactado a la brevedad por un miembro de la directiva.`,
};

  const keywords = [
    "residencia",
    "papel",
    "certificado",
    "proyecto",
    "descargar",
    "hablar",
    "hola",
    "sacar",
    "inscribir",
    "participar",
    "contacto",
    "cancha",
    "plaza",
    "registro",
  ];

  const offensiveWords = [
    "ql",
    "puto",
    "puta",
    "marica",
    "maricon",
    "weko",
    "qla",
    "culo",
    "weon",
    "aweonao",
    "conchetumare",
    "conche",
    "chuche",
    "tumare",
  ];

  const handleMessageSend = () => {
    if (userMessage.trim() === "") return;

    const lowerCaseMessage = userMessage.toLowerCase();
    const containsOffensive = offensiveWords.some((word) => lowerCaseMessage.includes(word));
    let response = "";

    if (containsOffensive) {
      response = predefinedResponses["ofensivo"];
    } else {
      const containsKeyword = keywords.some((keyword) => lowerCaseMessage.includes(keyword));
      if (containsKeyword) {
        response = predefinedResponses["menu"];
      } else {
        const responseKey = Object.keys(predefinedResponses).find((key) => lowerCaseMessage.includes(key));
        response = responseKey && predefinedResponses[responseKey] ? predefinedResponses[responseKey] : "Lo siento, no entiendo tu consulta. Por favor, intenta ser más claro.";
      }
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      `Tú: ${userMessage}`,
      `<strong>Laguito:</strong> ${response}`,
    ]);
    setUserMessage("");
  };

  const whatsappNumber = "56975131688";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20interesa%20obtener%20más%20información%20sobre%20la%20junta%20de%20vecinos%20Villa%20Los%20Lagos%20por%20favor.`;

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>💬</ChatButton>
      {isOpen && (
        <ChatModal>
          <MessagesContainer>
            <WhatsAppMessage>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
              Si prefieres,{" "}
              <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
                chatea en WhatsApp
              </a>.
            </WhatsAppMessage>

            {messages.map((message, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: message }}></div>
            ))}
          </MessagesContainer>
          <MessageInput
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            onKeyPress={(e) => e.key === "Enter" && handleMessageSend()}
          />
        </ChatModal>
      )}
    </>
  );
};

export default Chatbot;
