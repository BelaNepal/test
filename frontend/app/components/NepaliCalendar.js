"use client";

import React, { useState, useEffect } from "react";

// Nepali months
const nepaliMonths = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फाल्गुन",
  "चैत्र",
];

// Weekday names (full + short)
const weekDaysFull = [
  "आइतबार",
  "सोमबार",
  "मङ्गलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
];
const weekDaysShort = ["आ", "सो", "मं", "बु", "बि", "शु", "श"];

// Nepali month days data
const nepaliMonthDays = {
  1: 31,
  2: 31,
  3: 32,
  4: 31,
  5: 31,
  6: 30,
  7: 30,
  8: 29,
  9: 30,
  10: 29,
  11: 30,
  12: 30,
};

// Convert Nepali date to approximate Gregorian date
function nepaliToGregorianApproximate(year, month, day) {
  const refNepYear = 2082;
  const refNepMonth = 4;
  const refNepDay = 25;

  const refGregDate = new Date(Date.UTC(2025, 7, 10));

  let dayDiff =
    (year - refNepYear) * 365 +
    (month - refNepMonth) * 30 +
    (day - refNepDay);

  const gregDate = new Date(refGregDate);
  gregDate.setUTCDate(refGregDate.getUTCDate() + dayDiff);
  return gregDate;
}

// Convert English numbers to Nepali numerals
function toNepaliNumber(num) {
  const engToNep = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };
  return num
    .toString()
    .split("")
    .map((digit) => engToNep[digit] || digit)
    .join("");
}

export default function NepaliCalendar() {
  const [todayNep, setTodayNep] = useState(null);
  const [bsYear, setBsYear] = useState(null);
  const [bsMonth, setBsMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const now = new Date();

    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const nepalOffset = 5 * 60 + 45;
    const nepalTime = new Date(utc + nepalOffset * 60000);

    const refNepYear = 2082;
    const refNepMonth = 4;
    const refNepDay = 25;

    const refGregDate = new Date(Date.UTC(2025, 7, 10));

    const diffDays = Math.floor(
      (nepalTime - refGregDate) / (1000 * 60 * 60 * 24)
    );

    let nepDay = refNepDay + diffDays;
    let nepMonth = refNepMonth;
    let nepYear = refNepYear;

    while (nepDay > nepaliMonthDays[nepMonth]) {
      nepDay -= nepaliMonthDays[nepMonth];
      nepMonth++;
      if (nepMonth > 12) {
        nepMonth = 1;
        nepYear++;
      }
    }
    while (nepDay < 1) {
      nepMonth--;
      if (nepMonth < 1) {
        nepMonth = 12;
        nepYear--;
      }
      nepDay += nepaliMonthDays[nepMonth];
    }

    setTodayNep({ year: nepYear, month: nepMonth, day: nepDay });
    setBsYear(nepYear);
    setBsMonth(nepMonth);
    setSelectedDate({ year: nepYear, month: nepMonth, day: nepDay });
  }, []);

  if (!bsYear || !bsMonth || !todayNep) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading Nepali Calendar...
      </div>
    );
  }

  const totalDays = nepaliMonthDays[bsMonth] || 30;

  const firstDayDate = nepaliToGregorianApproximate(bsYear, bsMonth, 1);
  const firstWeekDay = firstDayDate.getUTCDay();

  const isTodayMonthYear = bsYear === todayNep.year && bsMonth === todayNep.month;

  // Calculate English months for current Nepali month
  const gregMonthStart = nepaliToGregorianApproximate(bsYear, bsMonth, 1);
  const gregMonthEnd = nepaliToGregorianApproximate(bsYear, bsMonth, totalDays);

  // English month names array for display
  const engMonths = [
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

  // Get English month names (possibly two months)
  const startEngMonth = engMonths[gregMonthStart.getUTCMonth()];
  const endEngMonth = engMonths[gregMonthEnd.getUTCMonth()];

  // Handler for selecting a date
  function handleDateSelect(dayNum) {
    setSelectedDate({ year: bsYear, month: bsMonth, day: dayNum });
  }

  return (
    <section
      aria-label="Nepali Calendar"
      className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 font-sans select-none sm:max-w-xl md:max-w-3xl"
    >
      {/* Title Bar */}
      <header className="flex items-center justify-between mb-8 bg-gradient-to-r from-[#ef7e1a] via-[#e18a1b] to-[#ef7e1a] rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              let newMonth = bsMonth - 1;
              let newYear = bsYear;
              if (newMonth < 1) {
                newMonth = 12;
                newYear--;
              }
              setBsMonth(newMonth);
              setBsYear(newYear);
              setSelectedDate(null);
            }}
            aria-label="Previous Month"
            className="text-white text-3xl font-bold rounded-full hover:bg-[#1e2d4d] w-10 h-10 flex items-center justify-center transition"
          >
            ‹
          </button>

          {!isTodayMonthYear && (
            <button
              onClick={() => {
                setBsYear(todayNep.year);
                setBsMonth(todayNep.month);
                setSelectedDate({
                  year: todayNep.year,
                  month: todayNep.month,
                  day: todayNep.day,
                });
              }}
              aria-label="Go to Today"
              className="bg-white text-[#ef7e1a] font-semibold rounded-lg px-3 py-1 hover:bg-[#ef7e1a] hover:text-white transition"
            >
              आज (Today)
            </button>
          )}

          <button
            onClick={() => {
              let newMonth = bsMonth + 1;
              let newYear = bsYear;
              if (newMonth > 12) {
                newMonth = 1;
                newYear++;
              }
              setBsMonth(newMonth);
              setBsYear(newYear);
              setSelectedDate(null);
            }}
            aria-label="Next Month"
            className="text-white text-3xl font-bold rounded-full hover:bg-[#1e2d4d] w-10 h-10 flex items-center justify-center transition"
          >
            ›
          </button>
        </div>

        <div className="flex flex-col items-center flex-1 text-center select-none">
          <h2
            aria-live="polite"
            className="text-3xl font-extrabold text-white"
          >
            {nepaliMonths[bsMonth - 1]} {toNepaliNumber(bsYear)}
          </h2>
          <p className="text-xs text-[#d6d6d6] mt-0.5 font-semibold">
            {startEngMonth}
            {startEngMonth !== endEngMonth ? " / " + endEngMonth : ""}
          </p>
        </div>

        <div style={{ width: 80 }} />
      </header>

      {/* Weekday titles */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
        {weekDaysFull.map((day, i) => {
          // Get English weekday name for the first week day row starting date
          // We'll get English weekday by converting Nepali date of that weekday

          // Approximate English weekday names
          const engWeekDays = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ];

          return (
            <div
              key={day}
              className={`flex flex-col items-center justify-center font-semibold w-full aspect-square text-xs sm:text-sm md:text-base rounded-lg select-none ${
                i === 6
                  ? "text-[#ef7e1a] bg-[#fef5e8]"
                  : "text-[#1e2d4d] bg-[#f0f4fa]"
              }`}
            >
              <span className="block sm:hidden">{weekDaysShort[i]}</span>
              <span className="hidden sm:block">{day}</span>
              <span className="text-[10px] font-semibold text-gray-400 mt-1">
                {engWeekDays[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dates grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: firstWeekDay }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="aspect-square flex items-center justify-center rounded-lg border border-transparent"
          />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const dateNum = i + 1;
          const isToday =
            dateNum === todayNep.day &&
            bsMonth === todayNep.month &&
            bsYear === todayNep.year;
          const isSelected =
            selectedDate &&
            selectedDate.day === dateNum &&
            selectedDate.month === bsMonth &&
            selectedDate.year === bsYear;
          const isSaturday = (firstWeekDay + i) % 7 === 6;

          // Calculate corresponding Gregorian date for this Nepali date
          const gregDate = nepaliToGregorianApproximate(bsYear, bsMonth, dateNum);
          const engDateNum = gregDate.getUTCDate();

          return (
            <div
              key={dateNum}
              onClick={() => handleDateSelect(dateNum)}
              className={`aspect-square flex flex-col items-center justify-center text-sm sm:text-base font-semibold rounded-lg
                transition-transform duration-200 ease-in-out transform cursor-pointer shadow-sm
                ${
                  isToday
                    ? "bg-[#1e2d4d] text-white shadow-lg ring-2 ring-[#1e2d4d] ring-offset-2"
                    : isSelected
                    ? "bg-[#3b82f6] text-white shadow-md ring-1 ring-[#3b82f6] ring-offset-1"
                    : isSaturday
                    ? "text-[#ef7e1a] bg-gradient-to-br from-[#fff4eb] to-[#ffe7d2]"
                    : "text-[#1e2d4d] bg-gradient-to-br from-white to-[#f9fafb]"
                }
                hover:scale-105 hover:shadow-md
              `}
            >
              <span>{toNepaliNumber(dateNum)}</span>
              <span className="text-[10px] font-normal text-gray-500 mt-0.5 select-none">
                {engDateNum}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
