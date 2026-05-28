import UpComingReport from "./components/UpComingReport";
import TodayScheduleView from "./components/TodayScheduleView";
import AssignmentStatusView from "./components/AssignmentStatusView";
import GroupActivitiesView from "./components/GroupActivitiesView";
import AssignmentProgressView from "./components/AssignmentProgressView";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const studentName = "Sal Monineath";
  const firstName = studentName.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header className="relative mb-8">
        <div
          aria-hidden
          className="absolute -top-10 right-0 w-80 h-52 bg-linear-to-br from-indigo-100 to-violet-100 rounded-full blur-3xl opacity-50 pointer-events-none -z-10"
        />

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-2">
              {today}
            </p>
            <h1 className="text-[2.5rem] font-bold tracking-tight leading-tight text-stone-900 mb-2">
              {getGreeting()},{" "}
              <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>
            <p className="text-sm text-stone-400">
              You have{" "}
              <span className="font-semibold text-amber-500">2 deadlines</span>{" "}
              this week. Stay focused.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-150">
              + Assignment
            </button>
            <button className="bg-white hover:bg-stone-50 active:scale-95 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-xl border border-stone-200 shadow-sm transition-all duration-150">
              + Event
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden">
          <UpComingReport />
        </div>
        <div className="col-span-2 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden">
          <TodayScheduleView />
        </div>
        <div className="col-span-1 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 overflow-hidden">
          <AssignmentStatusView />
        </div>
        <div className="col-span-2 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 overflow-hidden">
          <GroupActivitiesView />
        </div>
        <div className="col-span-1 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden">
          <AssignmentProgressView />
        </div>
      </div>
    </>
  );
}
