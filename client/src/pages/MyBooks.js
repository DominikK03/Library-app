import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const BookCard = styled(Link)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const BookTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const BookAuthor = styled.p`
  margin: 0 0 0.5rem 0;
  color: #7f8c8d;
`;

const BookStatus = styled.div`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  background-color: ${props => {
    switch (props.status) {
      case 'borrowed':
        return '#e74c3c';
      case 'reserved':
        return '#f1c40f';
      default:
        return '#95a5a6';
    }
  }};
  color: white;
`;

const DueDate = styled.p`
  margin: 0.5rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/my-books');
      setBorrowedBooks(response.data.borrowedBooks);
      setReservedBooks(response.data.reservedBooks);
    } catch (error) {
      setError('Nie udało się pobrać listy książek');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Title>Moje książki</Title>

      <Section>
        <SectionTitle>Wypożyczone książki</SectionTitle>
        <BookGrid>
          {borrowedBooks.map((book) => (
            <BookCard key={book._id} to={`/books/${book._id}`}>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>{book.author}</BookAuthor>
              <BookStatus status="borrowed">Wypożyczona</BookStatus>
              <DueDate>
                Data zwrotu: {new Date(book.dueDate).toLocaleDateString()}
              </DueDate>
            </BookCard>
          ))}
          {borrowedBooks.length === 0 && (
            <p>Nie masz obecnie wypożyczonych książek.</p>
          )}
        </BookGrid>
      </Section>

      <Section>
        <SectionTitle>Zarezerwowane książki</SectionTitle>
        <BookGrid>
          {reservedBooks.map((book) => (
            <BookCard key={book._id} to={`/books/${book._id}`}>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>{book.author}</BookAuthor>
              <BookStatus status="reserved">Zarezerwowana</BookStatus>
              <DueDate>
                Rezerwacja ważna do: {new Date(book.reservationExpires).toLocaleDateString()}
              </DueDate>
            </BookCard>
          ))}
          {reservedBooks.length === 0 && (
            <p>Nie masz obecnie zarezerwowanych książek.</p>
          )}
        </BookGrid>
      </Section>
    </Container>
  );
};

export default MyBooks; 