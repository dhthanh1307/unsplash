import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPhotoById, UnsplashPhoto } from '../unsplashService';

const PhotoDetail: React.FC<{ photos: UnsplashPhoto[] }> = ({ photos }) => {
  const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPhoto = async () => {
      try {
        const fetchedPhoto = await fetchPhotoById(id!); // Lấy chi tiết ảnh
        setPhoto(fetchedPhoto);
      } catch (error) {
        setError('Không thể tải ảnh chi tiết');
      } finally {
        setLoading(false);
      }
    };

    getPhoto();
  }, [id]); // Chạy lại khi ID thay đổi

  if (loading) return <div>Đang tải ảnh chi tiết...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      {photo && (
        <div className='card text-left'>
          <img src={photo.urls.full} alt={photo.alt_description} className="img-fluid" style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
          <h1 className='fs-bold'>{photo.description || 'No title'}</h1>
          <h3> {photo.alt_description || 'No description'}</h3>
          <h3> {photo.user.name}</h3>
          <div className="d-flex justify-content-end mt-4">
            <Link to="/" className="col-4 btn btn-success">Return</Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default PhotoDetail;
