import React from 'react';
import ExpenseService from '../services/ExpenseService';
import { useNavigate } from 'react-router-dom';

class ExpenseComponent extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            expenses:[],
            categories:[],
            subcategories:[],
            searchTerm: "",
            beforeDate: "",
            afterDate: "",
            total: 0,
        }
    }

    formatJsDateToNormalDate(date)  {
        if(date !== null) {
              let realMonth = date.getMonth() + 1;
              let month = (realMonth < 10) ? '0' + realMonth : String(realMonth);
              let day = (date.getDate() < 10) ? '0' + date.getDate() : String(date.getDate());
              
              return [date.getFullYear(), month, day].join('-');
        } else {
          return null;
        }
    }

    componentDidMount(){
        ExpenseService.getExpenses().then((expenseResponse) => {
            this.setState({expenses: expenseResponse.data})
        });

        let today = new Date();
        this.setState({beforeDate: this.formatJsDateToNormalDate(today)});

        let after = new Date();
        after.setDate(today.getDate() - 30);
        this.setState({afterDate: this.formatJsDateToNormalDate(after)});
    }

    search = (event) => {
        this.setState({searchTerm: event.target.value});
    }

    changeAfterDate = (event) => {
        this.setState({afterDate: event.target.value});
    }

    changeBeforeDate = (event) => {
        this.setState({beforeDate: event.target.value});
    }

    getFilteredExpenses = () => {
        const { expenses, searchTerm, afterDate, beforeDate } = this.state;

        return expenses.filter(expense => {
            const search = expense.note.toLowerCase().includes(searchTerm.toLowerCase())

            const expenseDate = new Date(expense.date);
            const inDateRange =(!afterDate || new Date(afterDate) <= expenseDate) && (!beforeDate || new Date(beforeDate) >= expenseDate);

            return search && inDateRange;
        } );
    }

    getTotal = (filteredExpenses) => {
        let sum = 0;

        for (let i = 0; i < filteredExpenses.length; i++) {
            sum += filteredExpenses[i].amount;
        }

        return sum;
    }

    addExpense () {
        const navigate = useNavigate();
        navigate('/add');
    }
    
    render () {
        const filteredExpenses = this.getFilteredExpenses();
        const total = this.getTotal(filteredExpenses);
        
        return (
            <div>
                <nav className="navigation-bar navbar-light">
                    <form className="form-inline searchBar">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.searchTerm} onChange={this.search} />
                    </form>
                    <label>Between</label>
                    <input type="date" className="datepicker" value={this.state.afterDate} onChange={this.changeAfterDate}/>
                    <label>And</label>
                    <input type="date" className="datepicker" value={this.state.beforeDate} onChange={this.changeBeforeDate}/>
                </nav>
                
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Amount</td>
                            <td>Note</td>
                            <td>Category</td>
                            <td>Subcategory</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredExpenses.map(expense => 
                                <tr key = {expense.id.timestamp}>
                                    <td>{(new Date(expense.date)).getFullYear()}-{(new Date(expense.date)).getMonth() + 1}-{(new Date(expense.date)).getDate() + 1}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.note}</td>
                                    <td>{expense.category.categoryName}</td>
                                    <td>{expense.subcategory.subcategoryName}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div>Total: {total}</div>
            </div>
        )
    }
}

export default ExpenseComponent