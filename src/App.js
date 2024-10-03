import './App.css';
import AddExpenseComponent from './components/AddExpenseComponent';
import ExpenseComponent from './components/ExpenseComponent';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensesPage from './pages/AddExpensePage';
import Navbar from './components/NavbarComponent';
import "./nav-style.css"

function App() {
  let component
  switch (window.location.pathname) {
    case "/":
      component = <ExpensesPage />
      break
    case "/add":
      component = <AddExpensesPage />
      break
  }
  return (
    <>
      <Navbar />
      {component}
    </>
    

    // <Router>
    //   <div className="App">
    //     <Switch>
    //       <Route exact path='/' element={<ExpensesPage />}/>
    //       <Route exact path='/add' element={<AddExpensesPage />}/>
    //     </Switch>
    //   </div>
    // </Router>
  );
}

export default App;
