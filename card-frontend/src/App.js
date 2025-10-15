import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ErrorBoundary from './ErrorBoundary';

const API_URL = 'http://localhost:3000';
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'pass') {
      setError('');
      onLogin(true);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <div className="credentials">
        Usuario: user | Contraseña: pass
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <span className="error">{error}</span>}
        <button type="submit" className="login-btn">Iniciar Sesión</button>
      </form>
    </div>
  );
};

const CardForm = ({ onLogout }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cardName, setCardName] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [cards, setCards] = useState([]);
  const currentYear = new Date().getFullYear() % 100;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${API_URL}/cards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const formatCardNumber = (num) => {
    return num.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!cardNumber) newErrors.cardNumber = 'Requerido';
    else if (!/^\d+$/.test(cardNumber) || cardNumber.length !== 16) newErrors.cardNumber = 'Solo números, exactamente 16 caracteres';

    if (!expDate) newErrors.expDate = 'Requerido';
    else if (!/^\d{2}\/\d{2}$/.test(expDate)) newErrors.expDate = 'Formato MM/YY';
    else {
      const [month, year] = expDate.split('/').map(Number);
      if (month < 1 || month > 12 || year < 22 || year > currentYear + 5) {
        newErrors.expDate = `Mes 01-12, año 22-${currentYear + 5}`;
      }
    }

    if (!cardName) newErrors.cardName = 'Requerido';
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(cardName) || cardName.length > 20) newErrors.cardName = 'Solo letras (con tildes), máximo 20 caracteres';

    if (!cvv) newErrors.cvv = 'Requerido';
    else if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = '3 o 4 números';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (validateForm()) {
      const newCard = {
        number: cardNumber,
        exp: expDate,
        name: cardName,
      };
      try {
        const response = await axios.post(`${API_URL}/cards`, newCard);
        setCards([...cards, response.data]);
        clearForm();
      } catch (error) {
        console.error('Error adding card:', error);
      }
    }
  };

  const clearForm = () => {
    setCardNumber('');
    setExpDate('');
    setCardName('');
    setCvv('');
    setErrors({});
  };

  const maskedNumber = (num) => {
    if (num.length === 16) {
      return num.slice(0, 4) + '********' + num.slice(-4);
    }
    return num;
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="container">
      <div className="card-preview">
        <div className="card-header">
          <span className="bank-name">monobank | Universal Bank</span>
          <span className="wifi-icon">📡</span>
        </div>
        <div className="card-chip"></div>
        <div className="card-type">world</div>
        <div className="card-number">{formatCardNumber(cardNumber) || '#### #### #### ####'}</div>
        <div className="card-valid">VALID THRU</div>
        <div className="card-exp">{expDate || 'MM/YY'}</div>
        <div className="card-name">{cardName.toUpperCase() || 'NOMBRE TITULAR'}</div>
        <div className="card-logo">🟠🟠</div>
      </div>
      <form className="card-form">
        <div className="form-group">
          <label>Número de Tarjeta</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={16}
          />
          {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
        </div>
        <div className="form-group">
          <label>Fecha Vencimiento</label>
          <input
            type="text"
            value={expDate}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
              setExpDate(val.slice(0, 5));
            }}
            placeholder="MM/YY"
            maxLength={5}
          />
          {errors.expDate && <span className="error">{errors.expDate}</span>}
        </div>
        <div className="form-group full-width">
          <label>Nombre Titular</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            maxLength={20}
          />
          {errors.cardName && <span className="error">{errors.cardName}</span>}
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            maxLength={4}
          />
          {errors.cvv && <span className="error">{errors.cvv}</span>}
        </div>
        <div className="buttons">
          <button type="button" className="add-btn" onClick={handleAdd}>Agregar Tarjeta</button>
          <button type="button" className="cancel-btn" onClick={clearForm}>Cancelar</button>
        </div>
      </form>
      <div className="card-list">
        {cards.map((card, index) => (
          <div key={card.id} className="card-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <p>ID: {card.id}</p>
            <p>Tarjeta: {maskedNumber(card.number)}</p>
            <p>Nombre: {card.name}</p>
            <p>Vencimiento: {card.exp}</p>
          </div>
        ))}
      </div>
      <div className="logout-section">
        <button type="button" className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={setIsLoggedIn} />
      ) : (
        <ErrorBoundary>
          <CardForm onLogout={() => setIsLoggedIn(false)} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default App;
