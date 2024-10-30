import React, { useEffect } from 'react';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';
import ExpenseService from '../services/ExpenseService';
import withRouter from '../withRouter';

class InputExpenseComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: 0,
            date: "",
            amount: 0,
            note: "",
            category: "",
            subcategory: "",
            categories: [],
            subcategories: []
        }
    }

    componentDidMount() {
        const {location} = this.props;
        
        if (location.state) {
            let expense = location.state.expense;
            this.setState({id: expense.id})
            this.setState({date: this.formatJsDateToNormalDate(new Date(expense.date))});
            this.setState({amount: expense.amount});
            this.setState({note: expense.note});
            this.setState({category: expense.category});
            this.setState({subcategory: expense.subcategory});
        }

        CategoryService.getCategories().then((categoryResponse) => {
            this.setState({categories: categoryResponse.data});
            if (!location.state) this.setState({category: categoryResponse.data[0]});
        })

        SubcategoryService.getSubcategories().then((subcategoryResponse) => {
            this.setState({subcategories: subcategoryResponse.data});
            if (!location.state) this.setState({subcategory: subcategoryResponse.data[0]});
        })

        
    }

    changeCategory = (event) => {
        const { categories } = this.state;
        
        for (let i = 0; i < categories.length; i++) {
            if (categories[i]['categoryName'] == event.target.value) {
                this.setState({category: categories[i]}, () => {
                    const filtered = this.filterSubcategory();
                    this.setState({subcategory: filtered[0]});
                })
                break;
            }
        }
        
    }

    changeSubcategory = (event) => {
        const { category, subcategories } = this.state;
        for (let i = 0; i < subcategories.length; i++) {
            if (subcategories[i]['subcategoryName'] == event.target.value && subcategories[i]['category'] == category['id']) {
                this.setState({subcategory: subcategories[i]});
                break;
            }
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


    changeDate = (event) => {
        this.setState({date: event.target.value});
    }

    changeAmount = (event) => {
        this.setState({amount: event.target.value});
    }

    changeNote = (event) => {
        this.setState({note: event.target.value});
    }

    filterSubcategory = () => {
        const { category, subcategories } = this.state;
        if (category == "") return [];

        return subcategories.filter(subcategory => {
            return subcategory['category'] == category['id'];
        });
    }

    cancel = (event) => {
        const { navigate } = this.props;
        navigate("/");
    }

    submit= (event) => {
        event.preventDefault();
        const { id, date, amount, note, category, subcategory } = this.state;
        const { navigate, location } = this.props;
        if (location.state == null) {
            ExpenseService.addExpense(date, amount, note, category['categoryName'], subcategory['subcategoryName']);
        } else {
            ExpenseService.updateExpense(id, date, amount, note, category['categoryName'], subcategory['subcategoryName']);
        }
        navigate("/");
    }
    
    render() {
        let filteredSubcategories = this.filterSubcategory();
        return (
            <div>
                <form className='inputForm'>
                    <label>Category:</label>
                    <select onChange={this.changeCategory} value={this.state.category.categoryName} className='addInput category'>
                        {this.state.categories.map((category) =>(
                            <option value={category.categoryName} key={category.id}>{category.categoryName}</option>
                        ))}
                    </select>
                    <br></br>
                    <label>Subcategory:</label>
                    <select onChange={this.changeSubcategory} onSubmit={this.changeSubcategory} value={this.state.subcategory.subcategoryName} className='addInput'>
                        {filteredSubcategories.map((subcategory) =>(
                            <option value={subcategory.subcategoryName} key={subcategory.id}>{subcategory.subcategoryName}</option>
                        ))}
                    </select>
                    <br></br>
                    <label>Date:</label>
                    <input type="date" className='datepicker inputDate addInput' value={this.state.date} onChange={this.changeDate} max={this.formatJsDateToNormalDate(new Date())}></input>
                    <br></br>
                    <label>Amount:</label>
                    <input type="number" onChange={this.changeAmount} value={this.state.amount} className='addInput amountInput'></input>
                    <br></br>
                    <label>Note:</label>
                    <input type="text" value={this.state.note} placeholder='Add note...' onChange={this.changeNote} className='addInput note'></input>
                    <br></br>
                    <div className='inputButtons'>
                        <button onClick={this.cancel} className='btn'>Cancel</button>
                        <button type='submit' className='btn btn-success' onClick={this.submit} disabled={!this.state.date}>Submit</button>
                    </div>
                    
                </form>
            </div>
        )
    }

}

export default withRouter(InputExpenseComponent);