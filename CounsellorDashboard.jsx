import { useState, useEffect } from "react";

function CounsellorDashboard({ counsellorId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch district-level data
    fetch(`/api/counsellor/${counsellorId}/dashboard`)
      .then(res => res.json())
      .then(setData);
  }, [counsellorId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#fffdd0] to-[#ffeb99]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-6">Counsellor Panel</h2>
        <nav className="space-y-2">
          <a href="#dashboard" className="block">Dashboard</a>
          <a href="#victims" className="block">Victims & Cases</a>
          <a href="#alerts" className="block">Risk Alerts</a>
          <a href="#interventions" className="block">Interventions</a>
          <a href="#reports" className="block">Reports & Analytics</a>
          <a href="#settings" className="block">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Counsellor Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">Total Victims: {data.total_registered_victims}</div>
          <div className="bg-white p-4 rounded shadow">Active: {data.active_victims}</div>
          <div className="bg-white p-4 rounded shadow">Closed: {data.closed_cases}</div>
          <div className="bg-white p-4 rounded shadow text-red-600 font-bold">High Risk: {data.high_risk_victims}</div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">Avg Distress: {data.average_distress_score}</div>
          <div className="bg-white p-4 rounded shadow">Avg Mood: {data.average_mood_score}</div>
          <div className="bg-white p-4 rounded shadow">Avg Stress: {data.average_stress_score}</div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-2">Recent Alerts</h2>
          <ul className="list-disc pl-6">
            <li>New Registrations: {data.new_registrations}</li>
            <li>New High Risk Cases: {data.new_high_risk_cases}</li>
            <li>Resolved Cases: {data.resolved_cases}</li>
            <li>Pending Counselling: {data.pending_counselling}</li>
            <li>Overdue Followups: {data.overdue_followups}</li>
          </ul>
        </div>

        {/* Interventions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">Legal Aid Required: {data.legal_aid_required}</div>
          <div className="bg-white p-4 rounded shadow">Medical Support Required: {data.medical_support_required}</div>
          <div className="bg-white p-4 rounded shadow">Relocation Required: {data.relocation_required}</div>
          <div className="bg-white p-4 rounded shadow">Protection Required: {data.protection_required}</div>
        </div>
      </main>
    </div>
  );
}

export default CounsellorDashboard;
