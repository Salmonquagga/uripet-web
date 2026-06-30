import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getHealthRecords, getMe, getMyPetsPaginated } from "../api/petApi";

import type { Pet } from "../types/Pet";
import type { HealthRecord } from "../types/HealthRecord";

interface MedicalRecordItem {
  pet: Pet;
  record: HealthRecord;
}

function MedicalRecordsPage() {
  const navigate = useNavigate();

  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  const loadRecords = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const [petsPage, userData] = await Promise.all([
        getMyPetsPaginated({
          page: 0,
          size: 20,
          search: "",
        }),
        getMe(signal),
      ]);

      if (userData?.name) {
        setUserName(userData.name);
      }

      const pets = petsPage.content;

      const recordsByPet = await Promise.all(
        pets.map(async (pet) => {
          const petRecords = await getHealthRecords(pet.pid);
          return petRecords.map((record) => ({
            pet,
            record,
          }));
        })
      );

      setRecords(recordsByPet.flat());
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError("Could not load medical records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadRecords(controller.signal);

    return () => controller.abort();
  }, [loadRecords]);

  const firstName = userName.split(" ")[0] || "User";

  return (
    <div className="bolt-app-layout">
      <Sidebar />

      <main className="bolt-main">
        <header className="bolt-topbar">
          <h1>Medical Records</h1>

          <div className="bolt-user-area">
            <div className="bolt-user-badge">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="bolt-content">
          <div className="bolt-welcome">
            <h2>Health history</h2>
            <p>Review your pets' medical records in one place.</p>
          </div>

          {error && (
            <div className="bolt-error-card">
              <strong>Unable to load records</strong>
              <p>{error}</p>
              <button onClick={() => loadRecords()}>Try Again</button>
            </div>
          )}

          <article className="bolt-card">
            <div className="bolt-card-header">
              <h3>Medical Records</h3>
            </div>

            {loading ? (
              <div className="bolt-empty">
                <h4>Loading records...</h4>
                <p>Please wait while we load your pets' medical information.</p>
              </div>
            ) : records.length === 0 ? (
              <div className="bolt-empty">
                <h4>No medical records yet</h4>
                <p>Add medical records from each pet profile.</p>
              </div>
            ) : (
              <div className="bolt-record-list">
                {records.map(({ pet, record }) => (
                  <button
                    key={`${pet.pid}-${record.id}`}
                    className="bolt-record-row"
                    onClick={() => navigate(`/pets/${pet.pid}/health-records`)}
                  >
                    <div className="bolt-record-icon">R</div>

                    <div>
                      <strong>{record.title}</strong>
                      <p>
                        {pet.name} - {record.date}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default MedicalRecordsPage;