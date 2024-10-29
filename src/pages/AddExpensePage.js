import '../App.css';
import AddExpenseComponent from '../components/AddExpenseComponent';

function AddExpensesPage() {
  return (
    <div className="App">
      <h1 className='header'>Add Expenses</h1>
      <div className='expenses'>
        <AddExpenseComponent />
      </div>
    </div>
  );
}

export default AddExpensesPage;
