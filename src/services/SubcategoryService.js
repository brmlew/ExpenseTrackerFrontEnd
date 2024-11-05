import axios from "axios";

const SUBCATEGORIES_REST_API_URL = 'http://localhost:8080/api/subcategories';

class SubcategoryService {
    getSubcategories() {
        return axios.get(SUBCATEGORIES_REST_API_URL);
    }

    createSubcategory(categoryName, subcategoryName) {
        return axios.post(SUBCATEGORIES_REST_API_URL,
            {
                "categoryName": categoryName,
                "subcategoryName": subcategoryName
            }
        )
    }
}

export default new SubcategoryService();