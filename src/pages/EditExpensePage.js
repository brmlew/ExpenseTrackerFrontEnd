import '../App.css';
import EditExpenseComponent from '../components/EditExpenseComponent';

function EditExpensePage() {
  return (
    <div className="App">
      <h1 className='header'>Edit Expenses</h1>
      <div className='expenses'>
        <EditExpenseComponent />
      </div>
    </div>
  );
}

export default EditExpensePage;
