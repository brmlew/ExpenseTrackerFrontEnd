import { useEffect, useState } from "react";

function expenseList() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/expenses')
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error fetching expenses:', error));
    }, []);

    return (
        <div>
          <h2>Expenses</h2>
          <ul>
            {expenses.map(expense => (
              <li key={expense.id}>{expense.name}</li>
            ))}
          </ul>
        </div>
      );
}

export default expenseList;