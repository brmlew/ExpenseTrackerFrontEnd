import React from 'react';
import ExpenseService from '../services/ExpenseService';
import { Select, MenuItem, ListItemText, ListItemIcon, Checkbox } from '@mui/material';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';
import withRouter from '../withRouter';

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
            filteredCategories: [],
            sort: "date",
            sortDirection: 1,
            deletedExpense: ""
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

        CategoryService.getCategories().then((categoryResponse) => {
            this.setState({categories: categoryResponse.data})
            this.setState({filteredCategories: categoryResponse.data})
        })

        SubcategoryService.getSubcategories().then((subcategoryResponse) => {
            this.setState({subcategories: subcategoryResponse.data})
        })

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
        const { expenses, searchTerm, afterDate, beforeDate, filteredCategories, sort, sortDirection } = this.state;

        let filtered = expenses.filter(expense => {
            const search = expense.note.toLowerCase().includes(searchTerm.toLowerCase())

            const expenseDate = new Date(expense.date);
            const before = new Date(beforeDate);
            before.setDate(before.getDate() + 1);

            const inDateRange =(!afterDate || new Date(afterDate) <= expenseDate) && (!beforeDate || before >= expenseDate);

            let category = false;
            for (let i = 0; i < filteredCategories.length; i++) {
                if (filteredCategories[i].categoryName == expense.category.categoryName) {
                    category = true;
                }
            }

            return search && inDateRange && category;
        } );
        switch (sort) {
            case ("date"):
                return filtered.sort(function(a,b) {
                    return (new Date(b.date) - new Date(a.date)) * sortDirection;
                })
            case ("amount"):
                return filtered.sort(function(a,b) {
                    return (b.amount - a.amount) * sortDirection;
                })
            case ("category"):
                return filtered.sort(function(a,b) {
                    return (b.category.categoryName < a.category.categoryName) * sortDirection;
                })
            case ("subcategory"):
                return filtered.sort(function(a,b) {
                    return (b.subcategory.subcategoryName < a.subcategory.subcategoryName) * sortDirection;
                })
        }
        
    }

    getTotal = (filteredExpenses) => {
        let sum = 0;

        for (let i = 0; i < filteredExpenses.length; i++) {
            sum += filteredExpenses[i].amount * 100;
        }

        return sum / 100;
    }

    filterSubcategory = () => {
        const { filteredCategories, subcategories } = this.state;
        if (!filteredCategories) return [];

        return subcategories.filter(subcategory => {
            for (let i = 0; i < filteredCategories.length; i++) {
                if (filteredCategories[i].id == subcategory.category)
                    return true;
            }
            return false;
        });
    }

    sortDate = () => {
        if (this.state.sort == "date") {
            this.setState({sortDirection: this.state.sortDirection * -1})
        } else {
            this.setState({sortDirection: 1});
            this.setState({sort: "date"});
        }
        
    }

    sortCategory = () => {
        if (this.state.sort == "category") {
            this.setState({sortDirection: this.state.sortDirection * -1})
        } else {
            this.setState({sortDirection: 1});
            this.setState({sort: "category"});
        }
    }

    sortSubcategory = () => {
        if (this.state.sort == "subcategory") {
            this.setState({sortDirection: this.state.sortDirection * -1})
        } else {
            this.setState({sortDirection: 1});
            this.setState({sort: "subcategory"});
        }
    }

    sortNote = () => {
        if (this.state.sort == "note") {
            this.setState({sortDirection: this.state.sortDirection * -1})
        } else {
            this.setState({sortDirection: 1});
            this.setState({sort: "note"});
        }
    }

    sortAmount = () => {
        if (this.state.sort == "amount") {
            this.setState({sortDirection: this.state.sortDirection * -1})
        } else {
            this.setState({sortDirection: 1});
            this.setState({sort: "amount"});
        }
    }

    changeCategory = (event) => {
        this.setState({filteredCategories: event.target.value})
    }

    deleteExpense = (event) => {
        ExpenseService.deleteExpense(this.state.deletedExpense);
        window.location.reload(false);
    }

    deletePopup = (event, expense) => {
        let myEl = document.getElementById("hideScreen");
        myEl.style.display = "flex";
        
        this.setState({deletedExpense: expense.id});
    }

    cancelDelete = (event) => {
        let myEl = document.getElementById("hideScreen");
        myEl.style.display = "None";
    }

    editExpense = (event, expense) => {
        const { navigate } = this.props;
        navigate("/edit", {state: {expense: expense}});
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

                    <label>Category</label>
                    <Select value={this.state.filteredCategories} multiple className='dropdown' onChange={this.changeCategory} renderValue={(selected)=>{selected.join(' ')}}>
                    {this.state.categories.map(category => 
                        <MenuItem key={category.id} value={category}>
                            <ListItemIcon>
                                <Checkbox checked={this.state.filteredCategories.includes(category)}></Checkbox>
                            </ListItemIcon>
                            <ListItemText primary={category.categoryName}></ListItemText>
                        </MenuItem>
                    )}
                    </Select>
                </nav>
                
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <td></td>
                            <td className='tableHeader' onClick={this.sortDate}>Date
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-vertical" viewBox="0 0 16 16">
                                    <path d="M8.354 14.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 13.293V2.707L6.354 3.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 2.707v10.586l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                                </svg>
                            </td>
                            <td className='tableHeader' onClick={this.sortCategory}>Category
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-vertical" viewBox="0 0 16 16">
                                    <path d="M8.354 14.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 13.293V2.707L6.354 3.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 2.707v10.586l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                                </svg>
                            </td>
                            <td className='tableHeader' onClick={this.sortSubcategory}>Subcategory
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-vertical" viewBox="0 0 16 16">
                                    <path d="M8.354 14.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 13.293V2.707L6.354 3.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 2.707v10.586l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                                </svg>
                            </td>
                            <td>Note</td>
                            <td className='amount tableHeader' onClick={this.sortAmount}>Amount
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-vertical" viewBox="0 0 16 16">
                                    <path d="M8.354 14.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 13.293V2.707L6.354 3.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 2.707v10.586l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                                </svg>  
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredExpenses.map(expense => 
                                <tr key = {expense.id.timestamp}>
                                    <td>
                                        <svg onClick={(e) => {this.deletePopup(e, expense)}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                        </svg>
                                        <svg onClick={(e) => {this.editExpense(e, expense)}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </td>
                                    <td>{this.formatJsDateToNormalDate(new Date(expense.date))}</td>
                                    <td>{expense.category.categoryName}</td>
                                    <td>{expense.subcategory.subcategoryName}</td>
                                    <td>{expense.note}</td>
                                    <td className='amount'>{parseFloat(expense.amount).toFixed(2)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className='amount'>Total: {total}</div>
                <div id='hideScreen'>
                    <div className='deletePopup'>
                        <div className='deleteText'>Would you like to delete this expense?</div>
                        <div className='buttons'>
                            <button className='cancelDelete' onClick={this.cancelDelete}>Cancel</button>
                            <button className='confirmDelete' onClick={this.deleteExpense}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ExpenseComponent);