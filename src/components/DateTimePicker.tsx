import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

interface DayOption {
  value: string;
  label: string;
}

const daysOfWeek: DayOption[] = [
  { value: 'monday', label: 'Thứ 2' },
  { value: 'tuesday', label: 'Thứ 3' },
  { value: 'wednesday', label: 'Thứ 4' },
  { value: 'thursday', label: 'Thứ 5' },
  { value: 'friday', label: 'Thứ 6' },
  { value: 'saturday', label: 'Thứ 7' },
  { value: 'sunday', label: 'Chủ nhật' },
];

interface DateTimePickerProps {
  onDateTimeChange?: (dateTime: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onDateTimeChange }) => {
  const [dayTimeMap, setDayTimeMap] = useState<{ [dayValue: string]: Date }>({});

  const handleDayChange = (selectedOptions: DayOption[]) => {
    // Cập nhật thời gian cho các ngày được chọn
    const newDayTimeMap = { ...dayTimeMap };
    selectedOptions.forEach(option => {
      if (!newDayTimeMap[option.value]) {
        newDayTimeMap[option.value] = new Date();
      }
    });
    // Xóa những ngày không còn được chọn
    Object.keys(dayTimeMap).forEach(dayValue => {
      if (!selectedOptions.some(option => option.value === dayValue)) {
        delete newDayTimeMap[dayValue];
      }
    });
    setDayTimeMap(newDayTimeMap);
    updateDateTimeString(selectedOptions, newDayTimeMap);
  };

  const handleDayTimeChange = (dayValue: string, date: Date) => {
    const newDayTimeMap = { ...dayTimeMap, [dayValue]: date };
    setDayTimeMap(newDayTimeMap);
    updateDateTimeString(Object.values(daysOfWeek).filter(option => newDayTimeMap[option.value]), newDayTimeMap);
  };

  const updateDateTimeString = (
    selectedOptions: DayOption[],
    dayTimeMap: { [dayValue: string]: Date }
  ) => {
    const selectedDaysLabels = selectedOptions.map((option) => {
      const dayTime = dayTimeMap[option.value];
      const formattedTime = dayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${option.label} lúc ${formattedTime}`;
    });

    const dateTimeString = selectedDaysLabels.join(', ');
    onDateTimeChange?.(dateTimeString);
  };

  return (
    <div>
      <div>
        <Select
          options={daysOfWeek}
          value={Object.values(daysOfWeek).filter(option => dayTimeMap[option.value])}
          onChange={(selectedOptions) => handleDayChange(selectedOptions as DayOption[])}
          isMulti
        />
      </div>
      {Object.values(daysOfWeek).filter(option => dayTimeMap[option.value]).map((dayOption) => (
        <div key={dayOption.value}>
          <label>{dayOption.label}:</label>
          <DatePicker
            selected={dayTimeMap[dayOption.value]}
            onChange={(date) => handleDayTimeChange(dayOption.value, date as Date)}
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>
      ))}
    </div>
  );
};


export default DateTimePicker;
