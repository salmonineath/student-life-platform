// "use client";

// import { SquarePen } from "lucide-react";

// export default function ProfilePage() {
//   return (
//     <>
//       {/* PAGE TITLE */}
//       <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

//       {/* PROFILE CARD */}
//       <div className="bg-white rounded-xl p-6 shadow-sm mb-6 flex items-center gap-4">
//         <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg">
//           N
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold text-slate-800">
//             Natashia Khaleira
//           </h2>
//           <p className="text-sm text-slate-500">username</p>
//         </div>
//       </div>

//       {/* PERSONAL INFO */}
//       <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="font-semibold text-slate-700">Personal Information</h2>

//           <button className="flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md">
//             <SquarePen className="w-4 h-4" />
//             Edit
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//           <div>
//             <p className="text-slate-400">Fullname</p>
//             <p className="font-medium">fullname</p>
//           </div>

//           <div>
//             <p className="text-slate-400">Username</p>
//             <p className="font-medium">username</p>
//           </div>

//           <div>
//             <p className="text-slate-400">Phone Number</p>
//             <p className="font-medium">(+62) 821 2554-5846</p>
//           </div>

//           <div>
//             <p className="text-slate-400">University</p>
//             <p className="font-medium">university</p>
//           </div>

//           <div>
//             <p className="text-slate-400">Major</p>
//             <p className="font-medium">major</p>
//           </div>

//           <div>
//             <p className="text-slate-400">Academic Year</p>
//             <p className="font-medium">academic year</p>
//           </div>
//         </div>
//       </div>

//       {/* ADDRESS */}
//       {/* <div className="bg-white rounded-xl p-6 shadow-sm">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="font-semibold text-slate-700">Address</h2>

//           <button className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-md hover:bg-slate-50">
//             <SquarePen className="w-4 h-4" />
//             Edit
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//           <div>
//             <p className="text-slate-400">Country</p>
//             <p className="font-medium">United Kingdom</p>
//           </div>

//           <div>
//             <p className="text-slate-400">City</p>
//             <p className="font-medium">Leeds, East London</p>
//           </div>

//           <div>
//             <p className="text-slate-400">Postal Code</p>
//             <p className="font-medium">ERT 1254</p>
//           </div>
//         </div>
//       </div> */}

//       {/* STUDY STATS */}
//       {/* <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
//         <h2 className="font-semibold text-slate-700 mb-4">Study Stats</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 rounded-lg bg-sky-50">
//             <p className="text-sm text-slate-500">Total Study Time</p>
//             <p className="text-xl font-bold text-sky-600 mt-1">120 hrs</p>
//           </div>

//           <div className="p-4 rounded-lg bg-emerald-50">
//             <p className="text-sm text-slate-500">Current Streak</p>
//             <p className="text-xl font-bold text-emerald-600 mt-1">7 days</p>
//           </div>

//           <div className="p-4 rounded-lg bg-purple-50">
//             <p className="text-sm text-slate-500">Sessions This Week</p>
//             <p className="text-xl font-bold text-purple-600 mt-1">5 sessions</p>
//           </div>
//         </div>
//       </div> */}

//       {/* GOALS */}
//       {/* <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
//         <h2 className="font-semibold text-slate-700 mb-4">Goals</h2>

//         <div className="space-y-4"> */}
//       {/* Goal 1 */}
//       {/* <div>
//             <div className="flex justify-between text-sm mb-1">
//               <p className="font-medium">Finish React Course</p>
//               <p className="text-slate-400">Due: Apr 10</p>
//             </div>
//             <div className="w-full bg-slate-200 h-2 rounded-full">
//               <div className="bg-sky-500 h-2 rounded-full w-[70%]" />
//             </div>
//           </div> */}

//       {/* Goal 2 */}
//       {/* <div>
//             <div className="flex justify-between text-sm mb-1">
//               <p className="font-medium">Complete 10 DSA Problems</p>
//               <p className="text-slate-400">Due: Apr 5</p>
//             </div>
//             <div className="w-full bg-slate-200 h-2 rounded-full">
//               <div className="bg-emerald-500 h-2 rounded-full w-[40%]" />
//             </div>
//           </div> */}

//       {/* Goal 3 */}
//       {/* <div>
//             <div className="flex justify-between text-sm mb-1">
//               <p className="font-medium">Study Database Design</p>
//               <p className="text-slate-400">Due: Apr 15</p>
//             </div>
//             <div className="w-full bg-slate-200 h-2 rounded-full">
//               <div className="bg-purple-500 h-2 rounded-full w-[55%]" />
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* SUBJECTS */}
//       {/* <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
//         <h2 className="font-semibold text-slate-700 mb-4">Subjects</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 border rounded-lg">
//             <div className="flex justify-between items-center mb-2">
//               <p className="font-medium">React</p>
//               <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded">
//                 Frontend
//               </span>
//             </div>
//             <p className="text-sm text-slate-500">Intermediate</p>
//           </div>

//           <div className="p-4 border rounded-lg">
//             <div className="flex justify-between items-center mb-2">
//               <p className="font-medium">Data Structures</p>
//               <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">
//                 Core
//               </span>
//             </div>
//             <p className="text-sm text-slate-500">Beginner</p>
//           </div>

//           <div className="p-4 border rounded-lg">
//             <div className="flex justify-between items-center mb-2">
//               <p className="font-medium">Database Systems</p>
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
//                 Backend
//               </span>
//             </div>
//             <p className="text-sm text-slate-500">Advanced</p>
//           </div>
//         </div>
//       </div> */}

//       {/* ACHIEVEMENTS */}
//       {/* <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
//         <h2 className="font-semibold text-slate-700 mb-4">Achievements</h2>

//         <div className="flex gap-6 flex-wrap"> */}
//       {/* Unlocked */}
//       <div className="flex flex-col items-center">
//             <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
//               ⭐
//             </div>
//             <p className="text-xs mt-2">7-Day Streak</p>
//           </div>

//           <div className="flex flex-col items-center">
//             <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
//               🧠
//             </div>
//             <p className="text-xs mt-2">First Quiz</p>
//           </div>

//       {/* Locked */}
//       <div className="flex flex-col items-center opacity-40">
//             <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center">
//               🔒
//             </div>
//             <p className="text-xs mt-2">Night Owl</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
