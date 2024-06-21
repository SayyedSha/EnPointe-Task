import React from 'react';

export default function Kpi({ kpiData }) {
  if (!kpiData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>KPI Data</h2>
      <p>Total Debited: {kpiData.totalDebited}</p>
      <p>Total Credited: {kpiData.totalCredited}</p>
      <p>Current Balance: {kpiData.currentBalance}</p>
    </div>
  );
}
