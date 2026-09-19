import { useEffect, useState } from "react";
import api from "../../api/axios"; 

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDashboard = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setStats(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getDashboard();
    }, []);

 
    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (!stats) {
        return <p>Failed to load dashboard.</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <p>
                Welcome back, <strong>ClassGap Admin</strong>
            </p>

            <div>
                <div>
                    <h3>Students</h3>
                    <p>{stats.students}</p>
                </div>

                <div>
                    <h3>Teachers</h3>
                    <p>{stats.teachers}</p>
                </div>

                <div>
                    <h3>Classes</h3>
                    <p>{stats.classes}</p>
                </div>

                <div>
                    <h3>Subjects</h3>
                    <p>{stats.subjects}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;