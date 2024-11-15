// chatbot.tsx
import React from 'react';
import styled from 'styled-components';

// Estilos para el botón flotante de chat
const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25d366; /* Color verde típico de WhatsApp */
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

const Chatbot: React.FC = () => {
  
  const whatsappNumber = "56975131688"; 
  
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20interesa%20más%20información%20sobre%20la%20junta%20de%20vecinos.`;


  return (
    <>
      <ChatButton onClick={() => window.open(whatsappURL, "_blank")}>
        💬
      </ChatButton>
    </>
  );
};

export default Chatbot;
