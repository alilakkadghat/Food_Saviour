import React, { useState } from "react";
import {
  Utensils,
  MapPin,
  Search,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function FoodSaviourApp() {
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [ngos, setNgos] = useState([
    {
      id: 1,
      name: "Feeding India",
      priority: 1,
      contact: "+91-9876543210",
      area: "Mumbai",
    },
    {
      id: 2,
      name: "Akshaya Patra",
      priority: 2,
      contact: "+91-9876543211",
      area: "Mumbai",
    },
    {
      id: 3,
      name: "Robin Hood Army",
      priority: 3,
      contact: "+91-9876543212",
      area: "Mumbai",
    },
  ]);
  const [activityLog, setActivityLog] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const searchEvents = async () => {
    if (!location) {
      alert("Please enter a location");
      return;
    }

    setIsSearching(true);
    addLog("info", `Calling backend for ${location}...`);

    try {
      const response = await fetch(
        `http://localhost:8000/run-event-agent?city=${encodeURIComponent(location)}`,
        { method: "POST" },
      );

      const data = await response.json();
      console.log("run-event-agent response:", data);

      const eventsList = data.events ?? [];
      console.log(
        "Keys:",
        eventsList[0] ? Object.keys(eventsList[0]) : "no events",
      );
      console.log("First event object:", eventsList[0]);
      addLog("info", "DEBUG: mapping code running");

      const count = data.count ?? eventsList.length ?? 0;

      const normalized = eventsList.map((e) => ({
        name: e.Event_Name ?? "Unnamed Event",
        type: e.Event_Type ?? "Event",
        location: e.Location ?? location,
        date: e.Event_Date
          ? new Date(e.Event_Date).toLocaleDateString()
          : "N/A",
        estimatedFood: e.Attendance
          ? `${Math.ceil(e.Attendance * 0.6)} meals (est.)`
          : "N/A",
        _raw: e,
      }));

      setEvents(normalized);

      if (data.status === "no events found") {
        addLog("warning", `No events found in ${location}`);
      } else {
        addLog("success", `Events found: ${count}`);
      }

      // OPTIONAL: langchain agent (doesn't affect events list)
      const analysisResponse = await fetch(
        `http://localhost:8000/run-langchain-agent?city=${encodeURIComponent(location)}`,
        { method: "POST" },
      );

      const analysisData = await analysisResponse.json();
      console.log("Langchain output:", analysisData);
      addLog("info", "Langchain reasoning agent completed");
    } catch (err) {
      console.error(err);
      addLog("error", "Backend connection failed");
    } finally {
      setIsSearching(false);
    }
  };

  const processEvent = async (event) => {
    setIsProcessing(true);
    addLog("info", `Analyzing event: ${event.name}...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      for (const ngo of ngos.sort((a, b) => a.priority - b.priority)) {
        addLog(
          "success",
          `Contacting ${ngo.name} (Priority ${ngo.priority}) at ${ngo.contact}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const responded = Math.random() > 0.3;
        if (responded) {
          addLog("success", `✓ ${ngo.name} confirmed pickup for ${event.name}`);
          break;
        } else {
          addLog("warning", `${ngo.name} unavailable, trying next...`);
        }
      }
    } catch (error) {
      addLog("error", "Error processing event");
    } finally {
      setIsProcessing(false);
    }
  };

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLog((prev) => [...prev, { type, message, timestamp }]);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Utensils size={32} color="#fff" />
          <h1 style={styles.logo}>Food Saviour AI</h1>
        </div>
        <button
          style={styles.refreshBtn}
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </header>

      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Events Found</span>
            <span style={styles.statValue}>{events.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>NGOs Active</span>
            <span style={styles.statValue}>{ngos.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Actions Taken</span>
            <span style={styles.statValue}>
              {activityLog.filter((l) => l.type === "success").length}
            </span>
          </div>
        </div>

        <div style={styles.gridContainer}>
          {/* Search Section */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🔍 Event Discovery</h2>
            <p style={styles.cardSubtitle}>
              AI-powered search for food surplus opportunities
            </p>

            <div style={styles.searchBox}>
              <MapPin size={20} color="#7c3aed" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Enter location (e.g., Mumbai, Delhi)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <button
              style={{ ...styles.primaryBtn, opacity: isSearching ? 0.7 : 1 }}
              onClick={searchEvents}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Sparkles
                    size={18}
                    style={{ animation: "pulse 1.5s ease-in-out infinite" }}
                  />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Search Events
                </>
              )}
            </button>
          </div>

          {/* Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.iconBox}>
              <Utensils size={32} color="#7c3aed" />
            </div>
            <h2 style={styles.infoTitle}>Save. Connect. Impact.</h2>
            <p style={styles.infoText}>
              Automatically discover food surplus events and connect with NGOs
              to prevent waste and feed those in need.
            </p>
            <div style={styles.poweredBy}>
              <span style={styles.poweredText}>POWERED BY</span>
              <span style={styles.aliText}>AI</span>
            </div>
          </div>
        </div>

        {/* NGO Priority List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📋 NGO Priority List</h2>
          <div style={styles.ngoList}>
            {ngos
              .sort((a, b) => a.priority - b.priority)
              .map((ngo) => (
                <div key={ngo.id} style={styles.ngoItem}>
                  <div style={styles.ngoInfo}>
                    <div style={styles.priorityBadge}>P{ngo.priority}</div>
                    <div>
                      <div style={styles.ngoName}>{ngo.name}</div>
                      <div style={styles.ngoDetails}>
                        <MapPin size={14} /> {ngo.area} • <Phone size={14} />{" "}
                        {ngo.contact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Events Found */}
        {events.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🎉 Events Found ({events.length})</h2>
            <div style={styles.eventsGrid}>
              {events.map((event, idx) => (
                <div key={idx} style={styles.eventCard}>
                  <div style={styles.eventHeader}>
                    <h3 style={styles.eventName}>{event.name}</h3>
                    <span style={styles.eventType}>{event.type}</span>
                  </div>
                  <div style={styles.eventDetails}>
                    <div style={styles.eventDetail}>
                      <MapPin size={16} color="#6b7280" />
                      <span>{event.location}</span>
                    </div>
                    <div style={styles.eventDetail}>
                      <Clock size={16} color="#6b7280" />
                      <span>{event.date}</span>
                    </div>
                    <div style={styles.eventDetail}>
                      <Utensils size={16} color="#6b7280" />
                      <span>{event.estimatedFood}</span>
                    </div>
                  </div>
                  <button
                    style={styles.processBtn}
                    onClick={() => processEvent(event)}
                    disabled={isProcessing}
                  >
                    <Phone size={16} />
                    Contact NGOs
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Activity Log</h2>
          <div style={styles.logContainer}>
            {activityLog.length === 0 ? (
              <div style={styles.emptyLog}>
                No activity yet. Start by searching for events.
              </div>
            ) : (
              activityLog
                .slice()
                .reverse()
                .map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.logItem,
                      animation: "slideIn 0.3s ease",
                    }}
                  >
                    <div style={styles.logIcon}>
                      {log.type === "success" && (
                        <CheckCircle size={18} color="#10b981" />
                      )}
                      {log.type === "error" && (
                        <AlertCircle size={18} color="#ef4444" />
                      )}
                      {log.type === "info" && (
                        <Sparkles size={18} color="#3b82f6" />
                      )}
                      {log.type === "warning" && (
                        <AlertCircle size={18} color="#f59e0b" />
                      )}
                    </div>
                    <div style={styles.logContent}>
                      <div style={styles.logMessage}>{log.message}</div>
                      <div style={styles.logTime}>{log.timestamp}</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
  },
  refreshBtn: {
    padding: "10px 24px",
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#7c3aed",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1f2937",
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },
  searchBox: {
    position: "relative",
    marginBottom: "16px",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px 24px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  infoCard: {
    background: "linear-gradient(135deg, #fff 0%, #f9fafb 100%)",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    border: "2px solid #7c3aed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  iconBox: {
    width: "64px",
    height: "64px",
    background: "#f3e8ff",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  infoTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#7c3aed",
    marginBottom: "12px",
  },
  infoText: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  poweredBy: {
    marginTop: "auto",
  },
  poweredText: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: "600",
    letterSpacing: "1px",
    marginRight: "8px",
  },
  aliText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f59e0b",
  },
  ngoList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  ngoItem: {
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
  ngoInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  priorityBadge: {
    width: "40px",
    height: "40px",
    background: "#7c3aed",
    color: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },
  ngoName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "4px",
  },
  ngoDetails: {
    fontSize: "13px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  eventCard: {
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  eventHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  eventName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
  },
  eventType: {
    padding: "4px 12px",
    background: "#ddd6fe",
    color: "#5b21b6",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  eventDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  eventDetail: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  processBtn: {
    width: "100%",
    padding: "10px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  logContainer: {
    maxHeight: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  emptyLog: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  logItem: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  logIcon: {
    flexShrink: 0,
  },
  logContent: {
    flex: 1,
  },
  logMessage: {
    fontSize: "14px",
    color: "#1f2937",
    marginBottom: "4px",
  },
  logTime: {
    fontSize: "12px",
    color: "#9ca3af",
  },
};
