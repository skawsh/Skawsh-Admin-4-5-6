
// Mock data for feedback items
export const mockFeedback = [
  {
    id: 1,
    userName: "John Smith",
    rating: 5,
    feedbackText: "The app is amazing! I've been using it for all my laundry needs. The delivery was prompt and my clothes came back perfectly clean. The user interface is also very intuitive and easy to navigate.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  },
  {
    id: 2,
    userName: "Sarah Johnson",
    rating: 4,
    feedbackText: "Good service overall. The app works well but sometimes lags when I'm trying to track my order.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  },
  {
    id: 3,
    userName: "Michael Brown",
    rating: 2,
    feedbackText: "Had issues with my last order. The delivery was late and some of my items were missing.",
    category: "App Experience",
    date: "2023-09-13T16:45:00",
    flagged: false
  },
  {
    id: 4,
    userName: "Emily Davis",
    rating: 5,
    feedbackText: "Customer support was excellent! Had an issue with my order and they resolved it immediately.",
    category: "App Experience",
    date: "2023-09-12T09:30:00",
    flagged: false
  },
  {
    id: 5,
    userName: "David Wilson",
    rating: 3,
    feedbackText: "App is good but needs more payment options.",
    category: "App Experience",
    date: "2023-09-11T12:00:00",
    flagged: false
  },
  {
    id: 6,
    userName: "Lisa Martinez",
    rating: 1,
    feedbackText: "Terrible experience. My clothes came back with stains and customer service didn't help at all. This is completely unacceptable and I demand a full refund for this horrible service. Will not be using this app again!",
    category: "App Experience",
    date: "2023-09-10T15:20:00",
    flagged: true
  },
  {
    id: 7,
    userName: "Robert Taylor",
    rating: 5,
    feedbackText: "Best laundry service I've ever used! Very convenient.",
    category: "App Experience",
    date: "2023-09-09T11:10:00",
    flagged: false
  },
  {
    id: 8,
    userName: "Amanda Anderson",
    rating: 4,
    feedbackText: "Love the app, but would like to see more discounts for regular users.",
    category: "App Experience",
    date: "2023-09-08T14:25:00",
    flagged: false
  },
  {
    id: 9,
    userName: "James Thomas",
    rating: 5,
    feedbackText: "The service is consistently excellent. Always on time and great quality.",
    category: "App Experience",
    date: "2023-09-07T10:30:00",
    flagged: false
  },
  {
    id: 10,
    userName: "Jennifer Jackson",
    rating: 2,
    feedbackText: "Had trouble reaching customer support. Waited for over an hour on the phone.",
    category: "App Experience",
    date: "2023-09-06T13:15:00",
    flagged: false
  },
  {
    id: 11,
    userName: "Kevin Richardson",
    rating: 4,
    feedbackText: "Great app interface, easy to navigate and place orders.",
    category: "App Experience",
    date: "2023-09-05T09:45:00",
    flagged: false
  },
  {
    id: 12,
    userName: "Michelle Garcia",
    rating: 3,
    feedbackText: "App works fine but could use some UI improvements for better user experience.",
    category: "App Experience",
    date: "2023-09-04T16:20:00",
    flagged: false
  },
  {
    id: 13,
    userName: "Charles Rodriguez",
    rating: 5,
    feedbackText: "Perfect service every time! The app is flawless and the delivery is always on time.",
    category: "App Experience",
    date: "2023-09-03T11:30:00",
    flagged: false
  },
  {
    id: 14,
    userName: "Patricia Lewis",
    rating: 2,
    feedbackText: "App crashes frequently when trying to schedule pickups.",
    category: "App Experience",
    date: "2023-09-02T14:10:00",
    flagged: false
  },
  {
    id: 15,
    userName: "Thomas Lee",
    rating: 4,
    feedbackText: "Very good experience with the app. Scheduling is easy and tracking works well.",
    category: "App Experience",
    date: "2023-09-01T10:05:00",
    flagged: false
  },
  // Adding more data with today's date for better testing
  {
    id: 16,
    userName: "Rachel Green",
    rating: 1,
    feedbackText: "Very disappointed with the service today. My clothes weren't delivered on time.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  },
  {
    id: 17,
    userName: "Ross Geller",
    rating: 5,
    feedbackText: "Amazing service today! Everything was perfect and on time.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  },
  {
    id: 18,
    userName: "Chandler Bing",
    rating: 4,
    feedbackText: "Could the app BE any better? Almost perfect but has minor glitches.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  },
  {
    id: 19,
    userName: "Monica Geller",
    rating: 5,
    feedbackText: "The cleanest my clothes have ever been! Perfectly organized delivery too.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  },
  {
    id: 20,
    userName: "Joey Tribbiani",
    rating: 3,
    feedbackText: "How you doin'? The app is good but could use more food delivery options.",
    category: "App Experience",
    date: new Date().toISOString(), // Today's date
    flagged: false
  }
];

// Mock data for reported studios
export const mockReportedStudios = [
  {
    id: 1,
    userName: "Mary Johnson",
    studioId: "STD-001",
    studioName: "CleanWash Laundry",
    issueReported: "Items were damaged during washing process",
    date: new Date().toISOString() // Today's date
  },
  {
    id: 2,
    userName: "Robert Davis",
    studioId: "STD-002",
    studioName: "SpeedyWash",
    issueReported: "Late delivery and poor customer service",
    date: new Date().toISOString() // Today's date
  },
  {
    id: 3,
    userName: "Sarah Wilson",
    studioId: "STD-001",
    studioName: "CleanWash Laundry",
    issueReported: "Missing items from my order",
    date: "2023-09-15T14:30:00"
  },
  {
    id: 4,
    userName: "Thomas Brown",
    studioId: "STD-003",
    studioName: "Premium Laundry Services",
    issueReported: "Overcharged for basic washing services",
    date: "2023-09-10T09:15:00"
  },
  {
    id: 5,
    userName: "Jennifer Lee",
    studioId: "STD-004",
    studioName: "EcoWash Studio",
    issueReported: "Poor quality of cleaning, stains remained",
    date: "2023-09-08T16:45:00"
  },
  {
    id: 6,
    userName: "Michael Garcia",
    studioId: "STD-002",
    studioName: "SpeedyWash",
    issueReported: "Wrong items returned in my package",
    date: "2023-09-05T11:20:00"
  },
  {
    id: 7,
    userName: "Emily Martinez",
    studioId: "STD-005",
    studioName: "Urban Laundromat",
    issueReported: "Rude staff behavior and unprofessional service",
    date: "2023-09-03T13:10:00"
  },
  {
    id: 8,
    userName: "David Rodriguez",
    studioId: "STD-003",
    studioName: "Premium Laundry Services",
    issueReported: "Delayed service without notification",
    date: "2023-09-01T10:30:00"
  },
  {
    id: 9,
    userName: "Linda Harris",
    studioId: "STD-006",
    studioName: "Fresh & Clean",
    issueReported: "Strong chemical smell on clothes after washing",
    date: "2023-08-28T15:45:00"
  },
  {
    id: 10,
    userName: "James Wilson",
    studioId: "STD-004",
    studioName: "EcoWash Studio",
    issueReported: "App glitches when trying to contact the studio",
    date: "2023-08-25T09:20:00"
  }
];
