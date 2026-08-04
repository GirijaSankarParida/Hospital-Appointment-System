import { useEffect, useState } from "react";
import api from "../api/axios";

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/medical-history/my")
      .then(({ data }) => setRecords(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>My Medical History</h2>
      {records.length === 0 ? (
        <p>No medical history records yet.</p>
      ) : (
        <div className="history-list">
          {records.map((r) => (
            <div key={r._id} className="history-card">
              <p><strong>Date:</strong> {new Date(r.visitDate).toLocaleDateString()}</p>
              <p><strong>Doctor:</strong> {r.doctor?.name} ({r.doctor?.specialization})</p>
              <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
              {r.prescription && <p><strong>Prescription:</strong> {r.prescription}</p>}
              {r.notes && <p><strong>Notes:</strong> {r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
