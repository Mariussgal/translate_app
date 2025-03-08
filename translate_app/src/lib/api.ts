import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://translation-api-wq1v.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const translationApi = {
  translate: async (text: string, fromLang: string) => {
    try {
      const response = await apiClient.get(`/translate`, {
        params: { word: text.toLowerCase(), fromLang: fromLang.toLowerCase() }
      });
      return response.data;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },

  addModifyWord: async (word: string, translation: string, fromLang: string) => {
    try {
      const response = await apiClient.post('/word', {
        word: word.toLowerCase(),
        translation: translation.toLowerCase(),
        fromLang: fromLang.toLowerCase()
      });
      return response.data;
    } catch (error) {
      console.error('Add/modify error:', error);
      throw error;
    }
  },

  deleteWord: async (word: string, fromLang: string) => {
    try {
      const response = await apiClient.delete('/word', {
        params: { 
          word: word.toLowerCase(), 
          fromLang: fromLang.toLowerCase() 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
};

export default translationApi;