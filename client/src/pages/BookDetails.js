import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Author = styled.h2`
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const InfoLabel = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const Description = styled.p`
  margin: 2rem 0;
  line-height: 1.6;
  color: #34495e;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 1rem;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Status = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 1rem;
  background-color: ${props => {
    switch (props.status) {
      case 'Available':
        return '#2ecc71';
      case 'Borrowed':
        return '#e74c3c';
      case 'Reserved':
        return '#f1c40f';
      default:
        return '#95a5a6';
    }
  }};
  color: white;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
`;

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      setError('Nie udało się pobrać informacji o książce');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    try {
      await axios.post(`http://localhost:5001/api/books/${id}/reserve`);
      setModalMessage('Książka została zarezerwowana! Masz 24 godziny na odbiór w bibliotece.');
      setShowModal(true);
      fetchBook();
    } catch (error) {
      setError('Nie udało się zarezerwować książki');
    }
  };

  const handleBorrow = async () => {
    try {
      await axios.post(`http://localhost:5001/api/books/${id}/borrow`);
      setModalMessage('Książka została wypożyczona!');
      setShowModal(true);
      fetchBook();
    } catch (error) {
      setError('Nie udało się wypożyczyć książki');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Available':
        return 'Dostępna';
      case 'Borrowed':
        return 'Wypożyczona';
      case 'Reserved':
        return 'Zarezerwowana';
      default:
        return status;
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Nie znaleziono książki</div>;

  return (
    <Container>
      <Title>{book.name}</Title>
      <Author>{book.author}</Author>
      <Status status={book.status}>
        {getStatusText(book.status)}
      </Status>
      <InfoLabel>
        <Label>Gatunek:</Label> {book.genre}
      </InfoLabel>
      <InfoLabel>
        <Label>Rok wydania:</Label> {book.productionYear}
      </InfoLabel>
      <Description>{book.description}</Description>
      
      {user && (
        <ButtonContainer>
          {book.status === 'Available' && (
            <>
              <Button onClick={handleBorrow}>Wypożycz</Button>
              <Button onClick={handleReserve}>Zarezerwuj</Button>
            </>
          )}
          {book.status === 'Reserved' && book.reservedBy === user._id && (
            <Button onClick={handleBorrow}>Wypożycz</Button>
          )}
        </ButtonContainer>
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent>
            <h2>{modalMessage}</h2>
            <Button onClick={() => setShowModal(false)}>OK</Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default BookDetails; 