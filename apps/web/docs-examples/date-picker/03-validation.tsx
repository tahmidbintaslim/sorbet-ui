'use client';
// @example {"title":"Validation","description":"Set error and helperText from your own check."}
import * as React from 'react';
import { DatePicker, type Dayjs } from '@sorbet-ui/react';

export default function Validation() {
  const [date, setDate] = React.useState<Dayjs | null>(null);
  const missing = date === null || !date.isValid();
  return (
    <DatePicker
      label="Due date"
      required
      value={date}
      onChange={setDate}
      error={missing}
      helperText={missing ? 'Choose a due date.' : `Due ${date.format('D MMMM YYYY')}.`}
    />
  );
}
