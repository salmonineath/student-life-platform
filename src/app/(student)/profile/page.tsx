
export default function ProfilePage() {
  // Static user data for now
  const user = {
    fullname: "Sal Monineath",
    email: "sal.monineath@student.edu.kh",
    phone: "+85512345678",
    university: "Royal University of Phnom Penh",
    major: "Computer Science",
    academicYear: "3",
    profileImage: "https://i.pravatar.cc/150?img=12", // placeholder image
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-10 text-center bg-[#0F172A] text-white">
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-600"
          />
          <h1 className="text-2xl font-bold">{user.fullname}</h1>
          <p className="text-slate-300 mt-1 text-sm">{user.university}</p>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-500">Email</h2>
            <p className="text-slate-900">{user.email}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500">Phone</h2>
            <p className="text-slate-900">{user.phone}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500">Major</h2>
            <p className="text-slate-900">{user.major}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500">Academic Year</h2>
            <p className="text-slate-900">{user.academicYear}</p>
          </div>

          {/* Edit Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}