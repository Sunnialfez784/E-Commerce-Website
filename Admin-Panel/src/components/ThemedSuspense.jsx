import "../assets/css/loadingSpinner.css";

function ThemedSuspense() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white p-6 text-lg font-medium text-slate-600 dark:bg-slate-950 dark:text-slate-400">
      <div className={`lds-ripple`}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default ThemedSuspense;
