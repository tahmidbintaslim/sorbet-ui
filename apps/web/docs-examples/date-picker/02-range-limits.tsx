'use client';
// @example {"title":"Minimum and maximum","description":"minDate and maxDate (from MUI X) disable days outside the range."}
import * as React from 'react';
import { DatePicker, dayjs, type Dayjs } from '@sorbet-ui/react';

export default function RangeLimits() {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2026-11-12'));
  return (
    <DatePicker
      label="Delivery date"
      helperText="Between 10 and 24 November 2026."
      value={date}
      onChange={setDate}
      minDate={dayjs('2026-11-10')}
      maxDate={dayjs('2026-11-24')}
    />
  );
}
