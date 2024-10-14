import axios from "axios";

const EXPENSES_REST_API_URL = 'http://localhost:8080/api/expenses';

class ExpenseService {
    getExpenses() {
        return axios.get(EXPENSES_REST_API_URL);
    }

    addExpense(date, amount, note, category, subcategory) {
        return axios.post(EXPENSES_REST_API_URL, 
            {
                "type": "add",
                "date": date,
                "amount": amount,
                "note": note,
                "category": category,
                "subcategory": subcategory
            }
        );
    }

    deleteExpense(date, amount, note, category, subcategory) {
        return axios.post(EXPENSES_REST_API_URL, 
            {
                "type": "delete",
                "date": date,
                "amount": amount,
                "note": note,
                "category": category,
                "subcategory": subcategory
            }
        );
    }

    updateExpense(date, amount, note, category, subcategory, newDate, newAmount, newNote, newCategory, newSubcategory) {
        return axios.post(EXPENSES_REST_API_URL, 
            {
                "type": "update",
                "date": date,
                "amount": amount,
                "note": note,
                "category": category,
                "subcategory": subcategory,
                "newDate": newDate,
                "newAmount": newAmount,
                "newNote": newNote,
                "newCategory": newCategory,
                "newSubcategory": newSubcategory
            }
        );
    }
}

export default new ExpenseService();