import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
interface DayOption {
  value: string;
  label: string;
}

const daysOfWeekOptions: DayOption[] = [
  { value: 'monday', label: 'Thứ 2' },
  { value: 'tuesday', label: 'Thứ 3' },
  { value: 'wednesday', label: 'Thứ 4' },
  { value: 'thursday', label: 'Thứ 5' },
  { value: 'friday', label: 'Thứ 6' },
  { value: 'saturday', label: 'Thứ 7' },
  { value: 'sunday', label: 'Chủ nhật' },
];

interface DateTimePickerProps {
  initialDateTime?: string;
  onDateTimeChange?: (dateTimeString: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ initialDateTime, onDateTimeChange }) => {
  const [dayTimeMap, setDayTimeMap] = useState<{ [key: string]: Date }>({});

  useEffect(() => {
    if (initialDateTime) {
      const newDayTimeMap: { [key: string]: Date } = {};
      const parts = initialDateTime.split(', ');

      parts.forEach(part => {
        const [dayLabel, time] = part.split(' lúc ');
        const dayOption = daysOfWeekOptions.find(option => option.label === dayLabel);
        
        if (dayOption) {
          const [hour, minute] = time.split(':');
          newDayTimeMap[dayOption.value] = new Date();
          newDayTimeMap[dayOption.value].setHours(parseInt(hour), parseInt(minute));
        }
      });

      setDayTimeMap(newDayTimeMap);
    }
  }, [initialDateTime]);

  const handleDayChange = (selectedOptions: DayOption[]) => {
    const newDayTimeMap: { [key: string]: Date } = { ...dayTimeMap };
    
    selectedOptions.forEach(option => {
      if (!newDayTimeMap[option.value]) {
        newDayTimeMap[option.value] = new Date();
      }
    });

    Object.keys(newDayTimeMap).forEach(dayKey => {
      if (!selectedOptions.some(option => option.value === dayKey)) {
        delete newDayTimeMap[dayKey];
      }
    });

    setDayTimeMap(newDayTimeMap);
    updateDateTimeString(newDayTimeMap);
  };

  const handleTimeChange = (dayValue: string, date: Date) => {
    const newDayTimeMap = { ...dayTimeMap, [dayValue]: date };
    setDayTimeMap(newDayTimeMap);
    updateDateTimeString(newDayTimeMap);
  };

  const updateDateTimeString = (dayTimeMap: { [key: string]: Date }) => {
    const dateTimeString = Object.keys(dayTimeMap)
      .map(dayKey => {
        const dayOption = daysOfWeekOptions.find(option => option.value === dayKey);
        const time = dayTimeMap[dayKey];
        return `${dayOption?.label} lúc ${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
      })
      .join(', ');

    if (onDateTimeChange) {
      onDateTimeChange(dateTimeString);
    }
  };

  return (
    <div>
      <Select
        options={daysOfWeekOptions}
        isMulti
        onChange={(options) => handleDayChange(options as DayOption[])}
        value={daysOfWeekOptions.filter(option => dayTimeMap[option.value])}
      />
      {Object.entries(dayTimeMap).map(([dayValue, date]) => (
        <div key={dayValue}>
          <label>{daysOfWeekOptions.find(option => option.value === dayValue)?.label}:</label>
          <DatePicker
            selected={date}
            onChange={(newDate) => handleTimeChange(dayValue, newDate as Date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
          />
        </div>
      ))}
    </div>
  );
};

export default DateTimePicker;
