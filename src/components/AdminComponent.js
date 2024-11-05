import React from 'react';
import withRouter from '../withRouter';
import CategoryService from '../services/CategoryService';
import SubcategoryService from '../services/SubcategoryService';
import AddCategoryComponent from './AddCategoryComponent';
import AddSubcategoryComponent from './AddSubcategoryComponent';

class AdminComponent extends React.Component {

    componentDidMount() {
        document.getElementById("category").style.display = "none";
        document.getElementById("subcategory").style.display = "none";
    }

    addCategory = (event) => {
        document.getElementById("category").style.display = "block";
        document.getElementById("subcategory").style.display = "none";
    }

    addSubcategory = (event) => {
        document.getElementById("category").style.display = "none";
        document.getElementById("subcategory").style.display = "block";
    }

    render() {
        return (
            <div>
                <div className='adminButtons'>
                    <button className='btn adminButton' onClick={this.addCategory}>Add Category</button>
                    <button className='btn adminButton' onClick={this.addSubcategory}>Add Subcategory</button>
                </div>
                <div id='category'>
                    <AddCategoryComponent />
                </div>
                <div id='subcategory'>
                    <AddSubcategoryComponent />
                </div>
                
            </div>
        )
    }
}

export default withRouter(AdminComponent);