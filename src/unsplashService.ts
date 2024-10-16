import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;


const BASE_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    thumb: string;
    small: string;
    full: string; // Thêm thuộc tính full
  };
  description?: string; // Mô tả chi tiết

  alt_description?: string; // Mô tả thay thế
  user: {
    name: string;
  };
}

export const fetchPhotos = async (page: number, perPage: number): Promise<UnsplashPhoto[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/photos`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 403) {
        // Nếu gặp lỗi 403, đánh dấu là đã lấy hết ảnh
        console.warn("Rate Limit Exceeded: Không còn ảnh để tải nữa.");
        throw new Error('No more photos available.');
      }
    }
    console.error('Error fetching photos:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to fetch photos.');
  }
};


// Thêm hàm để lấy chi tiết một bức ảnh
export const fetchPhotoById = async (id: string): Promise<UnsplashPhoto> => {
  try {
    const response = await axios.get(`${BASE_URL}/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching photo by ID:', error);
    throw new Error('Failed to fetch photo.');
  }
};
