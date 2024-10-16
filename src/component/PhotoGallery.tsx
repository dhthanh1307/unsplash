import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPhotos, UnsplashPhoto } from '../unsplashService';

interface PhotoGalleryProps {
  photos: UnsplashPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<UnsplashPhoto[]>>; 
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [allPhotos, setAllPhotos] = useState<UnsplashPhoto[]>([]); 
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [noMorePhotos, setNoMorePhotos] = useState<boolean>(false); // Thêm state này

  const perPage = 30; 
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadPhotos = async () => {
    if (!hasMore || loadingMore) return; // Nếu không còn ảnh hay đang tải thì không làm gì cả
    setLoadingMore(true); 
    await delay(200);

    try {
      const newPhotos = await fetchPhotos(page, perPage);
      console.log("New photos loaded:", newPhotos.length);
      
      setAllPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]); 
      
      if (newPhotos.length < perPage) {
        setHasMore(false);
        setNoMorePhotos(true); // Đánh dấu không còn ảnh
      } else {
        setNoMorePhotos(false);
      }
    } catch (error) {
      console.error("Error loading photos:", error);
      if (error instanceof Error) {
        if (error.message === 'No more photos available.') {
          setHasMore(false); // Đánh dấu không còn ảnh để tải
          setNoMorePhotos(true); // Cập nhật trạng thái không còn ảnh
        } else {
          setError(error.message); // Hiển thị thông báo lỗi
        }
      } else {
        setError('Không thể tải ảnh'); // Đối phó với lỗi không xác định
      }
    } finally {
      setLoadingMore(false); 
    }
  };

  useEffect(() => {
    const fetchInitialPhotos = async () => {
      try {
        const initialPhotos = await fetchPhotos(1, perPage);
        setAllPhotos(initialPhotos);
      } catch (error) {
        console.error('Error loading initial photos:', error);
        if (error instanceof Error) {
          setError(error.message); // Lấy thông báo lỗi nếu là Error
        } else {
          setError('Không thể tải ảnh'); // Đối phó với lỗi không xác định
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchInitialPhotos();
  }, []); 

  useEffect(() => {
    if (page > 1) {
      console.log("Loading more photos for page:", page);
      loadPhotos(); 
    }
  }, [page]); 

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1 && // Đảm bảo người dùng cuộn gần cuối
        hasMore && !loadingMore // Nếu còn ảnh và không đang tải
      ) {
        setPage((prevPage) => prevPage + 1); 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); 
  }, [loadingMore, hasMore]); 

  if (loading && page === 1) return <div>Đang tải...</div>; 
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row ">
        {allPhotos.map((photo) => (
          <div key={photo.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <Link to={`/photos/${photo.id}`}>
              <div className="card" style={{ height:'32rem' }}>
                <img
                  src={photo.urls.thumb}
                  alt={`Ảnh của ${photo.user.name}`}
                  className="card-img-top"
                  style={{width:'100%', height: '70%', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                />
                <div className="card-body">
                  <p className="text-left ">Tác giả:</p>
                  <h4 className="text-left ">{photo.user.name}</h4>

                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {loadingMore && (
        <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span role="status">Loading...</span>
        </button>
      )}
      {noMorePhotos && ( // Hiển thị thông báo không còn ảnh
        <div className="text-center text-danger mt-3">
          ĐÃ HẾT LƯỢT CALL API!
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
