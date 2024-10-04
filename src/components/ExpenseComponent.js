import React from 'react';
import ExpenseService from '../services/ExpenseService';
import { Select, MenuItem, ListItemText, ListItemIcon, Checkbox } from '@mui/material';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';

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
            filteredSubcategories:[],
            sort: "date",
            sortDirection: 1
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
            // this.setState({filteredSubcategories: subcategoryResponse.data})
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
        const { expenses, searchTerm, afterDate, beforeDate, filteredCategories, filteredSubcategories, sort, sortDirection } = this.state;

        let filtered = expenses.filter(expense => {
            const search = expense.note.toLowerCase().includes(searchTerm.toLowerCase())

            const expenseDate = new Date(expense.date);
            const inDateRange =(!afterDate || new Date(afterDate) <= expenseDate) && (!beforeDate || new Date(beforeDate) >= expenseDate);

            let category = false;
            for (let i = 0; i < filteredCategories.length; i++) {
                if (filteredCategories[i].categoryName == expense.category.categoryName) {
                    category = true;
                }
            }

            // let subcategory = false;
            // console.log(filteredSubcategories)
            // for (let i = 0; i < filteredSubcategories.length; i++) {
            //     if (filteredSubcategories[i].subcategoryName == expense.subcategory.subcategoryName) {
            //         subcategory = true;
            //     }
            // }

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
            sum += filteredExpenses[i].amount;
        }

        return sum;
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
    // changeSubcategory = (event) => {
    //     this.setState({filteredSubcategories: event.target.value})
    // }
    
    render () {
        const filteredExpenses = this.getFilteredExpenses();
        const total = this.getTotal(filteredExpenses);
        // let filteredSubcategories = this.filterSubcategory();
        
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

                    {/* <label>Subcategory</label>
                    <Select value={this.state.filteredSubcategories} multiple className='dropdown' onChange={this.changeSubcategory} renderValue={(selected)=>{selected.join(' ')}}>
                    {filteredSubcategories.map(subcategory => 
                        <MenuItem key={subcategory.id} value={subcategory}>
                            <ListItemIcon>
                                <Checkbox checked={this.state.filteredSubcategories.includes(subcategory)}></Checkbox>
                            </ListItemIcon>
                            <ListItemText primary={subcategory.subcategoryName}></ListItemText>
                        </MenuItem>
                    )}
                    </Select> */}
                </nav>
                
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <td onClick={this.sortDate}>Date</td>
                            <td onClick={this.sortCategory}>Category</td>
                            <td onClick={this.sortSubcategory}>Subcategory</td>
                            <td>Note</td>
                            <td className='amount' onClick={this.sortAmount}>Amount</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredExpenses.map(expense => 
                                <tr key = {expense.id.timestamp}>
                                    <td>{this.formatJsDateToNormalDate(new Date(expense.date))}</td>
                                    <td>{expense.category.categoryName}</td>
                                    <td>{expense.subcategory.subcategoryName}</td>
                                    <td>{expense.note}</td>
                                    <td className='amount'>{expense.amount}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className='amount'>Total: {total}</div>
            </div>
        )
    }
}

export default ExpenseComponent