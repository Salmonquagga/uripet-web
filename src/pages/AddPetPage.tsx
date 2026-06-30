import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import { createPet, getMe } from "../api/petApi";

interface SelectedImage {
  file: File;
  url: string;
}

function AddPetPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(false);

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
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [images]);

  const firstName = userName.split(" ")[0] || "User";
  const today = new Date().toISOString().split("T")[0];

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) return;

    const availableSlots = 3 - images.length;

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

    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const imageToRemove = current[index];
      URL.revokeObjectURL(imageToRemove.url);
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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

    setLoading(true);

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

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    try {
      await createPet(formData);
      toast.success("Pet created successfully.");
      navigate("/pets");
    } catch {
      toast.error("Could not create pet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mainPreview = images[0]?.url;

  return (
    <div className="bolt-app-layout">
      <Sidebar />

      <main className="bolt-main">
        <header className="bolt-topbar">
          <h1>Add Pet</h1>

          <div className="bolt-user-area">
            <div className="bolt-user-badge">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="bolt-content">
          <div className="bolt-welcome">
            <h2>Add a New Pet</h2>
            <p>Register your pet profile with basic information, photos and emergency data.</p>
          </div>

          <section className="bolt-form-layout">
            <form className="bolt-form-card" onSubmit={handleSubmit}>
              <div className="bolt-form-grid">
                <div className="bolt-field">
                  <label htmlFor="add-pet-name">Name</label>
                  <input
                    id="add-pet-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Luna"
                    required
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="add-pet-species">Species</label>
                  <input
                    id="add-pet-species"
                    value={species}
                    onChange={(event) => setSpecies(event.target.value)}
                    placeholder="Dog"
                    required
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="add-pet-breed">Breed</label>
                  <input
                    id="add-pet-breed"
                    value={breed}
                    onChange={(event) => setBreed(event.target.value)}
                    placeholder="Shih Tzu"
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="add-pet-color">Color</label>
                  <input
                    id="add-pet-color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    placeholder="Brown"
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="add-pet-birth-date">Birth Date</label>
                  <input
                    id="add-pet-birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    max={today}
                  />
                </div>

                <div className="bolt-field">
                  <label htmlFor="add-pet-weight">Weight (kg)</label>
                  <input
                    id="add-pet-weight"
                    type="number"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="3.5"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="bolt-field bolt-field-full">
                  <label htmlFor="add-pet-emergency-contact">Emergency Contact</label>
                  <input
                    id="add-pet-emergency-contact"
                    value={emergencyContact}
                    onChange={(event) => setEmergencyContact(event.target.value)}
                    placeholder="+51 987654321"
                  />
                </div>
              </div>

              <div className="bolt-form-actions">
                <button
                  type="button"
                  className="bolt-secondary-button"
                  onClick={() => navigate("/pets")}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button type="submit" className="bolt-primary-button" disabled={loading}>
                  {loading ? "Creating..." : "Create Pet"}
                </button>
              </div>
            </form>

            <aside className="bolt-side-card">
              {mainPreview ? (
                <img src={mainPreview} alt="Pet preview" className="bolt-preview-photo" />
              ) : (
                <div className="bolt-preview-avatar">
                  {name.trim() ? name.trim().charAt(0).toUpperCase() : "P"}
                </div>
              )}

              <h3>{name.trim() || "Pet preview"}</h3>
              <p>{breed.trim() || species.trim() || "Your pet information will appear here."}</p>

              <div className="bolt-photo-panel">
                <div className="bolt-photo-panel-header">
                  <strong>Pet Photos</strong>
                  <span>{images.length} / 3</span>
                </div>

                <div className="bolt-photo-grid">
                  {images.map((image, index) => (
                    <div className="bolt-photo-thumb" key={image.url}>
                      <img src={image.url} alt={`Selected pet photo ${index + 1}`} />
                      <button type="button" onClick={() => removeImage(index)}>
                        ×
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
                    <label className="bolt-photo-upload">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleImageChange}
                      />
                      <span>+</span>
                      Add photos
                    </label>
                  )}
                </div>

                <p className="bolt-photo-hint">Maximum 3 photos. JPG, PNG or WEBP.</p>
              </div>

              <div className="bolt-tip-box">
                <strong>After creating</strong>
                <p>You can open the pet profile to add medical records, caregivers and QR information.</p>
              </div>
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}

export default AddPetPage;