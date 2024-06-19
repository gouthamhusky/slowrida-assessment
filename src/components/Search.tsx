import React, { useState, useEffect, useCallback } from "react";
import { Form, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import debounce from "lodash.debounce";
import { OpenLibraryResponse, Doc } from "../types/types";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortByYear, setSortByYear] = useState(false);

  const fetchBooks = async (query: string) => {
    if (query.trim() === "") {
      setBooks([]);
      return;
    }
    setLoading(true);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );
    const data: OpenLibraryResponse = await response.json();
    setBooks(data.docs);
    setLoading(false);
  };

  const debouncedFetchBooks = useCallback(debounce(fetchBooks, 2000), []);

  useEffect(() => {
    debouncedFetchBooks(query);
  }, [query]);

  const sortedBooks = sortByYear
    ? [...books].sort(
        (a, b) => (a.first_publish_year || 0) - (b.first_publish_year || 0)
      )
    : books;

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="8">
          <h1 className="text-center mb-4">OpenLibrary Search</h1>
          <Form>
            <Form.Group controlId="bookName">
              <Form.Control
                type="text"
                placeholder="Type to search for books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Form.Group controlId="sortToggle" className="mt-3 custom-toggle">
              <Form.Check
                type="switch"
                label="Sort by Year"
                checked={sortByYear}
                onChange={() => setSortByYear(!sortByYear)}
                className="mb-4"
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mt-4">
        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : (
          sortedBooks.map((book, index) => (
            <Col key={index} sm="6" md="4" lg="3" className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author_name?.join(", ")}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>First Published:</strong> {book.first_publish_year}
                  </Card.Text>
                  <Card.Text>
                    <strong>ISBN:</strong> {book.isbn ? book.isbn[0] : "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Number of Pages:</strong>{" "}
                    {book.number_of_pages_median || "N/A"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Search;
