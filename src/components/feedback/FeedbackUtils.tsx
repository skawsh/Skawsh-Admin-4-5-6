
import { useState } from 'react';

export interface FeedbackItem {
  id: number;
  userName: string;
  rating: number;
  feedbackText: string;
  category: string;
  date: string;
  flagged: boolean;
}

export interface ReportedStudio {
  id: number;
  userName: string;
  mobileNumber: string; // Added mobile number field
  studioId: string;
  studioName: string;
  issueReported: string;
  date: string;
  reportsCount: number;
}

export type DateRangeType = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
export type SortOrderType = 'latest' | 'highest' | 'lowest';
export type IssueType = 
  | "Unhygienic washing process"
  | "Wrong service provided"
  | "Poor quality of cleaning, stains remained"
  | "Strong chemical smell on clothes after washing";

export const useFeedbackFilters = (feedbackData: FeedbackItem[]) => {
  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>('last30days');
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(undefined);
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('latest');

  // Filter logic
  const filteredFeedback = feedbackData.filter(item => {
    const itemDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    
    // Date Range Filter - improved logic
    let dateMatch = true;
    
    if (selectedDateRange === 'today') {
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      dateMatch = itemDate >= today && itemDate <= endOfDay;
    } else if (selectedDateRange === 'yesterday') {
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      dateMatch = itemDate >= yesterday && itemDate <= endOfYesterday;
    } else if (selectedDateRange === 'last7days') {
      dateMatch = itemDate >= last7Days;
    } else if (selectedDateRange === 'last30days') {
      dateMatch = itemDate >= last30Days;
    } else if (selectedDateRange === 'custom' && customDateFrom && customDateTo) {
      const fromDate = new Date(customDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(customDateTo);
      toDate.setHours(23, 59, 59, 999);
      
      dateMatch = itemDate >= fromDate && itemDate <= toDate;
    }
    
    // Rating Filter
    let ratingMatch = true;
    if (selectedRating !== 'all') {
      ratingMatch = item.rating === parseInt(selectedRating);
    }
    
    return dateMatch && ratingMatch;
  });

  // Sort the filtered feedback
  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === 'highest') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  return {
    selectedDateRange,
    setSelectedDateRange,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
    selectedRating,
    setSelectedRating,
    sortOrder,
    setSortOrder,
    filteredFeedback,
    sortedFeedback
  };
};

// Calculate average rating from feedback data
export const calculateAverageRating = (feedbackData: FeedbackItem[]) => {
  const totalRatings = feedbackData.length;
  if (totalRatings === 0) return 0;
  
  const sum = feedbackData.reduce((acc, item) => acc + item.rating, 0);
  return sum / totalRatings;
};
