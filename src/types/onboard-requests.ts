
export interface OnboardRequest {
  id: number;
  studioName: string;
  ownerName: string;
  mobileNumber: string;
  emailId: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export const filterOptions = [
  { id: 'relativeTime', label: 'Relative Time' },
  { id: 'relativeDate', label: 'Relative Date' },
  { id: 'dateRange', label: 'Date Range' },
  { id: 'dateTimeRange', label: 'Date & Time Range' },
];

export const filterDisplayNames: Record<string, string> = {
  all: "All Requests",
  daily: "Daily",
  yesterday: "Yesterday",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  allTime: "All time",
  today: "Today",
  weekToDate: "Week to date",
  monthToDate: "Month to date",
  yearToDate: "Year to date",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  dateRange: "Custom Date Range",
  dateTimeRange: "Date & Time Range",
  relativeTime: "Relative Time",
  relativeDate: "Relative Date",
  last15Minutes: "Last 15 minutes",
  last30Minutes: "Last 30 minutes",
  last60Minutes: "Last 60 minutes",
  last4Hours: "Last 4 hours",
  last24Hours: "Last 24 hours",
};

export const filterCategories = {
  relativeTime: [
    'last15Minutes',
    'last30Minutes',
    'last60Minutes',
    'last4Hours',
    'last24Hours'
  ],
  relativeDate: [
    'daily',
    'yesterday',
    'weekly',
    'monthly',
    'yearly',
    'allTime'
  ],
  dateRange: [
    'custom'
  ],
  dateTimeRange: [
    'customDateTime'
  ]
};
