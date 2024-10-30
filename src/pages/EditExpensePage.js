import '../App.css';
import InputExpenseComponent from '../components/InputExpenseComponent';

function EditExpensePage() {
  return (
    <div className="App">
      <h1 className='header'>Edit Expenses</h1>
      <div className='expenses'>
        <InputExpenseComponent />
      </div>
    </div>
  );
}

export default EditExpensePage;
