import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getHealthRecords, getMe, getMyPetsPaginated } from "../api/petApi";

import petsIcon from "../assets/mypets.png";
import vaccinationIcon from "../assets/vaccination.png";
import healthRecordIcon from "../assets/healthrecord.png";

import type { Pet } from "../types/Pet";
import type { HealthRecord } from "../types/HealthRecord";

interface RecordWithPet {
  pet: Pet;
  record: HealthRecord;
}

function DashboardPage() {
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [records, setRecords] = useState<RecordWithPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  const loadData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const [petsPage, userData] = await Promise.all([
        getMyPetsPaginated({ page: 0, size: 10, search: "" }),
        getMe(signal),
      ]);

      const loadedPets = petsPage.content;
      setPets(loadedPets);

      if (userData?.name) {
        setUserName(userData.name);
      }

      const recordsByPet = await Promise.all(
        loadedPets.map(async (pet) => {
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
      setError("Could not load your information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);

    return () => controller.abort();
  }, [loadData]);

  const getPetImage = (pet: Pet) => {
    if (pet.imagesUrl && pet.imagesUrl.length > 0) {
      return pet.imagesUrl[0];
    }

    return "";
  };

  const firstName = userName?.split(" ")[0] || "User";

  const vaccinationRecords = records.filter(
    ({ record }) => record.type === "VACCINE"
  );

  const recentRecords = [...records]
    .sort(
      (a, b) =>
        new Date(b.record.date).getTime() - new Date(a.record.date).getTime()
    )
    .slice(0, 4);

  const recentVaccinations = [...vaccinationRecords]
    .sort(
      (a, b) =>
        new Date(b.record.date).getTime() - new Date(a.record.date).getTime()
    )
    .slice(0, 3);

  return (
    <div className="bolt-app-layout">
      <Sidebar />

      <main className="bolt-main">
        <header className="bolt-topbar">
          <h1>Home</h1>

          <div className="bolt-user-area">
            <div className="bolt-user-badge">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="bolt-content">
          <div className="bolt-welcome">
            <h2>Welcome back, {firstName}!</h2>
            <p>Here's what's happening with your pets today.</p>
          </div>

          {error && (
            <div className="bolt-error-card">
              <strong>Unable to load information</strong>
              <p>{error}</p>
              <button onClick={() => loadData()}>Try Again</button>
            </div>
          )}

          <section className="bolt-stats-grid">
            <article className="bolt-stat-card">
              <div className="bolt-stat-icon green">
                <img src={petsIcon} alt="Pets" />
              </div>

              <div>
                <strong>{pets.length}</strong>
                <p>Pets</p>
              </div>
            </article>

            <article className="bolt-stat-card">
              <div className="bolt-stat-icon yellow">
                <img src={vaccinationIcon} alt="Vaccinations" />
              </div>

              <div>
                <strong>{vaccinationRecords.length}</strong>
                <p>Vaccinations</p>
              </div>
            </article>

            <article className="bolt-stat-card">
              <div className="bolt-stat-icon blue">
                <img src={healthRecordIcon} alt="Records" />
              </div>

              <div>
                <strong>{records.length}</strong>
                <p>Records</p>
              </div>
            </article>
          </section>

          <section className="bolt-home-grid">
            <article className="bolt-card">
              <div className="bolt-card-header">
                <h3>My Pets</h3>

                <button
                  className="bolt-ghost-button"
                  onClick={() => navigate("/pets")}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="bolt-empty">
                  <h4>Loading pets...</h4>
                  <p>Please wait while we load your registered pet profiles.</p>
                </div>
              ) : pets.length === 0 ? (
                <div className="bolt-empty">
                  <h4>No pets yet</h4>
                  <p>Add your first pet to start tracking their health and safety.</p>
                  <button onClick={() => navigate("/add-pet")}>Add Pet</button>
                </div>
              ) : (
                <div className="bolt-pet-list">
                  {pets.slice(0, 3).map((pet) => {
                    const image = getPetImage(pet);

                    return (
                      <button
                        key={pet.pid}
                        className="bolt-pet-row"
                        onClick={() => navigate(`/pets/${pet.pid}`)}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={`Profile photo of ${pet.name}`}
                            className="bolt-pet-avatar"
                          />
                        ) : (
                          <div className="bolt-pet-placeholder">
                            {pet.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="bolt-pet-info">
                          <h4>{pet.name}</h4>
                          <p>{pet.breed || pet.species || "Pet profile"}</p>
                        </div>

                        <span className="bolt-status">Healthy</span>
                        <span className="bolt-chevron">›</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </article>

            <article className="bolt-card">
              <div className="bolt-card-header">
                <h3>Vaccinations</h3>

                <button
                  className="bolt-ghost-button"
                  onClick={() => navigate("/vaccinations")}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="bolt-empty">
                  <h4>Loading vaccinations...</h4>
                  <p>Please wait while we load your pets' vaccination records.</p>
                </div>
              ) : recentVaccinations.length === 0 ? (
                <div className="bolt-empty">
                  <h4>No vaccination records yet</h4>
                  <p>Add vaccination records from each pet profile.</p>
                </div>
              ) : (
                <div className="bolt-vaccine-list">
                  {recentVaccinations.map(({ pet, record }) => (
                    <div
                      key={`${pet.pid}-${record.id}`}
                      className="bolt-vaccine-row"
                    >
                      <div className="bolt-alert-icon">
                        <img src={vaccinationIcon} alt="" />
                      </div>

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

            <article className="bolt-card">
              <div className="bolt-card-header">
                <h3>Recent Medical Records</h3>

                <button
                  className="bolt-ghost-button"
                  onClick={() => navigate("/medical-records")}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="bolt-empty">
                  <h4>Loading records...</h4>
                  <p>Please wait while we load your pets' health records.</p>
                </div>
              ) : recentRecords.length === 0 ? (
                <div className="bolt-empty">
                  <h4>No medical records yet</h4>
                  <p>Add records from each pet profile.</p>
                </div>
              ) : (
                <div className="bolt-record-list">
                  {recentRecords.map(({ pet, record }) => (
                    <button
                      key={`${pet.pid}-${record.id}`}
                      className="bolt-record-row"
                      onClick={() => navigate(`/pets/${pet.pid}/health-records`)}
                    >
                      <div className="bolt-record-icon">
                        <img src={healthRecordIcon} alt="" />
                      </div>

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
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;