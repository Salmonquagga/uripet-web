import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { getHealthRecords, getMe, getMyPetsPaginated } from "../api/petApi";

import type { Pet } from "../types/Pet";
import type { HealthRecord } from "../types/HealthRecord";

interface VaccinationItem {
  pet: Pet;
  record: HealthRecord;
}

function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState<VaccinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  const loadVaccinations = useCallback(async (signal?: AbortSignal) => {
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
          const records = await getHealthRecords(pet.pid, "VACCINE");
          return records.map((record) => ({
            pet,
            record,
          }));
        })
      );

      setVaccinations(recordsByPet.flat());
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError("Could not load vaccination records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadVaccinations(controller.signal);

    return () => controller.abort();
  }, [loadVaccinations]);

  const firstName = userName.split(" ")[0] || "User";

  return (
    <div className="bolt-app-layout">
      <Sidebar />

      <main className="bolt-main">
        <header className="bolt-topbar">
          <h1>Vaccinations</h1>

          <div className="bolt-user-area">
            <div className="bolt-user-badge">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="bolt-content">
          <div className="bolt-welcome">
            <h2>Vaccination records</h2>
            <p>Review your pets' vaccination history and upcoming care.</p>
          </div>

          {error && (
            <div className="bolt-error-card">
              <strong>Unable to load vaccinations</strong>
              <p>{error}</p>
              <button onClick={() => loadVaccinations()}>Try Again</button>
            </div>
          )}

          <article className="bolt-card">
            <div className="bolt-card-header">
              <h3>Vaccinations</h3>
            </div>

            {loading ? (
              <div className="bolt-empty">
                <h4>Loading vaccinations...</h4>
                <p>Please wait while we load your pets' vaccination records.</p>
              </div>
            ) : vaccinations.length === 0 ? (
              <div className="bolt-empty">
                <h4>No vaccination records yet</h4>
                <p>Add vaccination records from each pet profile.</p>
              </div>
            ) : (
              <div className="bolt-vaccine-list">
                {vaccinations.map(({ pet, record }) => (
                  <div key={`${pet.pid}-${record.id}`} className="bolt-vaccine-row">
                    <div className="bolt-alert-icon">V</div>

                    <div>
                      <p>
                        <strong>{record.title}</strong> for {pet.name}
                      </p>
                      <span>{record.date}</span>
                    </div>

                    <button>{record.type}</button>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default VaccinationsPage;