import { useEffect, useState } from 'react';
import axios from 'axios';
import './noticias.css';

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Aquí debes usar la URL real de tu API
        const response = await axios.get('https://apimocha.com/news-maipu-api/post');
        
        // Asegúrate de acceder a response.data.articles
        setArticles(response.data.articles); 
      } catch (err) {
        setError('No se pudo cargar la información de noticias.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1>Noticias</h1> {/* Título fuera del contenedor */}
      <div className="news-container">
        {articles.map((article, index) => (
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
    </>
  );
};

export default NewsComponent;
