'use client';
// @example {"title":"Basic","description":"Type a date or open the calendar. Values are dayjs objects."}
import * as React from 'react';
import { DatePicker, dayjs, type Dayjs } from '@sorbet-ui/react';

export default function Basic() {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2026-11-03'));
  return <DatePicker label="Start date" value={date} onChange={setDate} />;
}
