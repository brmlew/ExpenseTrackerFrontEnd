import './App.css';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensesPage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import Navbar from './components/NavbarComponent';
import "./nav-style.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='' element={<ExpensesPage />} />
        <Route path='/add' element={<AddExpensesPage />} />
        <Route path='/edit' element={<EditExpensePage />} />
      </Routes>
    </BrowserRouter>
  )
  // let component
  // switch (window.location.pathname) {
  //   case "/":
  //     component = <ExpensesPage />
  //     break
  //   case "/add":
  //     component = <AddExpensesPage />
  //     break
  //   case "/edit":
  //     component = <EditExpensePage />
  // }
  // return (
  //   <>
  //     <Navbar />
  //     {component}
  //   </>
  // );
}

export default App;
