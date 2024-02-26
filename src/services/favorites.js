import axios from "axios";

class FavoriteDataService {
    updateFavoritesList(data){
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites`,data);
    }

    getAll(userId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites/${userId}`);
    }

    getFavoriteMovies(userId){
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favoriteMovies/${userId}`);
    }
}

export default new FavoriteDataService();