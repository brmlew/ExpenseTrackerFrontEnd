import '../App.css';
import InputExpenseComponent from '../components/InputExpenseComponent';

function AddExpensesPage() {
  return (
    <div className="App">
      <h1 className='header'>Add Expenses</h1>
      <div className='expenses'>
        <InputExpenseComponent />
      </div>
    </div>
  );
}

export default AddExpensesPage;
