import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="section">
      <div className="container">
        <h1>Listing Manager</h1>
        <p className="lead">
          Create, edit, publish, archive, and remove Twin Unity listings.
          Admin access is limited to configured Supabase users.
        </p>
        <AdminDashboard />
      </div>
    </main>
  );
}
