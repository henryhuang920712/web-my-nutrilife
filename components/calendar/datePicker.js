"use client";

import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { generateDate, months } from "./util/calendar";
import cn from "./util/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Calendar } from "lucide-react";

export default function DatePicker({ fieldName, value, setFieldValue, className, useFormik = true }) {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const currentDate = dayjs();

    // Use value if available, otherwise use the internal state
    const [selectDate, setSelectDate] = useState(value ? dayjs(value) : currentDate);
    const [mode, setMode] = useState("date");

    const handleDateSelect = (date) => {
        setIsDatePickerVisible(false); // Close the date picker
        if (setFieldValue) {
            if (useFormik) {
                setFieldValue(fieldName, date.format("YYYY-MM-DD"));
            } else {
                setFieldValue(date.format("YYYY-MM-DD"));
            }
        }
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest(".datepicker-container") &&
            !event.target.closest(".input-container")) {
            setIsDatePickerVisible(false); // Close the picker if clicked outside
        }
    };

    useEffect(() => {
        if (isDatePickerVisible) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isDatePickerVisible]);

    const YearList = () => {
        const [years, setYears] = React.useState(() =>
            Array.from({ length: 12 }, (_, index) => selectDate.year() - 6 + index)
        );

        return (
            years.map((year, index) => {
                return (
                    <h1
                        key={index}
                        className={cn(
                            selectDate.year() === year
                                ? "bg-black text-white"
                                : "text-gray-400",
                            "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                        )}
                        onClick={() => {
                            setSelectDate(selectDate.year(year));
                            setMode("month");
                        }}
                    >
                        {year}
                    </h1>
                );
            })
        );
    };

    const MonthList = () => {
        return (
            months.map((month, index) => {
                return (
                    <h1
                        key={index}
                        className={cn(
                            selectDate.month() === index
                                ? "bg-black text-white"
                                : "text-gray-400",
                            "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                        )}
                        onClick={() => {
                            setSelectDate(selectDate.month(index));
                            setMode("date");
                        }}
                    >
                        {month.slice(0, 3)}
                    </h1>
                );
            })
        );
    };

    const DateList = () => {
        return (
            generateDate(selectDate.month(), selectDate.year()).map(
                ({ date, currentMonth, today }, index) => {
                    return (
                        <div
                            key={index}
                            className="p-2 text-center h-6 grid place-content-center text-sm border-t"
                        >
                            <h1
                                className={cn(
                                    currentMonth ? "" : "text-gray-400",
                                    selectDate
                                        .toDate()
                                        .toDateString() ===
                                        date.toDate().toDateString()
                                        ? "bg-black text-white"
                                        : "",
                                    "h-6 w-6 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                                )}
                                onClick={() => {
                                    setSelectDate(date);
                                    handleDateSelect(date);
                                }}
                            >
                                {date.date()}
                            </h1>
                        </div>
                    );
                }
            )
        );
    };

    const DateView = () => {
        switch (mode) {
            case "date":
                return (
                    <>
                        <div className="grid grid-cols-7 border-none">
                            {days.map((day, index) => {
                                return (
                                    <h1
                                        key={index}
                                        className="text-xs text-center h-6 w-6 grid place-content-center text-gray-500 select-none"
                                    >
                                        {day}
                                    </h1>
                                );
                            })}
                        </div>
                        <div className=" grid grid-cols-7 ">
                            <DateList />
                        </div>
                    </>
                );
            case "month":
                return (
                    <div className=" grid grid-cols-3 gap-2 place-items-center border-none datepicker-container">
                        <MonthList />
                    </div>
                );
            case "year":
                return (
                    <div className=" grid grid-cols-3 gap-2 place-items-center border-none datepicker-container">
                        <YearList />
                    </div>
                );
            default:
                return (
                    <>
                        <div className="grid grid-cols-7 border-none">
                            {days.map((day, index) => {
                                return (
                                    <h1
                                        key={index}
                                        className="text-xs text-center h-6 w-6 grid place-content-center text-gray-500 select-none"
                                    >
                                        {day}
                                    </h1>
                                );
                            })}
                        </div>
                        <div className=" grid grid-cols-7 ">
                            <DateList />
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="relative flex items-center border rounded-md p-2">
            <input
                type="text"
                placeholder="Select your birthday"
                onFocus={() => { setIsDatePickerVisible(true);}}
                className={`input-container ${className}`}
                value={selectDate.format("YYYY-MM-DD")}
                readOnly
            />

            {/* Calendar Icon */}
            <Calendar
                className="text-gray-500 cursor-pointer ps-1"
                onClick={() => setIsDatePickerVisible(true)} // Show the date picker when clicked
                size={20} // Adjust the size as needed
            />

            {/* Date Picker Container */}
            {isDatePickerVisible &&
                <div className="absolute bottom-10 left-0 mt-2 z-20 bg-white shadow-lg rounded-lg datepicker-container">
                    <div className="flex sm:divide-x justify-center mx-auto items-center flex-col p-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 justify-between">
                                <GrFormPrevious
                                    className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                    onClick={() => {
                                        switch (mode) {
                                            case "date":
                                                setSelectDate(selectDate.month(selectDate.month() - 1));
                                                break;
                                            case "month":
                                                setSelectDate(selectDate.year(selectDate.year() - 1));
                                                break;
                                            case "year":
                                                setSelectDate(selectDate.year(selectDate.year() - 12));
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                />
                                <h1
                                    className="cursor-pointer hover:scale-105 transition-all"
                                    onClick={() => setMode("date")}
                                >
                                    {selectDate.date()}
                                </h1>
                                <h1
                                    className="cursor-pointer hover:scale-105 transition-all"
                                    onClick={() => setMode("month")}
                                >
                                    {months[selectDate.month()]}
                                </h1>
                                <h1
                                    className="cursor-pointer hover:scale-105 transition-all"
                                    onClick={() => setMode("year")}
                                >
                                    {selectDate.year()}
                                </h1>
                                <GrFormNext
                                    className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                    onClick={() => {
                                        switch (mode) {
                                            case "date":
                                                setSelectDate(selectDate.month(selectDate.month() + 1));
                                                break;
                                            case "month":
                                                setSelectDate(selectDate.year(selectDate.year() + 1));
                                                break;
                                            case "year":
                                                setSelectDate(selectDate.year(selectDate.year() + 12));
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <DateView />
                    </div>
                </div>
            }
        </div>
    );
}
