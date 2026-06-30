import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getHealthRecordsPaginated,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} from "../api/petApi";

import type { HealthRecord } from "../types/HealthRecord";

const recordTypes = [
  "ALL",
  "VACCINE",
  "DISEASE",
  "ALLERGY",
  "SURGERY",
  "NOTE",
  "MEDICATION",
];

function HealthRecordsPage() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [filterType, setFilterType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [type, setType] = useState("VACCINE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadRecords = async () => {
    if (!pid) return;

    try {
      setLoading(true);

      const data = await getHealthRecordsPaginated({
        pid,
        page: Math.max(page - 1, 0),
        size,
        type: filterType,
      });

      setRecords(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (error) {
      console.error(error);
      toast.error("Could not load health records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [pid, filterType, page, size]);

  const safePage = Math.min(page, totalPages);
  const showingFrom = totalElements === 0 ? 0 : (safePage - 1) * size + 1;
  const showingTo = Math.min(safePage * size, totalElements);

  const clearForm = () => {
    setType("VACCINE");
    setTitle("");
    setDescription("");
    setDate("");
    setEditingId(null);
  };

  const handleSubmitRecord = async () => {
    if (!pid) return;

    if (!title.trim() || !description.trim() || !date) {
      toast.error("Please complete the title, description and date.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        type,
        title: title.trim(),
        description: description.trim(),
        date,
      };

      if (editingId) {
        await updateHealthRecord(pid, editingId, payload);
        toast.success("Health record updated successfully.");
      } else {
        await createHealthRecord(pid, payload);
        toast.success("Health record created successfully.");
      }

      clearForm();
      setPage(1);
      await loadRecords();
    } catch (error) {
      console.error(error);

      toast.error(
        editingId
          ? "Could not update health record."
          : "Could not create health record."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record: HealthRecord) => {
    setEditingId(record.id);
    setType(record.type);
    setTitle(record.title);
    setDescription(record.description);
    setDate(record.date);
  };

  const handleDelete = async (record: HealthRecord) => {
    if (!pid) return;

    const confirmed = window.confirm(`Delete "${record.title}"?`);

    if (!confirmed) return;

    try {
      await deleteHealthRecord(pid, record.id);

      toast.success("Health record deleted successfully.");

      if (editingId === record.id) {
        clearForm();
      }

      await loadRecords();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete record.");
    }
  };

  return (
    <div className="app-layout">
      <main className="dashboard">
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            color: "#64748b",
            fontSize: "14px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="text-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <span>/</span>

          <button
            className="text-button"
            onClick={() => navigate(`/pets/${pid}`)}
          >
            Pet Profile
          </button>

          <span>/</span>

          <span>Health Records</span>
        </nav>

        <button
          className="text-button"
          onClick={() => navigate(`/pets/${pid}`)}
          aria-label="Go back to pet profile"
        >
          Back to pet profile
        </button>

        <div className="panel" style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <p className="eyebrow">Health Records</p>

              <h1 style={{ marginBottom: "6px" }}>Medical History</h1>

              <p style={{ color: "#64748b", margin: 0 }}>
                Track vaccines, allergies, medication, surgeries and notes.
              </p>
            </div>

            <div
              className="stat-icon"
              aria-label={`${totalElements} health records`}
            >
              {totalElements}
            </div>
          </div>

          <div className="pet-row" style={{ marginTop: "24px" }}>
            <strong>Pet ID</strong>
            <span>{pid}</span>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "24px",
            }}
          >
            <div className="panel" style={{ boxShadow: "none" }}>
              <h3>{editingId ? "Edit health record" : "Add health record"}</h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label htmlFor="health-record-type">Type</label>

                <select
                  id="health-record-type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  aria-label="Health record type"
                >
                  <option value="VACCINE">VACCINE</option>
                  <option value="DISEASE">DISEASE</option>
                  <option value="ALLERGY">ALLERGY</option>
                  <option value="SURGERY">SURGERY</option>
                  <option value="NOTE">NOTE</option>
                  <option value="MEDICATION">MEDICATION</option>
                </select>

                <label htmlFor="health-record-title">Title</label>

                <input
                  id="health-record-title"
                  aria-label="Health record title"
                  placeholder="Rabies vaccine"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />

                <label htmlFor="health-record-description">Description</label>

                <textarea
                  id="health-record-description"
                  aria-label="Health record description"
                  placeholder="Annual vaccine or relevant medical detail"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                />

                <label htmlFor="health-record-date">Date</label>

                <input
                  id="health-record-date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  aria-label="Health record date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />

                <button
                  className="primary-button"
                  onClick={handleSubmitRecord}
                  disabled={saving}
                  aria-label={
                    editingId ? "Update health record" : "Create health record"
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Record"
                    : "Create Record"}
                </button>

                {editingId && (
                  <button
                    className="secondary-button"
                    onClick={clearForm}
                    aria-label="Cancel health record edit"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <div className="panel" style={{ boxShadow: "none" }}>
              <h3>Records</h3>

              <div
                aria-label="Health record filters"
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "14px",
                  marginBottom: "18px",
                }}
              >
                {recordTypes.map((recordType) => (
                  <button
                    key={recordType}
                    className={
                      filterType === recordType
                        ? "primary-button"
                        : "secondary-button"
                    }
                    onClick={() => {
                      setFilterType(recordType);
                      setPage(1);
                    }}
                    aria-label={`Filter records by ${recordType}`}
                    style={{
                      padding: "8px 12px",
                      minHeight: "36px",
                    }}
                  >
                    {recordType}
                  </button>
                ))}
              </div>

              {loading ? (
                  <div className="empty-state" aria-live="polite">
                    <h3>Loading records...</h3>

                    <p>
                      Please wait while we load this pet's medical information.
                    </p>
                  </div>
                ) : records.length === 0 ? (
                  <div className="empty-state">
                    <h3>No health records yet</h3>

                    <p>
                      This pet does not have any medical information registered.
                      Create the first record to start tracking its health history.
                    </p>

                    <button
                      className="primary-button"
                      onClick={() =>
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        })
                      }
                    >
                      Add First Record
                    </button>
                  </div>
                ) : (
                <>
                  <div className="pets-list" aria-label="Health records list">
                    {records.map((record) => (
                      <div key={record.id} className="pet-row">
                        <div>
                          <h3>{record.title}</h3>

                          <p>
                            {record.type} · {record.date}
                          </p>

                          <p style={{ marginTop: "6px" }}>
                            {record.description}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="secondary-button"
                            onClick={() => handleEdit(record)}
                            aria-label={`Edit record ${record.title}`}
                          >
                            Edit
                          </button>

                          <button
                            className="secondary-button"
                            onClick={() => handleDelete(record)}
                            aria-label={`Delete record ${record.title}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p style={{ color: "#64748b", fontSize: "14px" }}>
                      Showing {showingFrom}-{showingTo} of {totalElements}{" "}
                      records
                    </p>

                    <div
                      aria-label="Health records pagination controls"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <select
                        value={size}
                        onChange={(event) => {
                          setSize(Number(event.target.value));
                          setPage(1);
                        }}
                        aria-label="Select records per page"
                        style={{
                          padding: "8px",
                          borderRadius: "10px",
                        }}
                      >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                      </select>

                      <button
                        className="secondary-button"
                        onClick={() => setPage(1)}
                        disabled={safePage === 1}
                        aria-label="Go to first page"
                      >
                        First
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() => setPage((current) => current - 1)}
                        disabled={safePage === 1}
                        aria-label="Go to previous page"
                      >
                        Previous
                      </button>

                      <span
                        aria-live="polite"
                        style={{
                          color: "#334155",
                          fontWeight: 600,
                        }}
                      >
                        Page {safePage} of {totalPages}
                      </span>

                      <button
                        className="secondary-button"
                        onClick={() => setPage((current) => current + 1)}
                        disabled={safePage === totalPages}
                        aria-label="Go to next page"
                      >
                        Next
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() => setPage(totalPages)}
                        disabled={safePage === totalPages}
                        aria-label="Go to last page"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HealthRecordsPage;