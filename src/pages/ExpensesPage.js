import '../App.css';
import ExpenseComponent from '../components/ExpenseComponent';

function ExpensesPage() {
  return (
    <div className="App">
      <h1 className='header'>Expenses</h1>
      <div className='expenses'>
        <ExpenseComponent />
      </div>
    </div>
  );
}

export default ExpensesPage;
