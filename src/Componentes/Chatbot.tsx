import React, { useState } from 'react';
import './Chatbot.css'; // Si tienes un archivo CSS para los estilos flotantes
import axios from 'axios'; // Importamos Axios

const Chatbot: React.FC = () => {
  const [showChat, setShowChat] = useState(false); // Mostrar/ocultar el chat
  const [message, setMessage] = useState(''); // Estado para el mensaje que escribe el usuario
  const [messages, setMessages] = useState<string[]>([]); // Estado para almacenar los mensajes del chat
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga mientras esperamos la respuesta del bot

  // Maneja el cambio de texto en el input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // Maneja el envío del mensaje
  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      // Agregar el mensaje del usuario a la lista de mensajes
      setMessages([...messages, `Tú: ${message}`]);
      setMessage(''); // Limpiar el input de mensaje
      setLoading(true); // Activar el estado de carga

      try {
        // Llamada a la API de OpenAI
        const response = await axios.post(
          'https://api.openai.com/v1/completions', // URL de la API de OpenAI
          {
            model: 'gpt-3.5-turbo', // Usar el modelo GPT-3.5
            messages: [
              {
                role: 'system',
                content: 'Eres un asistente útil que responde preguntas relacionadas con la junta de vecinos, la página web y temas comunitarios.',
              },
              ...messages.map((msg) => ({
                role: msg.startsWith('Tú') ? 'user' : 'assistant',
                content: msg.replace(/^Tú: /, ''),
              })),
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 150,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Reemplaza con tu clave API de OpenAI
            },
          }
        );

        // Obtener la respuesta y agregarla a los mensajes
        const botMessage = response.data.choices[0].message.content;
        setMessages((prevMessages) => [
          ...prevMessages,
          `Bot: ${botMessage}`,
        ]);
      } catch (error) {
        console.error('Error al comunicarse con OpenAI:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          'Bot: Lo siento, hubo un error al procesar tu mensaje.',
        ]);
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    }
  };

  // Alternar la visibilidad del chat
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChat}>🗨️</button>
      {showChat && (
        <div className="chatbot">
          <div className="chatbot-messages">
            {/* Mostrar los mensajes del chat */}
            {messages.map((msg, index) => (
              <div key={index} className="chatbot-message">
                {msg}
              </div>
            ))}
            {loading && <div>Bot está escribiendo...</div>}
          </div>
          <input 
            type="text" 
            value={message} 
            onChange={handleInputChange} 
            placeholder="Escribe tu mensaje..." 
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
