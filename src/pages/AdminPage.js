import '../App.css';
import AdminComponent from '../components/AdminComponent';

function AdminPage() {
  return (
    <div className="App">
      <h1 className='header'>Admin</h1>
      <div>
        <AdminComponent />
      </div>
    </div>
  );
}

export default AdminPage;
