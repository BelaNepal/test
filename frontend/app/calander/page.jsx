'use client';

import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ADToBS } from 'bikram-sambat-js';
import 'react-day-picker/style.css';

const ComboCalender = () => {
  const BS_MONTH_NAMES = [
    'वैशाख',
    'जेष्ठ',
    'असार',
    'श्रावण',
    'भाद्र',
    'आश्विन',
    'कार्तिक',
    'मंसिर',
    'पौष',
    'माघ',
    'फाल्गुन',
    'चैत',
  ];
  const NEPALI_WEEKDAYS = [
    'आइतबार',
    'सोमबार',
    'मंगलबार',
    'बुधबार',
    'बिहिवार',
    'शुक्रबार',
    'शनिबार',
  ];
  const [selected, setSelected] = useState(new Date());
  const [lang, setLang] = useState('en');
  const [displayedMonth, setDisplayedMonth] = useState(new Date());

  function CustomDayButton(props) {
    const nepaliDate = ADToBS(props.day.date);

    const primary = lang === 'np' ? nepaliDate.substring(8) : props.children;
    const secondary = lang === 'np' ? props.children : nepaliDate.substring(8);

    return (
      <div
        onClick={() => setSelected(props.day.date)}
        className="flex flex-col h-full w-full justify-end"
      >
        <span className={`flex h-1/2 justify-center items-end`}>{primary}</span>
        <span className="relative justify-end mb-1 mr-2 flex text-gray-400">
          {secondary}
        </span>
      </div>
    );
  }

  function CustomYearsDropdown(props) {
    const { options = [], value, onChange, className } = props;

    const nepaliForDate = (date) => {
      try {
        return ADToBS(date);
      } catch (e) {
        return '';
      }
    };

    const preferredBsYear = (() => {
      try {
        const baseDate = selected || displayedMonth || new Date();
        const bs = ADToBS(baseDate);
        return bs ? bs.slice(0, 4) : '';
      } catch (e) {
        return '';
      }
    })();

    return (
      <select
        aria-label={props['aria-label'] || 'Choose the Year'}
        className={className || 'rounded-md border px-2 py-1'}
        value={value !== undefined && value !== null ? String(value) : ''}
        onChange={(e) => {
          if (onChange) return onChange(e);
        }}
      >
        {options.map((opt) => {
          let yearNum;
          if (opt.date && opt.date instanceof Date) {
            yearNum = opt.date.getFullYear();
          } else if (opt.value && !Number.isNaN(Number(opt.value))) {
            yearNum = Number(opt.value);
          } else if (opt.label) {
            const m = String(opt.label).match(/(20\d{2}|19\d{2})/);
            yearNum = m ? Number(m[0]) : undefined;
          }

          const english = yearNum ?? opt.label ?? opt.value;

          let nepali = '';
          try {
            if (typeof yearNum === 'number') {
              const janBs = ADToBS(new Date(yearNum, 0, 1)).slice(0, 4);
              const decBs = ADToBS(new Date(yearNum, 11, 31)).slice(0, 4);
              if (janBs === decBs) {
                nepali = janBs;
              } else {
                if (preferredBsYear && preferredBsYear === janBs)
                  nepali = janBs;
                else if (preferredBsYear && preferredBsYear === decBs)
                  nepali = decBs;
                else nepali = janBs;
              }
            } else if (opt.date && opt.date instanceof Date) {
              nepali = ADToBS(opt.date).slice(0, 4);
            }
          } catch (e) {
            nepali = '';
          }

          return (
            <option key={String(opt.value)} value={String(opt.value)}>
              {lang === 'en' ? english : nepali}
            </option>
          );
        })}
      </select>
    );
  }

  function CustomMonthsDropdown(props) {
    const { options = [], value, onChange, className } = props;

    const nepaliForDate = (date) => {
      try {
        return ADToBS(date);
      } catch (e) {
        return '';
      }
    };

    // preferred BS month number (1..12) derived from selected or displayedMonth
    const preferredBsMonthNum = (() => {
      try {
        const baseDate = selected || displayedMonth || new Date();
        const bs = ADToBS(baseDate);
        if (bs && bs.length >= 7) return Number(bs.slice(5, 7));
        return undefined;
      } catch (e) {
        return undefined;
      }
    })();

    return (
      <select
        aria-label={props['aria-label'] || 'Choose the Month'}
        className={className || 'rounded-md border px-2 py-1'}
        value={value !== undefined && value !== null ? String(value) : ''}
        onChange={(e) => {
          if (onChange) return onChange(e);
        }}
      >
        {options.map((opt) => {
          let monthLabel = '';
          let monthValue =
            opt.value ??
            opt.label ??
            (opt.date instanceof Date ? opt.date.getMonth() : '');

          // Determine an English label
          if (opt.date && opt.date instanceof Date) {
            monthLabel = opt.date.toLocaleString('en-US', { month: 'long' });
          } else if (opt.label) {
            monthLabel = String(opt.label);
          } else if (opt.value !== undefined) {
            const v = Number(opt.value);
            if (!Number.isNaN(v)) {
              const d = new Date(displayedMonth.getFullYear(), v, 1);
              monthLabel = d.toLocaleString('en-US', { month: 'long' });
            } else {
              monthLabel = String(opt.value);
            }
          }

          // Compute a single Nepali month name for this option. Strategy:
          // - If opt.date is provided, use that date's BS month.
          // - Else try to build two AD dates representing the start and end of the
          //   English month in the preferred English year (use displayedMonth year),
          //   convert both to BS and prefer the BS month matching preferredBsMonthNum.
          // - Fallback to converting the month's first day.
          let nepali = '';
          try {
            let bsCandidates = [];
            if (opt.date && opt.date instanceof Date) {
              const bs = nepaliForDate(opt.date);
              if (bs && bs.length >= 7) bsCandidates.push(bs.slice(5, 7));
            } else {
              // try to determine month index
              const v = Number(opt.value);
              let monthIdx = Number.isNaN(v) ? undefined : v;
              if (monthIdx === undefined && opt.label) {
                // try to parse month name into a date (use displayedMonth year)
                const parsed = new Date(`${opt.label} 1, ${displayedMonth.getFullYear()}`);
                if (!Number.isNaN(parsed)) monthIdx = parsed.getMonth();
              }
              // if we have a month index, create first and last day AD dates to convert
              if (typeof monthIdx === 'number') {
                const year = displayedMonth.getFullYear();
                const firstDay = new Date(year, monthIdx, 1);
                const lastDay = new Date(year, monthIdx + 1, 0);
                const bsFirst = nepaliForDate(firstDay);
                const bsLast = nepaliForDate(lastDay);
                if (bsFirst && bsFirst.length >= 7) bsCandidates.push(bsFirst.slice(5, 7));
                if (bsLast && bsLast.length >= 7) bsCandidates.push(bsLast.slice(5, 7));
              }
            }

            // choose candidate that matches preferredBsMonthNum if available
            let chosenBsMonthNum;
            if (preferredBsMonthNum) {
              const match = bsCandidates.find((c) => Number(c) === preferredBsMonthNum);
              if (match) chosenBsMonthNum = Number(match);
            }
            if (!chosenBsMonthNum && bsCandidates.length > 0) chosenBsMonthNum = Number(bsCandidates[0]);

            if (chosenBsMonthNum && !Number.isNaN(chosenBsMonthNum)) {
              const idx = chosenBsMonthNum - 1;
              if (idx >= 0 && idx < BS_MONTH_NAMES.length) nepali = BS_MONTH_NAMES[idx];
            }
          } catch (e) {
            nepali = '';
          }

          return (
            <option key={String(monthValue)} value={String(monthValue)}>
              {lang === 'en' ? monthLabel : nepali || monthLabel}
            </option>
          );
        })}
      </select>
    );
  }

  const getFooterDate = () => {
    if (!selected) return <div className="py-4">Pick a day. 🗓️</div>;
    return (
      <div className="flex gap-4 py-4">
        <div className="">SELECTED:</div>
        <div>{`English: (${selected.toLocaleDateString()})`}</div>
        <div>{`नेपाली: (${ADToBS(selected)})`}</div>
      </div>
    );
  };

  const formatWeekdayName = (date, formatOptions) => {
    try {
      const idx = date.getDay();
      if (lang === 'np') return NEPALI_WEEKDAYS[idx] || '';

      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch (e) {
      return '';
    }
  };

  const bsForDate = (date) => {
    try {
      const bs = ADToBS(date);
      const year = bs.slice(0, 4);
      const monthNum = Number(bs.slice(5, 7));
      const monthName = BS_MONTH_NAMES[monthNum - 1] || '';
      return { year, monthNum, monthName, bs };
    } catch (e) {
      return { year: '', monthNum: undefined, monthName: '', bs: '' };
    }
  };

  const getOverlapForDisplayedMonth = () => {
    const engMonth = displayedMonth.toLocaleString('en-US', { month: 'short' });
    const engNextDate = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      1
    );
    const engNext = engNextDate.toLocaleString('en-US', { month: 'short' });

    const thisDate = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth(),
      1
    );
    const nextDate = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      1
    );
    const bsThis = bsForDate(thisDate);
    const bsNext = bsForDate(nextDate);

    const engYearThis = thisDate.getFullYear();
    const engYearNext = nextDate.getFullYear();
    const engLabel = engNext
      ? `${engMonth}/${engNext} ${
          engYearThis === engYearNext
            ? engYearThis
            : `${engYearThis}/${engYearNext}`
        }`
      : `${engMonth} ${engYearThis}`;

    const nepLabel = (() => {
      const mThis = bsThis.monthName;
      const yThis = bsThis.year;
      const mNext = bsNext.monthName;
      const yNext = bsNext.year;
      if (mThis && mNext && mThis !== mNext) {
        if (yThis && yNext && yThis !== yNext) {
          return `${mThis} ${yThis}/${mNext} ${yNext}`;
        }
        return `${mThis}/${mNext} ${yThis || yNext}`;
      }

      if (mThis) return `${mThis} ${yThis}`;
      if (mNext) return `${mNext} ${yNext}`;
      return '';
    })();

    return { engLabel, nepLabel };
  };

  function handleSelect(date) {
    if (!date) {
      setSelected(undefined);
      return;
    }
    setSelected(date);

    setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function handleToday() {
    const today = new Date();
    setSelected(today);
    setDisplayedMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }
  return (
    <div className="grid justify-items-center items-center h-screen w-screen">
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-end p-2 gap-4 items-center space-x-2">
            {(() => {
              const { engLabel, nepLabel } = getOverlapForDisplayedMonth();
              if (lang === 'en' && nepLabel) {
                return <div className="text-sm text-gray-600">{nepLabel}</div>;
              }
              if (lang === 'np' && engLabel) {
                return <div className="text-sm text-gray-600">{engLabel}</div>;
              }
              return null;
            })()}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">EN</span>
              <button
                aria-pressed={lang === 'np'}
                onClick={() => setLang((l) => (l === 'en' ? 'np' : 'en'))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  lang === 'np' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    lang === 'np' ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">NP</span>
            </div>

            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Today
            </button>
          </div>
          <DayPicker
            className="p-4 rounded-3xl shadow-2xl"
            captionLayout="dropdown"
            showOutsideDays={true}
            animate
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            month={displayedMonth}
            onMonthChange={(month) => setDisplayedMonth(month)}
            footer={getFooterDate()}
            formatters={{ formatWeekdayName }}
            endMonth={new Date(2030, 11)}
            components={{
              DayButton: CustomDayButton,
              MonthsDropdown: CustomMonthsDropdown,
              YearsDropdown: CustomYearsDropdown,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComboCalender;
