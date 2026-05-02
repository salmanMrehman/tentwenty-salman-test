/**
 * All user-facing English strings.
 *
 * No component should hardcode visible copy. This makes future i18n easy
 * (drop-in `next-i18next`) and gives one place to review wording.
 */

export const APP_STRINGS = {
  brand: {
    name: "ticktock",
    tagline:
      "Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.",
  },

  login: {
    welcome: "Welcome back",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    submit: "Sign in",
    submitting: "Signing in...",
    invalidCredentials: "Invalid email or password.",
    emailRequired: "Email is required.",
    emailInvalid: "Please enter a valid email address.",
    passwordRequired: "Password is required.",
    passwordTooShort: "Password must be at least 6 characters.",
  },

  header: {
    timesheetsLink: "Timesheets",
    signOut: "Sign out",
  },

  dashboard: {
    pageTitle: "Your Timesheets",
    filterDateRange: "Date Range",
    filterStatus: "Status",
    filterStatusAll: "All",
    columnWeek: "Week #",
    columnDate: "Date",
    columnStatus: "Status",
    columnActions: "Actions",
    actionView: "View",
    actionUpdate: "Update",
    actionCreate: "Create",
    perPage: (n: number) => `${n} per page`,
    pageInfo: (page: number, total: number) =>
      `Page ${page} of ${total}`,
    noResults: "No timesheets match your filters.",
    loading: "Loading timesheets...",
    loadError: "Could not load timesheets. Please try again.",
  },

  pagination: {
    previous: "Previous",
    next: "Next",
    ellipsis: "...",
  },

  status: {
    completed: "COMPLETED",
    incomplete: "INCOMPLETE",
    missing: "MISSING",
  },

  weekDetail: {
    title: "This week's timesheet",
    addNewTask: "+ Add new task",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this entry?",
    backToList: "Back to timesheets",
    progressLabel: (logged: number, total: number) =>
      `${logged}/${total} hrs`,
    hoursSuffix: (n: number) => `${n} hrs`,
    loading: "Loading week...",
    loadError: "Could not load this week. Please try again.",
  },

  entryModal: {
    titleAdd: "Add New Entry",
    titleEdit: "Edit Entry",
    projectLabel: "Select Project",
    projectPlaceholder: "Project Name",
    projectHint: "Choose the project this work belongs to.",
    workTypeLabel: "Type of Work",
    workTypeHint: "Pick the category that best describes this task.",
    descriptionLabel: "Task description",
    descriptionPlaceholder: "Write text here ...",
    descriptionHint: "A note for extra info",
    hoursLabel: "Hours",
    submitAdd: "Add entry",
    submitEdit: "Save changes",
    cancel: "Cancel",
    requiredMark: "*",

    // Validation errors
    projectRequired: "Please select a project.",
    workTypeRequired: "Please select a type of work.",
    descriptionRequired: "Task description is required.",
    descriptionTooLong:
      "Task description must be 500 characters or fewer.",
    hoursRequired: "Hours are required.",
    hoursMin: "Hours must be at least 1.",
    hoursMax: "Hours cannot exceed 24 in a single entry.",
    hoursWeeklyMax: (remaining: number) =>
      `Only ${remaining} more hours available in this week (40 hr max).`,
  },

  workTypeLabels: {
    bug_fixes: "Bug fixes",
    feature: "Feature",
    research: "Research",
    meeting: "Meeting",
    other: "Other",
  },

  footer: {
    copyright: (year: number) => `© ${year} tentwenty. All rights reserved.`,
  },

  errors: {
    generic: "Something went wrong. Please try again.",
    notFound: "We could not find what you were looking for.",
    unauthorized: "You need to sign in to view this page.",
  },
} as const;
