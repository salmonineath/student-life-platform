// "use client";

// import { useEffect, useState } from "react";
// import { X, Star } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import {
//   createOneTimeSchedule,
//   createRecurringSchedule,
//   updateSchedule,
// } from "@/features/schedule/scheduleSlice";
// import {
//   ScheduleItem,
//   ScheduleType,
//   OneTimeScheduleRequest,
//   RecurringScheduleRequest,
//   ScheduleUpdateRequest,
// } from "@/types/scheduleTypes";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const DAY_OPTIONS = [
//   { label: "Sunday", value: 0 },
//   { label: "Monday", value: 1 },
//   { label: "Tuesday", value: 2 },
//   { label: "Wednesday", value: 3 },
//   { label: "Thursday", value: 4 },
//   { label: "Friday", value: 5 },
//   { label: "Saturday", value: 6 },
// ];

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** "2026-04-10T09:00:00" → "2026-04-10" and "09:00" */
// function splitIsoDatetime(iso: string | null): { date: string; time: string } {
//   if (!iso) return { date: "", time: "" };
//   const [date, timeFull] = iso.split("T");
//   return { date, time: timeFull.slice(0, 5) }; // "HH:mm"
// }

// /** "HH:mm:ss" → "HH:mm" */
// function toHHmm(t: string | null): string {
//   if (!t) return "";
//   return t.slice(0, 5);
// }

// /** "YYYY-MM-DD" + "HH:mm" → "YYYY-MM-DDTHH:mm:ss" */
// function toIsoDatetime(date: string, time: string): string {
//   return `${date}T${time}:00`;
// }

// /** "HH:mm" → "HH:mm:ss" */
// function toHHmmss(t: string): string {
//   return `${t}:00`;
// }

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Props {
//   item?: ScheduleItem | null; // null = create mode
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface OneTimeForm {
//   title: string;
//   description: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   location: string;
//   isImportant: boolean;
// }

// interface RecurringForm {
//   title: string;
//   description: string;
//   dayOfWeek: number;
//   recurringStartTime: string;
//   recurringEndTime: string;
//   location: string;
//   isImportant: boolean;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function ScheduleModal({ item, onClose, onSuccess }: Props) {
//   const dispatch = useDispatch<AppDispatch>();
//   const isEditing = !!item;

//   const [activeTab, setActiveTab] = useState<ScheduleType>(
//     item?.type ?? "ONE_TIME",
//   );
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // ── One-time form state ────────────────────────────────────────────────────
//   const [oneTime, setOneTime] = useState<OneTimeForm>(() => {
//     const { date: startDate, time: startTime } = splitIsoDatetime(
//       item?.startTime ?? null,
//     );
//     const { time: endTime } = splitIsoDatetime(item?.endTime ?? null);
//     return {
//       title: item?.title ?? "",
//       description: item?.description ?? "",
//       date: startDate,
//       startTime,
//       endTime,
//       location: item?.location ?? "",
//       isImportant: item?.isImportant ?? false,
//     };
//   });

//   // ── Recurring form state ───────────────────────────────────────────────────
//   const [recurring, setRecurring] = useState<RecurringForm>(() => ({
//     title: item?.title ?? "",
//     description: item?.description ?? "",
//     dayOfWeek: item?.dayOfWeek ?? 1,
//     recurringStartTime: toHHmm(item?.recurringStartTime ?? null),
//     recurringEndTime: toHHmm(item?.recurringEndTime ?? null),
//     location: item?.location ?? "",
//     isImportant: item?.isImportant ?? false,
//   }));

//   // Lock tab when editing
//   useEffect(() => {
//     if (item) setActiveTab(item.type);
//   }, [item]);

//   // ── Shared input helpers ───────────────────────────────────────────────────
//   function setOT<K extends keyof OneTimeForm>(key: K, value: OneTimeForm[K]) {
//     setOneTime((prev) => ({ ...prev, [key]: value }));
//   }

//   function setRec<K extends keyof RecurringForm>(
//     key: K,
//     value: RecurringForm[K],
//   ) {
//     setRecurring((prev) => ({ ...prev, [key]: value }));
//   }

//   // ── Submit ─────────────────────────────────────────────────────────────────
//   async function handleSubmit() {
//     setError(null);
//     setSubmitting(true);

//     try {
//       if (isEditing && item) {
//         // Build update payload — only include what changed
//         const payload: ScheduleUpdateRequest =
//           item.type === "ONE_TIME"
//             ? {
//                 title: oneTime.title,
//                 description: oneTime.description || undefined,
//                 startTime: toIsoDatetime(oneTime.date, oneTime.startTime),
//                 endTime: toIsoDatetime(oneTime.date, oneTime.endTime),
//                 location: oneTime.location || undefined,
//                 isImportant: oneTime.isImportant,
//               }
//             : {
//                 title: recurring.title,
//                 description: recurring.description || undefined,
//                 dayOfWeek: recurring.dayOfWeek,
//                 recurringStartTime: toHHmmss(recurring.recurringStartTime),
//                 recurringEndTime: toHHmmss(recurring.recurringEndTime),
//                 location: recurring.location || undefined,
//                 isImportant: recurring.isImportant,
//               };

//         await dispatch(updateSchedule({ id: item.id, payload })).unwrap();
//       } else {
//         // Create
//         if (activeTab === "ONE_TIME") {
//           const payload: OneTimeScheduleRequest = {
//             title: oneTime.title,
//             description: oneTime.description || undefined,
//             startTime: toIsoDatetime(oneTime.date, oneTime.startTime),
//             endTime: toIsoDatetime(oneTime.date, oneTime.endTime),
//             location: oneTime.location || undefined,
//             isImportant: oneTime.isImportant,
//           };
//           await dispatch(createOneTimeSchedule(payload)).unwrap();
//         } else {
//           const payload: RecurringScheduleRequest = {
//             title: recurring.title,
//             description: recurring.description || undefined,
//             dayOfWeek: recurring.dayOfWeek,
//             recurringStartTime: toHHmmss(recurring.recurringStartTime),
//             recurringEndTime: toHHmmss(recurring.recurringEndTime),
//             location: recurring.location || undefined,
//             isImportant: recurring.isImportant,
//           };
//           await dispatch(createRecurringSchedule(payload)).unwrap();
//         }
//       }

//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(typeof err === "string" ? err : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ─── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
//           <h2 className="text-lg font-semibold text-slate-900">
//             {isEditing ? "Edit Schedule" : "Add Schedule"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-slate-400 hover:text-slate-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Tab switcher — hidden when editing (type is locked) */}
//         {!isEditing && (
//           <div className="px-6 pt-4">
//             <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
//               {(["ONE_TIME", "RECURRING"] as ScheduleType[]).map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
//                     activeTab === tab
//                       ? "bg-white text-slate-900 shadow-sm"
//                       : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   {tab === "ONE_TIME" ? "Single Event" : "Repeats Weekly"}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Body */}
//         <div className="overflow-y-auto px-6 py-4 flex-1 space-y-4">
//           {/* Error */}
//           {error && (
//             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
//               {error}
//             </p>
//           )}

//           {/* ── ONE_TIME fields ────────────────────────────────────────────── */}
//           {activeTab === "ONE_TIME" && (
//             <>
//               <Field label="Title" required>
//                 <Input
//                   value={oneTime.title}
//                   onChange={(v) => setOT("title", v)}
//                   placeholder="e.g. Midterm Exam"
//                 />
//               </Field>

//               <Field label="Description">
//                 <Textarea
//                   value={oneTime.description}
//                   onChange={(v) => setOT("description", v)}
//                   placeholder="Optional notes…"
//                 />
//               </Field>

//               <Field label="Date" required>
//                 <Input
//                   type="date"
//                   value={oneTime.date}
//                   onChange={(v) => setOT("date", v)}
//                 />
//               </Field>

//               <div className="grid grid-cols-2 gap-3">
//                 <Field label="Start Time" required>
//                   <Input
//                     type="time"
//                     value={oneTime.startTime}
//                     onChange={(v) => setOT("startTime", v)}
//                   />
//                 </Field>
//                 <Field label="End Time" required>
//                   <Input
//                     type="time"
//                     value={oneTime.endTime}
//                     onChange={(v) => setOT("endTime", v)}
//                   />
//                 </Field>
//               </div>

//               <Field label="Location">
//                 <Input
//                   value={oneTime.location}
//                   onChange={(v) => setOT("location", v)}
//                   placeholder="e.g. Hall A"
//                 />
//               </Field>

//               <ImportantToggle
//                 value={oneTime.isImportant}
//                 onChange={(v) => setOT("isImportant", v)}
//               />
//             </>
//           )}

//           {/* ── RECURRING fields ───────────────────────────────────────────── */}
//           {activeTab === "RECURRING" && (
//             <>
//               <Field label="Title" required>
//                 <Input
//                   value={recurring.title}
//                   onChange={(v) => setRec("title", v)}
//                   placeholder="e.g. Math 101"
//                 />
//               </Field>

//               <Field label="Description">
//                 <Textarea
//                   value={recurring.description}
//                   onChange={(v) => setRec("description", v)}
//                   placeholder="Optional notes…"
//                 />
//               </Field>

//               <Field label="Day of Week" required>
//                 <select
//                   value={recurring.dayOfWeek}
//                   onChange={(e) => setRec("dayOfWeek", Number(e.target.value))}
//                   className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
//                 >
//                   {DAY_OPTIONS.map((d) => (
//                     <option key={d.value} value={d.value}>
//                       {d.label}
//                     </option>
//                   ))}
//                 </select>
//               </Field>

//               <div className="grid grid-cols-2 gap-3">
//                 <Field label="Start Time" required>
//                   <Input
//                     type="time"
//                     value={recurring.recurringStartTime}
//                     onChange={(v) => setRec("recurringStartTime", v)}
//                   />
//                 </Field>
//                 <Field label="End Time" required>
//                   <Input
//                     type="time"
//                     value={recurring.recurringEndTime}
//                     onChange={(v) => setRec("recurringEndTime", v)}
//                   />
//                 </Field>
//               </div>

//               <Field label="Location">
//                 <Input
//                   value={recurring.location}
//                   onChange={(v) => setRec("location", v)}
//                   placeholder="e.g. Room A1"
//                 />
//               </Field>

//               <ImportantToggle
//                 value={recurring.isImportant}
//                 onChange={(v) => setRec("isImportant", v)}
//               />
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex gap-3">
//           <button
//             onClick={onClose}
//             disabled={submitting}
//             className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
//           >
//             {submitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 {isEditing ? "Saving…" : "Creating…"}
//               </>
//             ) : isEditing ? (
//               "Save Changes"
//             ) : (
//               "Create"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function Field({
//   label,
//   required,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-sm font-medium text-slate-700">
//         {label}
//         {required && <span className="text-red-500 ml-0.5">*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// function Input({
//   type = "text",
//   value,
//   onChange,
//   placeholder,
// }: {
//   type?: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
//     />
//   );
// }

// function Textarea({
//   value,
//   onChange,
//   placeholder,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       rows={3}
//       className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
//     />
//   );
// }

// function ImportantToggle({
//   value,
//   onChange,
// }: {
//   value: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(!value)}
//       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
//         value
//           ? "border-amber-300 bg-amber-50 text-amber-700"
//           : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
//       }`}
//     >
//       <Star
//         className={`w-4 h-4 ${value ? "fill-amber-400 text-amber-400" : "text-slate-400"}`}
//       />
//       Mark as Important
//     </button>
//   );
// }
