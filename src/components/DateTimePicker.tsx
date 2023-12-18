import React, { useState } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import Select from 'react-select';
import { ValueType, ActionMeta } from 'react-select';
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
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<ValueType<DayOption, false>>(null);

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
    if (selectedDay) {
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateTimeString = `${selectedDay.label} lúc ${formattedTime}`;
      onDateTimeChange?.(dateTimeString);
    }
  };

  const handleDayChange = (selectedOption: ValueType<DayOption, false>) => {
    setSelectedDay(selectedOption);
    if (selectedOption) {
      const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateTimeString = `${(selectedOption as DayOption).label} at ${formattedTime}`;
      onDateTimeChange?.(dateTimeString);
    }
  };

  return (
    <div>
      <div>
        <label>Day: </label>
        <Select<DayOption, false> options={daysOfWeek} value={selectedDay} onChange={handleDayChange} />
      </div>
      <div>
        <label>Time: </label>
        <DatePicker
          selected={selectedTime}
          onChange={handleTimeChange}
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;