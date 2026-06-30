import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import { getMe, getPetById, updatePet } from "../api/petApi";

import type { Pet } from "../types/Pet";

interface SelectedImage {
  file: File;
  url: string;
}

function EditPetPage() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<SelectedImage[]>([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getMe(controller.signal)
      .then((user) => {
        if (user?.name) setUserName(user.name);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const loadPet = async () => {
      if (!pid) return;

      try {
        const data = await getPetById(pid);

        setPet(data);
        setName(data.name ?? "");
        setSpecies(data.species ?? "");
        setBreed(data.breed ?? "");
        setBirthDate(data.birthDate ?? "");
        setWeight(String(data.weight ?? ""));
        setColor(data.color ?? "");
        setEmergencyContact(data.emergencyContact ?? "");
        setExistingImages(data.imagesUrl ?? []);
      } catch {
        toast.error("Could not load pet information.");
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [pid]);

  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [newImages]);

  const firstName = userName.split(" ")[0] || "User";
  const today = new Date().toISOString().split("T")[0];
  const totalImages = existingImages.length + newImages.length;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) return;

    const availableSlots = 3 - totalImages;

    if (selectedFiles.length > availableSlots) {
      toast.error(`You can upload up to 3 photos. You have ${availableSlots} slot(s) left.`);
      event.target.value = "";
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only JPG, PNG or WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    const imagesToAdd = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImages((current) => [...current, ...imagesToAdd]);
    event.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((current) => {
      const imageToRemove = current[index];

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!pid) return;

    if (!name.trim()) {
      toast.error("Enter the pet name.");
      return;
    }

    if (!species.trim()) {
      toast.error("Enter the pet species.");
      return;
    }

    if (weight && Number(weight) <= 0) {
      toast.error("Weight must be greater than 0.");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("species", species.trim());

    if (breed.trim()) formData.append("breed", breed.trim());
    if (birthDate) formData.append("birthDate", birthDate);
    if (weight) formData.append("weight", weight);
    if (color.trim()) formData.append("color", color.trim());

    if (emergencyContact.trim()) {
      formData.append("emergencyContact", emergencyContact.trim());
    }

    existingImages.forEach((imageUrl) => {
      formData.append("imagesUrl", imageUrl);
    });

    newImages.forEach((image) => {
      formData.append("images", image.file);
    });

    try {
      const updatedPet = await updatePet(pid, formData);

      console.log("Updated pet:", updatedPet);

      setPet(updatedPet);
      setExistingImages(updatedPet.imagesUrl ?? []);
      setNewImages((current) => {
        current.forEach((image) => URL.revokeObjectURL(image.url));
        return [];
      });

      toast.success("Pet updated successfully.");

      navigate(`/pets/${pid}`, {
        state: { refresh: Date.now() },
      });
    } catch (error) {
      console.error("Update pet error:", error);
      toast.error("Could not update pet. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bolt-app-layout">
        <Sidebar />

        <main className="bolt-main">
          <header className="bolt-topbar">
            <h1>Edit Pet</h1>
          </header>

          <section className="bolt-content">
            <div className="bolt-empty">
              <h4>Loading pet...</h4>
              <p>Please wait while we load your pet information.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="bolt-app-layout">
        <Sidebar />

        <main className="bolt-main">
          <header className="bolt-topbar">
            <h1>Edit Pet</h1>
          </header>

          <section className="bolt-content">
            <div className="bolt-empty">
              <h4>Pet not found</h4>
              <p>We could not find this pet profile.</p>
              <button onClick={() => navigate("/pets")}>Back to My Pets</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const mainPreview = existingImages[0] || newImages[0]?.url;

  return (
    <div className="bolt-app-layout">
      <Sidebar />

      <main className="bolt-main">
        <header className="bolt-topbar">
          <h1>Edit Pet</h1>

          <div className="bolt-user-area">
            <div className="bolt-user-badge">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="bolt-content">
          <div className="bolt-welcome">
            <h2>Edit {pet.name}</h2>
            <p>Update your pet profile, emergency data and photo gallery.</p>
          </div>

          <section className="bolt-form-layout">
            <form className="bolt-form-card" onSubmit={handleSubmit}>
              <div className="bolt-form-grid">
                <div className="bolt-field">
                  <label htmlFor="edit-pet-name">Name</label>
                  <input
                    id="edit-pet-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="edit-pet-species">Species</label>
                  <input
                    id="edit-pet-species"
                    value={species}
                    onChange={(event) => setSpecies(event.target.value)}
                    required
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="edit-pet-breed">Breed</label>
                  <input
                    id="edit-pet-breed"
                    value={breed}
                    onChange={(event) => setBreed(event.target.value)}
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="edit-pet-color">Color</label>
                  <input
                    id="edit-pet-color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="edit-pet-birth-date">Birth Date</label>
                  <input
                    id="edit-pet-birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    max={today}
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="edit-pet-weight">Weight (kg)</label>
                  <input
                    id="edit-pet-weight"
                    type="number"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="bolt-field bolt-field-full">
                  <label htmlFor="edit-pet-emergency-contact">
                    Emergency Contact
                  </label>
                  <input
                    id="edit-pet-emergency-contact"
                    value={emergencyContact}
                    onChange={(event) => setEmergencyContact(event.target.value)}
                  />
                </div>
              </div>

              <div className="bolt-form-actions">
                <button
                  type="button"
                  className="bolt-secondary-button"
                  onClick={() => navigate(`/pets/${pid}`)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bolt-primary-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <aside className="bolt-side-card">
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="Pet preview"
                  className="bolt-preview-photo"
                />
              ) : (
                <div className="bolt-preview-avatar">
                  {name.trim() ? name.trim().charAt(0).toUpperCase() : "P"}
                </div>
              )}

              <h3>{name.trim() || "Pet preview"}</h3>
              <p>
                {breed.trim() ||
                  species.trim() ||
                  "Your pet information will appear here."}
              </p>

              <div className="bolt-photo-panel">
                <div className="bolt-photo-panel-header">
                  <strong>Pet Photos</strong>
                  <span>{totalImages} / 3</span>
                </div>

                <div className="bolt-photo-grid">
                  {existingImages.map((imageUrl, index) => (
                    <div className="bolt-photo-thumb" key={`${imageUrl}-${index}`}>
                      <img
                        src={imageUrl}
                        alt={`Current pet photo ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        disabled={saving}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {newImages.map((image, index) => (
                    <div className="bolt-photo-thumb" key={image.url}>
                      <img src={image.url} alt={`New pet photo ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        disabled={saving}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {totalImages < 3 && (
                    <label className="bolt-photo-upload">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleImageChange}
                        disabled={saving}
                      />
                      <span>+</span>
                      Add photos
                    </label>
                  )}
                </div>

                <p className="bolt-photo-hint">
                  Maximum 3 photos. JPG, PNG or WEBP.
                </p>
              </div>

              <div className="bolt-tip-box">
                <strong>Profile quality</strong>
                <p>
                  Clear photos help identify your pet faster if someone scans
                  their QR code.
                </p>
              </div>
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}

export default EditPetPage;