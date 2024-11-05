import React from 'react';
import withRouter from '../withRouter';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';

class AddSubcategoryComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            categories:[],
            category: "",
            subcategory: "",
            unique: true
        }
    }

    componentDidMount() {
        CategoryService.getCategories().then((categoryResponse) => {
            this.setState({categories: categoryResponse.data});
            this.setState({category: categoryResponse.data[0].categoryName});
        })
        SubcategoryService.getSubcategories().then((subcategoryResponse) => {
            this.setState({subcategories: subcategoryResponse.data});
        })
    }

    changeCategory = (event) => {
        this.setState({category: event.target.value});
        this.checkUnique(event.target.value, this.state.subcategory);
    }

    changeSubcategory = (event) => {
        this.setState({subcategory: event.target.value});
        this.checkUnique(this.state.category, event.target.value);
    }

    checkUnique(categoryName, subcategoryName) {
        const { subcategories } = this.state;
        this.setState({unique: true})
        const id = this.getId(categoryName);

        for (let i = 0; i < subcategories.length; i++) {
            if (subcategories[i].category == id && subcategories[i].subcategoryName == subcategoryName) {
                this.setState({unique: false});
                return;
            }
        }
    }


    getId(category) {
        const { categories } = this.state;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryName == category) {
                return categories[i].id;
            }
        }
        return 0;
    }

    submit = (event) => {
        SubcategoryService.createSubcategory(this.state.category, this.state.subcategory);
    }

    render() {
        return (
            <div>
                <form className='inputForm'>
                    <label>Category:</label>
                    <select onChange={this.changeCategory} value={this.state.category.categoryName} className='addInput category'>
                        {this.state.categories.map((category) =>(
                            <option value={category.categoryName} key={category.id}>{category.categoryName}</option>
                        ))}
                    </select>
                    <label>Subcategory:</label>
                    <input type="text" value={this.state.subcategory} onChange={this.changeSubcategory} className='addInput'></input>
                    <div style={{display: !this.state.unique ? 'block' : 'none', textAlign: 'center', color: 'red' }}>Already exists</div>
                    <br></br>
                    <div className='submit'>
                        <button type='submit' className='btn btn-success' onClick={this.submit} disabled={!this.state.subcategory || !this.state.unique}>Submit</button>
                    </div>
                    
                </form>
            </div>
        )
    }
}

export default withRouter(AddSubcategoryComponent);