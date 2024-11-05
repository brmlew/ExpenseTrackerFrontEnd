import axios from "axios";

const CATEGORIES_REST_API_URL = 'http://localhost:8080/api/categories';

class CategoryService {
    getCategories() {
        return axios.get(CATEGORIES_REST_API_URL);
    }

    createCategory(name) {
        return axios.post(CATEGORIES_REST_API_URL,
            {
                "categoryName": name
            }
        )
    }
}

export default new CategoryService();