export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="site-Home">Expense tracker</a>
        <ul>
            <li>
                <a href="/add">Add Expense</a>
            </li>
            <li>
                <a href="/admin">Admin</a>
            </li>
        </ul>
    </nav>
}