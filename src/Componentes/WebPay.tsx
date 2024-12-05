import React from "react";
import "./Styles/WebPay.css"; // Archivo CSS externo para estilos

const WebPay = () => {
  return (
    <div className="webpay-container">
      <header className="webpay-header">
        <img
          src="./src/img/logo-webpay.png"
          alt="Logo Webpay"
          className="webpay-logo"
        />
      </header>
      <main className="webpay-content">
        <div className="webpay-info">
          <p>
            <strong>Estás pagando en:</strong> WEBPAY REST SIMULACIÓN
          </p>
          <p>
            <strong>Monto a pagar:</strong>{" "}
            <span className="webpay-amount">$999.492</span>
          </p>
        </div>
        <div className="webpay-alert">
          <p>
            <strong>¡Atención!</strong> Esta es una página de prueba. Contacte al
            comercio.
          </p>
        </div>
        <div className="webpay-options">
          <h3>Selecciona tu medio de pago:</h3>
          <div className="webpay-buttons">
            <button className="webpay-button">Débito</button>
            <button className="webpay-button">Crédito</button>
            <button className="webpay-button">Prepago</button>
          </div>
        </div>
        <div className="webpay-footer">
          <a href="/" className="webpay-link">
            Anular compra y volver al comercio
          </a>
          <p>
            Esta transacción se está realizando bajo un sistema seguro,{" "}
            <a href="/" className="webpay-policy">
              políticas de seguridad
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default WebPay;
