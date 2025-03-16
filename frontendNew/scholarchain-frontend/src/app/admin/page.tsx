import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin! Here you can manage the application.</p>
        {/* Add more admin components or content as needed */}
      </main>
    </div>
  );
};

export default AdminDashboard;
