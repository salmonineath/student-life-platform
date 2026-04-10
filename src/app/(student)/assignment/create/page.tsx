// "use client";

// import React, { useEffect } from "react";
// import Link from "next/link";
// import { ArrowLeft, Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createAssignment,
//   resetCreateStatus,
// } from "@/features/assignment/assignmentSlice";
// import {
//   createAssignmentSchema,
//   CreateAssignmentFormData,
// } from "@/features/assignment/assignmentSchema";
// import { RootState, AppDispatch } from "@/redux/store";
// import { useRouter } from "next/navigation";

// export default function CreateAssignmentPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   const { creating, createSuccess, error } = useSelector(
//     (state: RootState) => state.assignment
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setError,
//   } = useForm<CreateAssignmentFormData>({
//     resolver: zodResolver(createAssignmentSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       subject: "",
//       dueDate: "",
//     },
//   });

//   // Redirect after success
//   useEffect(() => {
//     if (createSuccess) {
//       reset();
//       const timer = setTimeout(() => {
//         dispatch(resetCreateStatus());
//         router.push("/assignment");
//       }, 1200);
//       return () => clearTimeout(timer);
//     }
//   }, [createSuccess, dispatch, reset, router]);

//   // Show backend error
//   useEffect(() => {
//     if (error) setError("root", { message: error });
//   }, [error, setError]);

//   const onSubmit = async (data: CreateAssignmentFormData) => {
//     dispatch(resetCreateStatus());
//     await dispatch(
//       createAssignment({
//         title: data.title,
//         description: data.description,
//         subject: data.subject,
//         due_date: data.dueDate,
//       })
//     );
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <div className="flex items-center gap-4 mb-8">
//         <Link
//           href="/assignment"
//           className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium transition-colors"
//         >
//           <ArrowLeft size={20} /> Back
//         </Link>
//         <h1 className="text-3xl font-bold text-slate-900">
//           Create New Assignment
//         </h1>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border p-8">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Assignment Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               {...register("title")}
//               type="text"
//               disabled={creating}
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               placeholder="e.g. Midterm Exam - Calculus"
//             />
//             {errors.title && (
//               <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               {...register("description")}
//               rows={5}
//               disabled={creating}
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:bg-gray-100"
//               placeholder="Write the details and instructions..."
//             />
//             {errors.description && (
//               <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
//             )}
//           </div>

//           {/* Subject */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Subject / Course <span className="text-red-500">*</span>
//             </label>
//             <input
//               {...register("subject")}
//               type="text"
//               disabled={creating}
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               placeholder="e.g. Mathematics, Physics"
//             />
//             {errors.subject && (
//               <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
//             )}
//           </div>

//           {/* Due Date */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Due Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               {...register("dueDate")}
//               type="date"
//               disabled={creating}
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//             />
//             {errors.dueDate && (
//               <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
//             )}
//           </div>

//           {/* Root error */}
//           {errors.root && (
//             <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
//               {errors.root.message}
//             </div>
//           )}

//           {/* Success */}
//           {createSuccess && (
//             <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
//               ✅ Assignment created successfully! Redirecting...
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={creating}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-3 text-lg"
//           >
//             {creating ? (
//               <>
//                 <Loader2 className="animate-spin" size={24} />
//                 Saving...
//               </>
//             ) : (
//               "Save Assignment"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

export default function CreateAssignment() {
  return (
    <>
    <h1>This is create assignment model</h1></>
  )
}