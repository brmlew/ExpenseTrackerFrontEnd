import React from 'react';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';
import ExpenseService from '../services/ExpenseService';
import withRouter from '../withRouter';

class EditExpenseComponent extends React.Component {
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
        let expense = location.state.expense;
        console.log(expense);
        CategoryService.getCategories().then((categoryResponse) => {
            this.setState({categories: categoryResponse.data});
            this.setState({category: expense.category});
        })

        SubcategoryService.getSubcategories().then((subcategoryResponse) => {
            this.setState({subcategories: subcategoryResponse.data});
            this.setState({subcategory: expense.subcategory});
        })

        this.setState({id: expense.id})
        this.setState({date: this.formatJsDateToNormalDate(new Date(expense.date))});
        this.setState({amount: expense.amount});
        this.setState({note: expense.note});
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

    submit= (event) => {
        event.preventDefault();
        const { id, date, amount, note, category, subcategory} = this.state;
        const { navigate } = this.props;
        ExpenseService.updateExpense(id, date, amount, note, category['categoryName'], subcategory['subcategoryName']);
        navigate("/");
    }
    
    render() {
        let filteredSubcategories = this.filterSubcategory();
        return (
            <div>
                <form>
                    <label>Category:</label>
                    <select onChange={this.changeCategory} className='addInput'>
                        {this.state.categories.map((category) =>(
                            <option value={category.categoryName} key={category.id}>{category.categoryName}</option>
                        ))}
                    </select>
                    <br></br>
                    <label>Subcategory:</label>
                    <select onChange={this.changeSubcategory} onSubmit={this.changeSubcategory} className='addInput'>
                        {filteredSubcategories.map((subcategory) =>(
                            <option value={subcategory.subcategoryName} key={subcategory.id}>{subcategory.subcategoryName}</option>
                        ))}
                    </select>
                    <br></br>
                    <label>Date:</label>
                    <input type="date" className='datepicker addInput' value={this.state.date} onChange={this.changeDate}></input>
                    <br></br>
                    <label>Amount:</label>
                    <input type="number" onChange={this.changeAmount} value={this.state.amount} className='addInput'></input>
                    <br></br>
                    <label>Note:</label>
                    <input type="text" value={this.state.note} placeholder='Add note...' onChange={this.changeNote} className='addInput'></input>
                    <br></br>
                    <button type='submit' className='btn btn-success' onClick={this.submit}>Submit</button>
                </form>
            </div>
        )
    }

}

export default withRouter(EditExpenseComponent);