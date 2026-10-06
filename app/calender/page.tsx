"use client";

import { useMemo, useState } from "react";

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  type: "Class" | "Assignment" | "Exam" | "Holiday" | "Event";
  description?: string;
};

const sampleEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Introduction to Mechatronics",
    date: "2026-10-06",
    type: "Class",
    description: "Regular lecture",
  },
  {
    id: 2,
    title: "Sensor Fundamentals Assignment",
    date: "2026-10-10",
    type: "Assignment",
    description: "Assignment submission deadline",
  },
  {
    id: 3,
    title: "Mid Semester Examination",
    date: "2026-10-15",
    type: "Exam",
    description: "Mid semester examination",
  },
  {
    id: 4,
    title: "College Event",
    date: "2026-10-20",
    type: "Event",
    description: "Annual college technical event",
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export default function CalendarPage() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  function previousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  function goToToday() {
    setCurrentDate(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );

    setSelectedDate(
      today.toISOString().split("T")[0]
    );
  }

  function getDateString(day: number) {
    return `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  }

  function getEventsForDate(date: string) {
    return sampleEvents.filter(
      (event) => event.date === date
    );
  }

  const selectedEvents =
    getEventsForDate(selectedDate);

  return (
    <main className="min-h-screen bg-[#f5f7f6] p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600">
          STUDENTHUB
        </p>

        <h1 className="mt-1 text-3xl font-bold text-[#17221c]">
          Academic Calendar
        </h1>

        <p className="mt-2 text-gray-500">
          Keep track of classes, assignments, exams and
          important college events.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Calendar */}
        <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-3">
          {/* Calendar Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#17221c]">
                {monthNames[month]} {year}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Academic schedule
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg hover:bg-gray-50"
              >
                ←
              </button>

              <button
                onClick={goToToday}
                className="rounded-xl border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
              >
                Today
              </button>

              <button
                onClick={nextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg hover:bg-gray-50"
              >
                →
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[110px] border-b border-r border-gray-100"
                  />
                );
              }

              const dateString =
                getDateString(day);

              const events =
                getEventsForDate(dateString);

              const isToday =
                dateString ===
                today.toISOString().split("T")[0];

              const isSelected =
                dateString === selectedDate;

              return (
                <button
                  key={dateString}
                  onClick={() =>
                    setSelectedDate(dateString)
                  }
                  className={`min-h-[110px] border-b border-r border-gray-100 p-2 text-left transition hover:bg-green-50 ${
                    isSelected
                      ? "bg-green-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        isToday
                          ? "bg-green-600 text-white"
                          : isSelected
                            ? "bg-green-100 text-green-700"
                            : "text-gray-700"
                      }`}
                    >
                      {day}
                    </span>

                    {events.length > 0 && (
                      <span className="text-xs font-semibold text-green-600">
                        {events.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {events.slice(0, 2).map(
                      (event) => (
                        <div
                          key={event.id}
                          className={`truncate rounded-md px-2 py-1 text-xs font-medium ${
                            event.type === "Exam"
                              ? "bg-red-50 text-red-600"
                              : event.type ===
                                  "Assignment"
                                ? "bg-yellow-50 text-yellow-700"
                                : event.type ===
                                    "Class"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {event.title}
                        </div>
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-green-600">
            SELECTED DAY
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17221c]">
            {new Date(
              selectedDate + "T00:00:00"
            ).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="mt-6">
            {selectedEvents.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-5 text-center">
                <div className="mb-2 text-3xl">
                  📅
                </div>

                <p className="font-semibold text-[#17221c]">
                  No events
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Nothing scheduled for this day.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-gray-100 p-4"
                  >
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                      {event.type}
                    </span>

                    <h3 className="mt-3 font-bold text-[#17221c]">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-600">
          EVENT TYPES
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-green-700">
            🟢 Classes
          </span>

          <span className="text-yellow-700">
            🟡 Assignments
          </span>

          <span className="text-red-600">
            🔴 Exams
          </span>

          <span className="text-gray-600">
            ⚪ Events
          </span>
        </div>
      </div>
    </main>
  );
}