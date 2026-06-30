import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getMe, getMyPetsPaginated } from "../api/petApi";

import type { Pet } from "../types/Pet";

function PetsPage() {
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  const loadPets = useCallback(async (signal?: AbortSignal) => {
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

      setPets(petsPage.content);

      if (userData?.name) {
        setUserName(userData.name);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError("Could not load your pets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPets(controller.signal);

    return () => controller.abort();
  }, [loadPets]);

  const getPetImage = (pet: Pet) => {
    if (pet.imagesUrl && pet.imagesUrl.length > 0) {
      return pet.imagesUrl[0];
    }

    return "";
  };

  const firstName = userName.split(" ")[0] || "User";

  return (
    <div className="bolt-app-layout">
      <Sidebar />

      <main className="bolt-main">
        <header className="bolt-topbar">
          <h1>My Pets</h1>

          <div className="bolt-user-area">
            <div className="bolt-user-badge">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="bolt-content">
          <div className="bolt-welcome">
            <h2>Your registered pets</h2>
            <p>View and manage each pet profile from one place.</p>
          </div>

          {error && (
            <div className="bolt-error-card">
              <strong>Unable to load pets</strong>
              <p>{error}</p>
              <button onClick={() => loadPets()}>Try Again</button>
            </div>
          )}

          <article className="bolt-card">
            <div className="bolt-card-header">
              <h3>My Pets</h3>
            </div>

            {loading ? (
              <div className="bolt-empty">
                <h4>Loading pets...</h4>
                <p>Please wait while we load your registered pet profiles.</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="bolt-empty">
                <h4>No pets yet</h4>
                <p>Add your first pet from the Add Pet section.</p>
              </div>
            ) : (
              <div className="bolt-pet-list">
                {pets.map((pet) => {
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
        </section>
      </main>
    </div>
  );
}

export default PetsPage;