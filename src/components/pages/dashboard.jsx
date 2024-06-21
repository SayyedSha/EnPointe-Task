import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './Dashboard.css';
import Transaction from './Transaction';

function Dashboard() {
    const [kpiData, setKpiData] = useState({ totalDebited: 0, totalCredited: 0, currentBalance: 0 });

    

    useEffect(() => {
        const fetchKpiData = async () => {
            try {
                const response = await axios.get("http://localhost:8001/api/dashboard/KPI", {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`
                    }
                });
                setKpiData(response.data);
            } catch (error) {
                console.error("Error fetching KPI data:", error);
            }
        };

        fetchKpiData();
    }, []);

   


    return (
        <div className="container">
            
            <div className="kpi-container">
                <div className="kpi">
                    <h2>Total Credited</h2>
                    <p>{kpiData.totalCredited}</p>
                </div>
                <div className="kpi">
                    <h2>Total Debited</h2>
                    <p>{kpiData.totalDebited}</p>
                </div>
                <div className="kpi">
                    <h2>Current Balance</h2>
                    <p>{kpiData.currentBalance}</p>
                </div>
                
            </div>
            <div className='table-container'>
                <Transaction/>
            </div>
            
        </div>
    );
}

export default Dashboard;
