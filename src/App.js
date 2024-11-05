import './App.css';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensesPage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import AdminPage from './pages/AdminPage';
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
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
