import { Link, Outlet } from "react-router-dom";

function AdminLayout(){
    return (
        <div>
            <aside>
                <h2>ClassGap</h2>

                <nav>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/teachers">Teachers</Link>
                    <Link to="/admin/students">Students</Link>
                    <Link to="/admin/classes">Classes</Link>
                    <Link to="/admin/subjects">Subjects</Link>
                    <Link to="/admin/topics">Topics</Link>
                    <Link to="/admin/logout">Logout</Link>
                </nav>
            </aside>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;

