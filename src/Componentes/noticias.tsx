import { useEffect, useState } from 'react';
import axios from 'axios';
import './Styles/noticias.css';

interface Article {
  title: string;
  description: string;
  imageUrl: string;
  articleUrl: string;
}

const NewsComponent: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 8; // Número de artículos por página

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://apimocha.com/news-maipu-api/post');
        setArticles(response.data.articles);
      } catch (err) {
        setError('No se pudo cargar la información de noticias.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1>Noticias</h1>
      <div className="news-container">
        {currentArticles.map((article, index) => (
          <div key={index} className="news-card">
            <img src={article.imageUrl} alt={article.title} className="news-image" />
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.articleUrl} target="_blank" rel="noopener noreferrer">
              Leer más
            </a>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </>
  );
};

export default NewsComponent;
