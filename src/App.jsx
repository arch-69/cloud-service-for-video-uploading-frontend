import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import "./App.css";
import AuthPanel from "./components/auth/AuthPanel";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SettingsPanel from "./components/dashboard/SettingsPanel";
import UploadPanel from "./components/upload/UploadPanel";
import UploadList from "./components/upload/UploadList";
import ActivityFeed from "./components/shared/ActivityFeed";
import VideoPlayer from "./components/upload/VideoPlayer";
import Pricing from "./components/pricing/Pricing";
import { useAuth } from "./hooks/useAuth";
import { useUploadRecords } from "./hooks/useUploadRecords";
import { useMultipartUpload } from "./hooks/useMultipartUpload";

function App() {
  const [routeVideoKey, setRouteVideoKey] = useState(null);
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [serviceAlert, setServiceAlert] = useState(null);
  const [servicePopup, setServicePopup] = useState(null);

  useEffect(() => {
    const handleRoute = () => {
      const pathname = window.location.pathname;
      setCurrentPath(pathname);
      const m = pathname.match(/^\/video\/(.+)$/);
      if (m) {
        setRouteVideoKey(decodeURIComponent(m[1]));
      } else {
        setRouteVideoKey(null);
      }
    };
    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  useEffect(() => {
    // read persisted alert in case it fired before App mounted
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          const raw = window.sessionStorage.getItem('cloud_service_alert');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.message) {
              const payload = { id: parsed.ts || Date.now(), message: parsed.message };
              setServiceAlert(payload);
              setServicePopup(payload);
            }
            window.sessionStorage.removeItem('cloud_service_alert');
          }
        } catch {
          // ignore
        }
      }
    }, 0);

    const handler = (ev) => {
      const message = ev?.detail?.message || 'Service is currently unavailable.';
      const payload = { id: Date.now(), message };
      setServiceAlert(payload);
      setServicePopup(payload);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('service:blocked', handler);
    }
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('service:blocked', handler);
      }
    };
  }, []);
  const [activeView, setActiveView] = useState("dashboard");
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("cloud_theme") || "dark"
  );

  const {
    user,
    users,
    login,
    register,
    logout,
    googleSignIn,
    startGoogleSignIn,
  } = useAuth();
  const {
    records,
    activities,
    saveRecord,
    logActivity,
    isLoading,
    refresh,
  } = useUploadRecords();

  const uploadControls = useMultipartUpload({
    user,
    onRecordUpdate: saveRecord,
    onActivity: logActivity,
  });

  const uploadPanelProps = {
    onUpload: uploadControls.uploadFile,
    onPause: uploadControls.pauseUpload,
    onResume: uploadControls.resumeUpload,
    onCancel: uploadControls.cancelUpload,
    status: uploadControls.status,
    progress: uploadControls.progress,
    isPaused: uploadControls.isPaused,
    currentUpload: uploadControls.currentUpload,
    bitrateHistory: uploadControls.bitrateHistory,
    error: uploadControls.error,
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("cloud_theme", theme);
  }, [theme]);

  const userRecords = useMemo(() => {
    if (!user) {
      return [];
    }
    return records;
  }, [records, user]);

  const scopedActivities = useMemo(() => {
    if (!user) {
      return [];
    }

    if (user.role === "admin") {
      return activities;
    }

    return activities.filter(
      (activity) => activity.ownerId === user.id
    );
  }, [activities, user]);

  if (!user) {
    return (
      <AuthPanel
        onLogin={login}
        onRegister={register}
        onGoogleSignIn={async () => {
          const idToken = await startGoogleSignIn();
          if (!idToken) throw new Error("No id token received from Google");
          const result = await googleSignIn(idToken);
          if (!result.ok) throw new Error(result.error || "Google sign-in failed");
        }}
      />
    );
  }

  return (
    <div className="app-shell">
 <Sidebar     
        activeView={activeView}
        onNavigate={setActiveView}
        role={user.role}
      />

      <main className="app-main">
        <Header
          user={user}
          onLogout={logout}
          theme={theme}
          onToggleTheme={() =>
            setTheme((prev) =>
              prev === "dark" ? "light" : "dark"
            )
          }
        />

        {serviceAlert?.message && (
          <div className="service-alert" role="alert">
            <div className="service-alert__content">
              <div className="service-alert__icon">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="service-alert__title">Service temporarily unavailable</p>
                <p className="service-alert__message">{serviceAlert.message}</p>
              </div>
            </div>
            <button
              type="button"
              className="ghost-button service-alert__dismiss"
              onClick={() => setServiceAlert(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {servicePopup?.message && (
          <div className="service-popup" role="dialog" aria-modal="true">
            <div className="service-popup__card">
              <div className="service-popup__header">
                <div>
                  <p className="service-popup__title">Action blocked</p>
                  <p className="service-popup__message">{servicePopup.message}</p>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setServicePopup(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="service-popup__footer">
                <button
                  className="primary-button"
                  onClick={() => setServicePopup(null)}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="app-content">
          {routeVideoKey ? (
            <VideoPlayer keyId={routeVideoKey} />
          ) : currentPath === '/pricing' ? (
            <Pricing />
          ) : activeView === "dashboard" && (
            user.role === "admin" ? (
              <AdminDashboard
                records={records}
                activities={activities}
                users={users}
              />
            ) : (
              <UserDashboard
                records={userRecords}
                activities={scopedActivities}
                currentUpload={uploadControls.currentUpload}
                uploadControls={uploadPanelProps}
                isLoading={isLoading}
                onRefresh={refresh}
              />
            )
          )}

          {activeView === "uploads" && (
            <div className="dashboard-grid">
              <UploadPanel {...uploadPanelProps} />
              <UploadList records={userRecords} title="Upload history" />
            </div>
          )}

          {activeView === "activity" && (
            <ActivityFeed activities={scopedActivities} />
          )}

          {activeView === "admin" && user.role === "admin" && (
            <AdminDashboard
              records={records}
              activities={activities}
              users={users}
            />
          )}

          {activeView === "settings" && (
            <SettingsPanel user={user} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;