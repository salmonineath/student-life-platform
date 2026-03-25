import React from 'react';

const Timetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];

  // Mock data for classes
  const classes = [
    { day: 'Monday', time: '08:00 AM', subject: 'Web Development', room: 'Room 302', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { day: 'Wednesday', time: '10:00 AM', subject: 'Java Spring Boot', room: 'Lab 05', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { day: 'Thursday', time: '08:00 AM', subject: 'Database System', room: 'Room 101', color: 'bg-green-100 text-green-700 border-green-200' },
    { day: 'Friday', time: '01:00 PM', subject: 'English for IT', room: 'Online', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">Time</th>
              {days.map(day => (
                <th key={day} className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time} className="border-b border-gray-50 last:border-0">
                <td className="p-4 text-sm font-medium text-gray-400">{time}</td>
                {days.map((day) => {
                  const course = classes.find(c => c.day === day && c.time === time);
                  return (
                    <td key={day} className="p-2 h-24 min-w-[150px]">
                      {course ? (
                        <div className={`h-full p-3 rounded-xl border-l-4 shadow-sm ${course.color} transition-transform hover:scale-[1.02] cursor-pointer`}>
                          <p className="text-xs font-bold uppercase truncate">{course.subject}</p>
                          <p className="text-[10px] opacity-80 mt-1 font-medium">{course.room}</p>
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-50/30 rounded-xl border border-dashed border-gray-100"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;