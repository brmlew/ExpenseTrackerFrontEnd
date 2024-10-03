import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from "./App";
import ExpensesList from "./expenses"
import ExpensesPage from "./pages/ExpensesPage";

function Root() {
    return (
        <Router>
            <Route exact path="/" component={App} />
            <Route path="/expenses" component={ExpensesList} />
            <Route path="/addExpense" component={AddExpense} />
        </Router>
    );
}

export default Root;