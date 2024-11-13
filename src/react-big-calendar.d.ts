declare module 'react-big-calendar' {
  import * as React from 'react';
  import * as moment from 'moment'; // Import moment to provide more accurate typing for `momentLocalizer`

  // Define SlotInfo type more specifically
  export interface SlotInfo {
    start: Date;
    end: Date;
    slots: Date[];
    action: string;
  }

  // Define the `momentLocalizer` function type
  export const momentLocalizer: (moment: typeof moment) => any;

  // Define the CalendarProps type to reflect the component's props
  interface CalendarProps {
    events: any[]; // You can replace `any[]` with a more specific event type if needed
    startAccessor: string;
    endAccessor: string;
    selectable: boolean;
    localizer: any;
    onSelectSlot: (slotInfo: SlotInfo) => void;
    style: React.CSSProperties;
  }

  // Export the Calendar component with the props defined
  export class Calendar extends React.Component<CalendarProps> {}

  // Export the default Calendar
  export default Calendar;
}
