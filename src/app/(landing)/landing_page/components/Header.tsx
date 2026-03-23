import react from "react";
import { GraduationCap } from "lucide-react";

const Header = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-orange-600 p-1.5 rounded-lg">
                        <GraduationCap className="text-white w-6 h-6"  />
                    </div>
                    <span className="text-xl font-bold text-slate-900">Student Life</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#" className="hover:text-orange-600
                     transition-colors">Home</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">Schedules</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">Assignments</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">AI Tools</a> 
                </div>

                {/* Call to Action Button */}
                <div className="flex items-center gap-4">
                    <button className="text-sm font-semibold text-slate-700">Login</button>
                    <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">join Now</button>
                </div>
            </div>
        </nav>
    );
};

export default Header;