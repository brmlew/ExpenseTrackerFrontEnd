import axios from "axios";

const EXPENSES_REST_API_URL = 'http://localhost:8080/api/expenses';

class ExpenseService {
    getExpenses() {
        return axios.get(EXPENSES_REST_API_URL);
    }

    addExpense(date, amount, note, category, subcategory) {
        return axios.post(EXPENSES_REST_API_URL, 
            {"date": date,
                "amount": amount,
                "note": note,
                "category": category,
                "subcategory": subcategory
            }
        );
    }
}

export default new ExpenseService();