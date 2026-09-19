# CivicLens

CivicLens is a frontend civic-issue reporting platform built for Hyderabad. It enables citizens to report local street problems—such as potholes, broken streetlights, water leaks, overflowing waste bins, and damaged footpaths—and track each request from submission to resolution.

## Problem and solution

Citizens often do not know where to report civic problems or what happens after a complaint is raised. This lack of visibility can delay action and reduce public trust.

CivicLens creates a clear digital workflow for civic reporting. Users can upload a photo, select an issue type, provide location details, and follow real-time repair updates. Municipal teams can use the admin workspace to assign issues, update progress, and mark repairs as resolved.

## Features

- Responsive citizen-facing civic reporting portal
- Photo-based street issue reporting
- Support for roads, streetlights, water, waste, and footpath complaints
- Location and issue-detail submission flow
- Unique report IDs for tracking
- Repair-status timeline: Reported, Assigned, In Progress, and Resolved
- Live neighborhood board showing recent civic reports
- Category filters for viewing different types of issues
- Report cards with issue location, status, and priority
- Admin mode for issue assignment and repair management
- Clear handoff visibility between citizens and municipal teams
- Mobile-friendly design with accessible controls and readable status labels

## Tech stack

React, JavaScript, Vite, React Router, CSS, LocalStorage, and Lucide React icons.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

Production checks:

```bash
npm run lint
npm run build
```

## Demo flow

1. Open the CivicLens homepage.
2. Click **Start a photo report**.
3. Upload a photo of a civic issue.
4. Choose an issue category such as Roads, Streetlights, Water, Waste, or Footpaths.
5. Add location details and submit the report.
6. Receive a report ID and view the current issue status.
7. Open the live board to explore recent neighborhood reports.
8. Select a report to follow its progress from reported to resolved.
9. Switch to **Admin mode** to manage assignments and update repair status.

## Architecture

CivicLens is structured around reusable React components for the reporting form, issue cards, status timelines, live-board filters, and admin controls.

Shared application state manages submitted reports, selected categories, report tracking, status changes, and simulated municipal updates. LocalStorage can be used to keep report data available between browser sessions without requiring a backend.

The UI is designed around a clear civic workflow:

```text
Citizen reports issue
        ↓
Photo and location are submitted
        ↓
Issue receives a tracking ID
        ↓
Municipal team assigns the request
        ↓
Repair status is updated
        ↓
Citizen sees verified resolution
```

## Future backend architecture

The current project is designed as a frontend demo using mock or local data. A production-ready version could include:

- Node.js and Express for REST APIs
- MongoDB or PostgreSQL for reports, users, and audit records
- Socket.IO for live repair-status updates
- JWT authentication for citizen and municipal accounts
- Cloud storage for uploaded issue photos
- Role-based access for administrators, field teams, and citizens
- Notification services for SMS, email, and push alerts
- GIS or map APIs for ward-level issue mapping

## Future improvements

- GPS-based location detection
- Interactive map of active civic reports
- Real-time notifications for report updates
- Photo validation and duplicate-report detection
- Multilingual support, including Telugu, Hindi, and Urdu
- Ward-wise analytics and municipal performance dashboards
- Citizen feedback and repair-rating system
- QR code-based report tracking
- Accessibility options such as high contrast, large text, and reduced motion
- Integration with official municipal grievance systems
