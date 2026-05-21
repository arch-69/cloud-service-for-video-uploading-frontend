// import { useCallback, useEffect, useMemo, useState } from "react";
// import { AlertTriangle } from "lucide-react";
// import "./App.css";
// import AuthPanel from "./components/auth/AuthPanel";
// import Header from "./components/layout/Header";
// import Sidebar from "./components/layout/Sidebar";
// import UserDashboard from "./components/dashboard/UserDashboard";
// import AdminDashboard from "./components/dashboard/AdminDashboard";
// import SettingsPanel from "./components/dashboard/SettingsPanel";
// import UploadPanel from "./components/upload/UploadPanel";
// import UploadList from "./components/upload/UploadList";
// import ActivityFeed from "./components/shared/ActivityFeed";
// import VideoPlayer from "./components/upload/VideoPlayer";
// import Pricing from "./components/pricing/Pricing";
// import ModernDashboard from "./components/dashboard/ModernDashboard";
// import { useAuth } from "./hooks/useAuth";
// import { useUploadRecords } from "./hooks/useUploadRecords";
// import { useMultipartUpload } from "./hooks/useMultipartUpload";
// import { getCurrentPlanApi } from "./api/razorpay.api";

// function App() {
//   const [routeVideoKey, setRouteVideoKey] = useState(null);
//   const [currentPath, setCurrentPath] = useState(() =>
//     typeof window !== 'undefined' ? window.location.pathname : '/'
//   );
//   const [serviceAlert, setServiceAlert] = useState(null);
//   const [servicePopup, setServicePopup] = useState(null);
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [planLoading, setPlanLoading] = useState(false);
//   const [planError, setPlanError] = useState(null);

//   useEffect(() => {
//     const handleRoute = () => {
//       const pathname = window.location.pathname;
//       setCurrentPath(pathname);
//       const m = pathname.match(/^\/video\/(.+)$/);
//       if (m) {
//         setRouteVideoKey(decodeURIComponent(m[1]));
//       } else {
//         setRouteVideoKey(null);
//       }
//     };
//     handleRoute();
//     window.addEventListener('popstate', handleRoute);
//     return () => window.removeEventListener('popstate', handleRoute);
//   }, []);

//   useEffect(() => {
//     // read persisted alert in case it fired before App mounted
//     const timer = setTimeout(() => {
//       if (typeof window !== 'undefined') {
//         try {
//           const raw = window.sessionStorage.getItem('cloud_service_alert');
//           if (raw) {
//             const parsed = JSON.parse(raw);
//             if (parsed?.message) {
//               const payload = { id: parsed.ts || Date.now(), message: parsed.message };
//               setServiceAlert(payload);
//               setServicePopup(payload);
//             }
//             window.sessionStorage.removeItem('cloud_service_alert');
//           }
//         } catch {
//           // ignore
//         }
//       }
//     }, 0);

//     const handler = (ev) => {
//       const message = ev?.detail?.message || 'Service is currently unavailable.';
//       const payload = { id: Date.now(), message };
//       setServiceAlert(payload);
//       setServicePopup(payload);
//     };
//     if (typeof window !== 'undefined') {
//       window.addEventListener('service:blocked', handler);
//     }
//     return () => {
//       clearTimeout(timer);
//       if (typeof window !== 'undefined') {
//         window.removeEventListener('service:blocked', handler);
//       }
//     };
//   }, []);
//   const [activeView, setActiveView] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [theme, setTheme] = useState(() =>
//     window.localStorage.getItem("cloud_theme") || "dark"
//   );

//   const {
//     user,
//     users,
//     login,
//     register,
//     logout,
//     googleSignIn,
//     startGoogleSignIn,
//   } = useAuth();
//   const {
//     records,
//     activities,
//     saveRecord,
//     logActivity,
//     isLoading,
//     refresh,
//   } = useUploadRecords();

//   const uploadControls = useMultipartUpload({
//     user,
//     onRecordUpdate: saveRecord,
//     onActivity: logActivity,
//   });

//   const uploadPanelProps = {
//     onUpload: uploadControls.uploadFile,
//     onPause: uploadControls.pauseUpload,
//     onResume: uploadControls.resumeUpload,
//     onCancel: uploadControls.cancelUpload,
//     status: uploadControls.status,
//     progress: uploadControls.progress,
//     isPaused: uploadControls.isPaused,
//     currentUpload: uploadControls.currentUpload,
//     bitrateHistory: uploadControls.bitrateHistory,
//     error: uploadControls.error,
//   };

//   const refreshCurrentPlan = useCallback(async () => {
//     if (!user) {
//       setCurrentPlan(null);
//       return;
//     }
//     setPlanLoading(true);
//     setPlanError(null);
//     try {
//       const response = await getCurrentPlanApi();
//       if (response?.success) {
//         setCurrentPlan(response.data || null);
//       } else {
//         setCurrentPlan(null);
//         setPlanError(response?.message || "Failed to fetch current plan");
//       }
//     } catch (err) {
//       if (err?.response?.status === 404) {
//         setCurrentPlan(null);
//       } else {
//         setPlanError(
//           err?.response?.data?.message ||
//             err?.message ||
//             "Failed to fetch current plan"
//         );
//       }
//     } finally {
//       setPlanLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!user) {
//         setCurrentPlan(null);
//         return;
//       }
//       refreshCurrentPlan();
//     }, 0);
//     return () => clearTimeout(timer);
//   }, [refreshCurrentPlan, user]);

//   useEffect(() => {
//     document.documentElement.dataset.theme = theme;
//     window.localStorage.setItem("cloud_theme", theme);
//   }, [theme]);

//   const userRecords = useMemo(() => {
//     if (!user) {
//       return [];
//     }
//     return records;
//   }, [records, user]);

//   const scopedActivities = useMemo(() => {
//     if (!user) {
//       return [];
//     }

//     if (user.role === "admin") {
//       return activities;
//     }

//     return activities.filter(
//       (activity) => activity.ownerId === user.id
//     );
//   }, [activities, user]);

//   if (!user) {
//     return (
//       <AuthPanel
//         onLogin={login}
//         onRegister={register}
//         onGoogleSignIn={async () => {
//           const idToken = await startGoogleSignIn();
//           if (!idToken) throw new Error("No id token received from Google");
//           const result = await googleSignIn(idToken);
//           if (!result.ok) throw new Error(result.error || "Google sign-in failed");
//         }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-ink text-white">
//       <Sidebar
//         activeView={activeView}
//         onNavigate={setActiveView}
//         role={user.role}
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {sidebarOpen && (
//         <button
//           className="fixed inset-0 z-30 bg-black/40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//           aria-label="Close sidebar"
//         />
//       )}

//       <main className="min-h-screen bg-ink lg:ml-72">
//         <Header
//           user={user}
//           onLogout={logout}
//           theme={theme}
//           onOpenSidebar={() => setSidebarOpen(true)}
//           onToggleTheme={() =>
//             setTheme((prev) =>
//               prev === "dark" ? "light" : "dark"
//             )
//           }
//         />

//         {serviceAlert?.message && (
//           <div className="service-alert" role="alert">
//             <div className="service-alert__content">
//               <div className="service-alert__icon">
//                 <AlertTriangle size={18} />
//               </div>
//               <div>
//                 <p className="service-alert__title">Service temporarily unavailable</p>
//                 <p className="service-alert__message">{serviceAlert.message}</p>
//               </div>
//             </div>
//             <button
//               type="button"
//               className="ghost-button service-alert__dismiss"
//               onClick={() => setServiceAlert(null)}
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         {servicePopup?.message && (
//           <div className="service-popup" role="dialog" aria-modal="true">
//             <div className="service-popup__card">
//               <div className="service-popup__header">
//                 <div>
//                   <p className="service-popup__title">Action blocked</p>
//                   <p className="service-popup__message">{servicePopup.message}</p>
//                 </div>
//                 <button
//                   type="button"
//                   className="icon-button"
//                   onClick={() => setServicePopup(null)}
//                   aria-label="Close"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="service-popup__footer">
//                 <button
//                   className="primary-button"
//                   onClick={() => setServicePopup(null)}
//                 >
//                   Okay
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//   <section className="m-5">
//           {routeVideoKey ? (
//             <VideoPlayer keyId={routeVideoKey} />
//           ) : currentPath === '/pricing' ? (
//             <Pricing
//               currentPlan={currentPlan}
//               planLoading={planLoading}
//               planError={planError}
//               onRefreshCurrentPlan={refreshCurrentPlan}
//             />
//           ) : activeView === "dashboard" ? (
//             <ModernDashboard user={user} />
//           ) : activeView === "uploads" ? (
//             <div className="grid gap-6 lg:grid-cols-2">
//               <UploadPanel {...uploadPanelProps} />
//               <UploadList records={userRecords} title="Upload history" />
//             </div>
//           ) : activeView === "activity" ? (
//             <ActivityFeed activities={scopedActivities} />
//           ) : activeView === "admin" && user.role === "admin" ? (
//             <AdminDashboard
//               records={records}
//               activities={activities}
//               users={users}
//             />
//           ) : activeView === "settings" ? (
//             <SettingsPanel user={user} />
//           ) : (
//             <UserDashboard
//               records={userRecords}
//               activities={scopedActivities}
//               currentUpload={uploadControls.currentUpload}
//               uploadControls={uploadPanelProps}
//               isLoading={isLoading}
//               onRefresh={refresh}
//               currentPlan={currentPlan}
//               planLoading={planLoading}
//               planError={planError}
//             />
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;


import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";

import "./App.css";

import AuthPanel from "./components/auth/AuthPanel";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SettingsPanel from "./components/dashboard/SettingsPanel";
import ModernDashboard from "./components/dashboard/ModernDashboard";

import UploadPanel from "./components/upload/UploadPanel";
import UploadList from "./components/upload/UploadList";
import VideoPlayer from "./components/upload/VideoPlayer";

import ActivityFeed from "./components/shared/ActivityFeed";
import Pricing from "./components/pricing/Pricing";

import { useAuth } from "./hooks/useAuth";
import { useUploadRecords } from "./hooks/useUploadRecords";
import { useMultipartUpload } from "./hooks/useMultipartUpload";

import { getCurrentPlanApi } from "./api/razorpay.api";

function App() {
  const [routeVideoKey, setRouteVideoKey] =
    useState(null);

  const [currentPath, setCurrentPath] = useState(
    () =>
      typeof window !== "undefined"
        ? window.location.pathname
        : "/"
  );

  const [serviceAlert, setServiceAlert] =
    useState(null);

  const [servicePopup, setServicePopup] =
    useState(null);

  const [currentPlan, setCurrentPlan] =
    useState(null);

  const [planLoading, setPlanLoading] =
    useState(false);

  const [planError, setPlanError] =
    useState(null);

  const [activeView, setActiveView] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [theme, setTheme] = useState(
    () =>
      window.localStorage.getItem(
        "cloud_theme"
      ) || "dark"
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
    currentUpload:
      uploadControls.currentUpload,
    bitrateHistory:
      uploadControls.bitrateHistory,
    error: uploadControls.error,
  };

  useEffect(() => {
    const handleRoute = () => {
      const pathname =
        window.location.pathname;

      setCurrentPath(pathname);

      const match = pathname.match(
        /^\/video\/(.+)$/
      );

      if (match) {
        setRouteVideoKey(
          decodeURIComponent(match[1])
        );
      } else {
        setRouteVideoKey(null);
      }
    };

    handleRoute();

    window.addEventListener(
      "popstate",
      handleRoute
    );

    return () =>
      window.removeEventListener(
        "popstate",
        handleRoute
      );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw =
          window.sessionStorage.getItem(
            "cloud_service_alert"
          );

        if (raw) {
          const parsed = JSON.parse(raw);

          if (parsed?.message) {
            const payload = {
              id: parsed.ts || Date.now(),
              message: parsed.message,
            };

            setServiceAlert(payload);
            setServicePopup(payload);
          }

          window.sessionStorage.removeItem(
            "cloud_service_alert"
          );
        }
      } catch {
        //
      }
    }, 0);

    const handler = (ev) => {
      const message =
        ev?.detail?.message ||
        "Service unavailable.";

      const payload = {
        id: Date.now(),
        message,
      };

      setServiceAlert(payload);
      setServicePopup(payload);
    };

    window.addEventListener(
      "service:blocked",
      handler
    );

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        "service:blocked",
        handler
      );
    };
  }, []);

  const refreshCurrentPlan =
    useCallback(async () => {
      if (!user) {
        setCurrentPlan(null);
        return;
      }

      setPlanLoading(true);
      setPlanError(null);

      try {
        const response =
          await getCurrentPlanApi();

        if (response?.success) {
          setCurrentPlan(
            response.data || null
          );
        } else {
          setCurrentPlan(null);

          setPlanError(
            response?.message ||
              "Failed to fetch current plan"
          );
        }
      } catch (err) {
        if (
          err?.response?.status === 404
        ) {
          setCurrentPlan(null);
        } else {
          setPlanError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to fetch current plan"
          );
        }
      } finally {
        setPlanLoading(false);
      }
    }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setCurrentPlan(null);
        return;
      }

      refreshCurrentPlan();
    }, 0);

    return () => clearTimeout(timer);
  }, [refreshCurrentPlan, user]);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    window.localStorage.setItem(
      "cloud_theme",
      theme
    );
  }, [theme]);

  const userRecords = useMemo(() => {
    if (!user) return [];
    return records;
  }, [records, user]);

  const scopedActivities = useMemo(() => {
    if (!user) return [];

    if (user.role === "admin") {
      return activities;
    }

    return activities.filter(
      (activity) =>
        activity.ownerId === user.id
    );
  }, [activities, user]);

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816]">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[360px] w-[360px] rounded-full bg-sky-500/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <AuthPanel
            onLogin={login}
            onRegister={register}
            onGoogleSignIn={async () => {
              const idToken =
                await startGoogleSignIn();

              if (!idToken) {
                throw new Error(
                  "No token received"
                );
              }

              const result =
                await googleSignIn(idToken);

              if (!result.ok) {
                throw new Error(
                  result.error ||
                    "Google sign-in failed"
                );
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-8%] top-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[380px] w-[380px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        role={user.role}
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close sidebar"
        />
      )} */}


    <main className="relative min-h-screen overflow-x-hidden lg:ml-72">
  
  {/* Main shell background */}
  <div className="absolute inset-0 -z-10 bg-[#050816]" />

  {/* Sidebar separator */}
  <div className="pointer-events-none fixed left-72 top-0 hidden h-screen w-px bg-white/10 lg:block" />

  {/* Header */}
  <Header
    user={user}
    onLogout={logout}
    theme={theme}
    onOpenSidebar={() =>
      setSidebarOpen(true)
    }
    onToggleTheme={() =>
      setTheme((prev) =>
        prev === "dark"
          ? "light"
          : "dark"
      )
    }
  />

  {/* Top separator */}
  <div className="px-6">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>

  {/* Alerts */}
  <div className="relative z-20">
    {serviceAlert?.message && (
      <div className="mx-5 mt-5 overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/10 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          
          <div className="flex items-start gap-4">
            
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <AlertTriangle size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Service temporarily unavailable
              </p>

              <p className="mt-1 text-sm leading-6 text-white/60">
                {serviceAlert.message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setServiceAlert(null)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:bg-white/[0.06] hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Modal */}
  {servicePopup?.message && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020]/95 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">

        <div className="relative overflow-hidden border-b border-white/10 px-6 py-5">

          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative flex items-start gap-4">
            
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
              <AlertTriangle size={22} />
            </div>

            <div className="flex-1">
              
              <div className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-indigo-300"
                />

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
                  CloudDock Alert
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-white">
                Action blocked
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/60">
                {servicePopup.message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-5">
          <button
            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]"
            onClick={() =>
              setServicePopup(null)
            }
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Main content */}
  <section className="relative z-10 px-5 pb-6 pt-4 md:px-6">

    <div className="mx-auto max-w-[1800px]">

      {routeVideoKey ? (
        <VideoPlayer
          keyId={routeVideoKey}
        />
      ) : currentPath === "/pricing" ? (
        <Pricing
          currentPlan={currentPlan}
          planLoading={planLoading}
          planError={planError}
          onRefreshCurrentPlan={
            refreshCurrentPlan
          }
        />
      ) : activeView === "dashboard" ? (
        <ModernDashboard user={user} />
      ) : activeView === "uploads" ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          
          <UploadPanel
            {...uploadPanelProps}
          />

          <UploadList
            records={userRecords}
            title="Upload history"
          />
        </div>
      ) : activeView === "activity" ? (
        <ActivityFeed
          activities={scopedActivities}
        />
      ) : activeView === "admin" &&
        user.role === "admin" ? (
        <AdminDashboard
          records={records}
          activities={activities}
          users={users}
        />
      ) : activeView === "settings" ? (
        <SettingsPanel user={user} />
      ) : (
        <UserDashboard
          records={userRecords}
          activities={scopedActivities}
          currentUpload={
            uploadControls.currentUpload
          }
          uploadControls={
            uploadPanelProps
          }
          isLoading={isLoading}
          onRefresh={refresh}
          currentPlan={currentPlan}
          planLoading={planLoading}
          planError={planError}
        />
      )}

    </div>
  </section>
</main>

    </div>
  );
}

export default App;