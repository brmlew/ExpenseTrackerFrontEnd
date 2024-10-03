import React from 'react';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';
import ExpenseService from '../services/ExpenseService';

class AddExpenseComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
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
        CategoryService.getCategories().then((categoryResponse) => {
            this.setState({categories: categoryResponse.data});
            this.setState({category: categoryResponse.data[0]});
        })

        SubcategoryService.getSubcategories().then((subcategoryResponse) => {
            this.setState({subcategories: subcategoryResponse.data});
            this.setState({subcategory: subcategoryResponse.data[0]});
        })
    }

    changeCategory = (event) => {
        const { categories } = this.state;
        
        for (let i = 0; i < categories.length; i++) {
            if (categories[i]['categoryName'] == event.target.value) {
                this.setState({category: categories[i]});
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
        const { date, amount, note, category, subcategory} = this.state;
        console.log(date)
        ExpenseService.addExpense(date, amount, note, category['categoryName'], subcategory['subcategoryName']);
    }
    
    render() {
        let filteredSubcategories = this.filterSubcategory();
        return (
            <div>
                <form>
                    <label>Category:</label>
                    <select onChange={this.changeCategory}>
                        {this.state.categories.map((category) =>(
                            <option value={category.categoryName} key={category.id}>{category.categoryName}</option>
                        ))}
                    </select>
                    <br></br>
                    <br></br>
                    <label>Subcategory:</label>
                    <select onChange={this.changeSubcategory} onSubmit={this.changeSubcategory}>
                        {filteredSubcategories.map((subcategory) =>(
                            <option value={subcategory.subcategoryName} key={subcategory.id}>{subcategory.subcategoryName}</option>
                        ))}
                    </select>
                    <br></br>
                    <br></br>
                    <label>Date:</label>
                    <input type="date" className='datepicker' value={this.state.date} onChange={this.changeDate}></input>
                    <br></br>
                    <br></br>
                    <label>Amount:</label>
                    <input type="number" onChange={this.changeAmount}></input>
                    <br></br>
                    <br></br>
                    <label>Note:</label>
                    <input type="text" value={this.state.note} placeholder='Add note...' onChange={this.changeNote}></input>
                    <br></br>
                    <br></br>
                    <button type='submit' className='btn btn-success' onClick={this.submit}>Submit</button>
                </form>
            </div>
        )
    }

}

export default AddExpenseComponent;