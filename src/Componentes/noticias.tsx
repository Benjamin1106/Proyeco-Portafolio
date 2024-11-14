import { useEffect, useState } from 'react';
import axios from 'axios';
import './noticias.css'

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
        const response = await axios.get('https://magicloops.dev/api/loop/e63bc446-90ce-4940-a5c8-1ed2558a54c9/run'); // Reemplaza con la URL real de tu API
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
  );
};

export default NewsComponent;
