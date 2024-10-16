import { useState, useEffect } from 'react';
import './App.css';
import PhotoGallery from './component/PhotoGallery';
import PhotoDetail from './component/PhotoDetail';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { fetchPhotos, UnsplashPhoto } from './unsplashService';

function App() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const data = await fetchPhotos(1, 10); // Lấy dữ liệu ảnh
        setPhotos(data);
      } catch (error) {
        setError('Không thể tải ảnh');
      } finally {
        setLoading(false);
      }
    };

    getPhotos();
  }, []);

  if (loading) return <div>Đang tải ảnh...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Router>
      <Routes>
        <Route path="/photos/:id" element={<PhotoDetail photos={photos} />} />
        <Route path="/" element={<PhotoGallery photos={photos} setPhotos={setPhotos} />} />
      </Routes>
    </Router>
  );
}

export default App;
