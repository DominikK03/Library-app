import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const BookCard = styled(Link)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
  }
`;

const BookTitle = styled.h2`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const BookAuthor = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
`;

const BookStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  background-color: ${props => props.status === 'Available' ? '#2ecc71' : '#e74c3c'};
  color: white;
`;

const NoResults = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/books');
        setBooks(response.data);
        setFilteredBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Nie udało się pobrać książek');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const results = books.filter(book =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  if (loading) return <Container>Ładowanie...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>Dostępne książki</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Szukaj książki lub autora..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      {filteredBooks.length > 0 ? (
        <BookGrid>
          {filteredBooks.map(book => (
            <BookCard key={book._id} to={`/books/${book._id}`}>
              <BookTitle>{book.name}</BookTitle>
              <BookAuthor>{book.author}</BookAuthor>
              <BookStatus status={book.status}>
                {book.status === 'Available' ? 'Dostępna' : 'Niedostępna'}
              </BookStatus>
            </BookCard>
          ))}
        </BookGrid>
      ) : (
        <NoResults>Nie znaleziono książek</NoResults>
      )}
    </Container>
  );
}

export default Home; 