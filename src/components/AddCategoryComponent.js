import React from 'react';
import withRouter from '../withRouter';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';

class AddCategoryComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            category: "",
            subcategory: "",
            unique: true,
            categories: []
        }
    }

    componentDidMount() {
        CategoryService.getCategories().then((categoryResponse) => {
            this.setState({categories: categoryResponse.data});
        })
        SubcategoryService.getSubcategories().then((subcategoryResponse) => {
            this.setState({subcategories: subcategoryResponse.data});
            console.log(subcategoryResponse.data);
        })
    }

    changeName = (event) => {
        this.setState({category: event.target.value});
        this.checkUnique(event.target.value);
    }

    changeSubcategory = (event) => {
        this.setState({subcategory: event.target.value});
    }
    
    checkUnique(categoryName) {
        const { categories } = this.state;
        this.setState({unique: true})
        

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryName == categoryName) {
                this.setState({unique: false});
                return;
            }
        }
    }


    submit = (event) => {
        CategoryService.createCategory(this.state.category, this.state.subcategory);
    }

    render() {
        return (
            <div>
                <form className='inputForm'>
                    <label>Category:</label>
                    <input type="text" value={this.state.category} onChange={this.changeName} className='addInput category'></input>
                    <div style={{display: !this.state.unique ? 'block' : 'none', textAlign: 'center', color: 'red' }}>Already exists</div>
                    <br></br>
                    <label>Subcategory:</label>
                    <input type="text" value={this.state.subcategory} onChange={this.changeSubcategory} className='addInput'></input>
                    <div className='submit'>
                        <button type='submit' className='btn btn-success' onClick={this.submit} disabled={!this.state.unique || !this.state.subcategory || !this.state.category}>Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(AddCategoryComponent);