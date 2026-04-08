// "use client";

// import { useEffect } from "react";
// import { fetchMe } from "@/features/auth/authSlice";
// import { toast } from "sonner";

// export default function ClientAuthWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useAppDispatch();
//   const { loading } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(fetchMe())
//       .unwrap()
//       .catch((err) => {
//         // 👇 only show toast if it's a real error (optional logic)
//         if (err !== "Unauthorized") {
//           toast.error(err || "Something went wrong");
//         }
//       });
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
//           <p className="mt-4 text-slate-400 text-sm">Loading....</p>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
