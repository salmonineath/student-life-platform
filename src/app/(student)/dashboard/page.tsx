import UpComingReport from "./components/UpComingReport";
import TodayScheduleView from "./components/TodayScheduleView";
import AssignmentStatusView from "./components/AssignmentStatusView";
import GroupActivitiesView from "./components/GroupActivitiesView";
import AssignmentProgressView from "./components/AssignmentProgressView";

export default function DashboardPage() {
  const studentName = "Sal Monineath";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>

      {/* ── Header ── */}
      <header className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-400 mb-1">
            {today}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-1.5">
            Welcome back,{" "}
            <span className="text-indigo-600">{studentName}</span>
          </h1>
          <p className="text-sm text-stone-400">
            Here&apos;s what&apos;s happening with your studies today.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all">
            + New Assignment
          </button>
          <button className="bg-white hover:bg-stone-100 active:scale-95 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-stone-200 transition-all">
            + New Event
          </button>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-4 gap-4">

        {/* Row 1 */}
        <div className="col-span-2 bg-white border border-stone-200 rounded-2xl hover:shadow-lg hover:shadow-stone-100 transition-shadow duration-200 overflow-hidden">
          <UpComingReport />
        </div>
        <div className="col-span-2 bg-white border border-stone-200 rounded-2xl hover:shadow-lg hover:shadow-stone-100 transition-shadow duration-200 overflow-hidden">
          <TodayScheduleView />
        </div>

        {/* Row 2 */}
        <div className="col-span-1 bg-white border border-stone-200 rounded-2xl hover:shadow-lg hover:shadow-stone-100 transition-shadow duration-200 overflow-hidden">
          <AssignmentStatusView />
        </div>
        <div className="col-span-2 bg-white border border-stone-200 rounded-2xl hover:shadow-lg hover:shadow-stone-100 transition-shadow duration-200 overflow-hidden">
          <GroupActivitiesView />
        </div>
        <div className="col-span-1 bg-white border border-stone-200 rounded-2xl hover:shadow-lg hover:shadow-stone-100 transition-shadow duration-200 overflow-hidden">
          <AssignmentProgressView />
        </div>
      </div>
    </>
  );
}