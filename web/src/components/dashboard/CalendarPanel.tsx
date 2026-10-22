import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface AgendaEvent {
  time: string;
  title: string;
  subtitle: string;
  color: string;
}

const REFERENCE_EVENTS: AgendaEvent[] = [
  {
    time: '09:30 - 10:00',
    title: 'Team Stand-up',
    subtitle: 'Development Team',
    color: '#2563EB', // Blue
  },
  {
    time: '11:00 - 12:00',
    title: 'Client Meeting',
    subtitle: 'GrowNova Solutions',
    color: '#15803D', // Green
  },
  {
    time: '02:30 - 03:30',
    title: 'Product Review',
    subtitle: 'Design Team',
    color: '#D97706', // Warm Amber / Orange
  },
  {
    time: '04:00 - 04:30',
    title: 'Follow-up with Leads',
    subtitle: 'Sales Team',
    color: '#9333EA', // Purple
  },
];

export const CalendarPanel: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2025, 4, 30)); // Default to reference May 2025
  const [selectedDay, setSelectedDay] = useState<number>(30);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Generate calendar days for month grid
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(year, currentDate.getMonth(), 1).getDay();
  // Adjust Monday-based index (0=Sun, 1=Mon... -> Mon=0)
  const mondayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Previous month fill days
  const prevMonthDays = new Date(year, currentDate.getMonth(), 0).getDate();
  const leadingDays = Array.from({ length: mondayOffset }, (_, i) => prevMonthDays - mondayOffset + i + 1);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Trailing days to fill 35 or 42 grid cells
  const totalCells = (leadingDays.length + monthDays.length) > 35 ? 42 : 35;
  const trailingDays = Array.from({ length: totalCells - (leadingDays.length + monthDays.length) }, (_, i) => i + 1);

  // Formatted header string e.g. "Today, Fri 30 May 2025"
  const formattedToday = `Today, Fri ${selectedDay} ${monthName.slice(0, 3)} ${year}`;

  return (
    <div className="w-full gn-panel p-4 sm:p-5 select-none relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#102B4E]/8">
        <div className="flex items-center gap-2 text-[#102B4E]">
          <CalendarIcon className="w-4 h-4 text-[#102B4E]" />
          <h3 className="text-sm sm:text-[15px] font-bold text-[#102B4E] tracking-tight">
            Calendar
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#65758B]">
          <span className="font-medium hidden sm:inline">{formattedToday}</span>
          <Link
            to="/dashboard/calendar"
            className="text-[11px] font-bold text-[#C69A43] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Calendar →</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Left Month View, Right Agenda View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        
        {/* Left Column: Monthly Calendar */}
        <div className="w-full flex flex-col">
          {/* Month & Year + Controls */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs sm:text-[13px] font-bold text-[#102B4E]">
              {monthName} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1 rounded-md hover:bg-black/5 text-[#102B4E]/70 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-md hover:bg-black/5 text-[#102B4E]/70 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold text-[#65758B] mb-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Leading days from previous month */}
            {leadingDays.map((d) => (
              <div key={`prev-${d}`} className="h-6 flex items-center justify-center text-[11px] text-[#65758B]/40">
                {d}
              </div>
            ))}

            {/* Current month days */}
            {monthDays.map((d) => {
              const isSelected = d === selectedDay;
              return (
                <button
                  key={`day-${d}`}
                  onClick={() => setSelectedDay(d)}
                  className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center text-[11.5px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B2340] text-white font-bold shadow-xs'
                      : 'text-[#102B4E] hover:bg-[#102B4E]/8'
                  }`}
                >
                  {d}
                </button>
              );
            })}

            {/* Trailing days from next month */}
            {trailingDays.map((d) => (
              <div key={`next-${d}`} className="h-6 flex items-center justify-center text-[11px] text-[#65758B]/40">
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chronological Agenda */}
        <div className="w-full flex flex-col space-y-2.5 pt-1 md:pl-2 md:border-l border-[#102B4E]/8">
          {REFERENCE_EVENTS.map((event, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs group">
              {/* Colored time pill indicator */}
              <div className="flex items-center gap-1.5 min-w-[95px]">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-[11px] font-medium text-[#65758B] tabular-nums">
                  {event.time}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="font-semibold text-[#102B4E] truncate">
                  {event.title}
                </span>
                <span className="text-[11px] text-[#65758B] truncate hidden sm:inline">
                  {event.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
