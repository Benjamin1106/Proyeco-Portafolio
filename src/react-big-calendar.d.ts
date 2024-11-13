declare module 'react-big-calendar' {
  import * as React from 'react';
  import * as moment from 'moment';

  export interface SlotInfo {
    start: Date;
    end: Date;
    slots: Date[];
    action: 'select' | 'click' | 'doubleClick';
  }

  export interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }

  export const momentLocalizer: (moment: typeof moment) => any;

  export interface DateFormat {
    dayFormat?: string;
    timeGutterFormat?: string;
    monthHeaderFormat?: string;
    dayHeaderFormat?: string;
  }

  export interface Messages {
    today?: string;
    previous?: string;
    next?: string;
    month?: string;
    week?: string;
    day?: string;
    agenda?: string;
    date?: string;
    time?: string;
    event?: string;
    noEventsInRange?: string;
    showMore?: (total: number) => string;
  }

  export interface CalendarProps {
    events: Event[];
    startAccessor: string | ((event: Event) => Date);
    endAccessor: string | ((event: Event) => Date);
    selectable?: boolean;
    localizer: any;
    onSelectSlot?: (slotInfo: SlotInfo) => void;
    onSelectEvent?: (event: Event) => void;
    style?: React.CSSProperties;
    defaultView?: string;
    views?: string[] | { [view: string]: boolean };
    formats?: DateFormat;
    messages?: Messages;
  }

  export class Calendar extends React.Component<CalendarProps, any> {}

  export const Views: {
    MONTH: 'month';
    WEEK: 'week';
    WORK_WEEK: 'work_week';
    DAY: 'day';
    AGENDA: 'agenda';
  };

  export default Calendar;
}