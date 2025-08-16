# 209.works Testing Checklist

## 🧪 User Flows to Test

### 1. Authentication & Onboarding Flow
- [ ] **Sign Up Process**
  - [ ] Navigate to `/sign-up`
  - [ ] Create a new account with email/password
  - [ ] Verify email confirmation (if enabled)
  - [ ] Should redirect to `/onboarding` after signup

- [ ] **Onboarding**
  - [ ] Select "Job Seeker" role
  - [ ] Click Continue
  - [ ] Should redirect to `/dashboard`
  - [ ] Test selecting "Employer" role
  - [ ] Should redirect to `/employer`

- [ ] **Sign In Process**
  - [ ] Navigate to `/sign-in`
  - [ ] Sign in with existing account
  - [ ] Should redirect based on user role

### 2. Job Seeker Dashboard (`/dashboard`)
- [ ] **Profile Alerts**
  - [ ] Profile completion alert should show if < 100%
  - [ ] Resume upload alert should show if no resume
  - [ ] Progress bar should reflect actual completion

- [ ] **Stats Cards**
  - [ ] All stats should display properly
  - [ ] Click stats to see if any are interactive

- [ ] **Quick Actions**
  - [ ] "Search Jobs" → should navigate to `/jobs`
  - [ ] "Update Profile" → should navigate to `/profile`
  - [ ] "My Applications" → should navigate to `/applications`

- [ ] **Tabs**
  - [ ] Overview tab shows recent applications and recommendations
  - [ ] Applications tab lists all applications
  - [ ] Recommendations tab shows AI matches
  - [ ] Activity tab (placeholder for now)

### 3. Profile Management (`/profile`)
- [ ] **Edit Mode**
  - [ ] Click "Edit Profile" button
  - [ ] All fields should become editable
  - [ ] Click "Save Changes"
  - [ ] Fields should become read-only again

- [ ] **Personal Tab**
  - [ ] Fill in all personal information fields
  - [ ] Add social links (website, LinkedIn, GitHub)
  - [ ] Progress bar should update

- [ ] **Experience Tab**
  - [ ] View existing experience
  - [ ] In edit mode: "Add Experience" button should appear
  - [ ] Delete button (X) should appear on experiences

- [ ] **Education Tab**
  - [ ] View existing education
  - [ ] In edit mode: "Add Education" button should appear
  - [ ] Delete button (X) should appear on education items

- [ ] **Skills Tab**
  - [ ] Add new skills by typing and clicking "Add"
  - [ ] Press Enter to add skill
  - [ ] Remove skills by clicking X (in edit mode)

- [ ] **Resume Tab**
  - [ ] Click "Choose File" button
  - [ ] Select a PDF/DOC/DOCX file
  - [ ] File info should display
  - [ ] In edit mode: X button should remove file

### 4. Job Browsing (`/jobs`)
- [ ] **Search & Filters**
  - [ ] Search by job title or company
  - [ ] Filter by location (with distance slider)
  - [ ] Filter by job type (Full-time, Part-time, etc.)
  - [ ] Filter by category
  - [ ] Toggle "Remote only"
  - [ ] Clear all filters

- [ ] **View Toggle**
  - [ ] Switch between Grid and List view
  - [ ] Toggle "Show AI-Enhanced Cards"

- [ ] **Job Cards**
  - [ ] Regular cards show basic info
  - [ ] AI-enhanced cards show match score and reasons
  - [ ] Click card to go to job details

### 5. Job Details (`/jobs/[id]`)
- [ ] **Navigation**
  - [ ] "Back to Jobs" button works
  - [ ] Job information displays correctly

- [ ] **Actions**
  - [ ] "Apply Now" opens application modal
  - [ ] "Save" toggles between Save/Saved
  - [ ] "Share" button (functionality pending)
  - [ ] "AI Analysis" opens match analysis dialog

- [ ] **AI Analysis Dialog**
  - [ ] Shows match percentage
  - [ ] Displays skill/experience/location match
  - [ ] Lists key strengths

- [ ] **Similar Jobs**
  - [ ] Shows 3 similar jobs at bottom
  - [ ] Click to navigate to other jobs

### 6. Job Application Flow
- [ ] **Application Modal - Step 1**
  - [ ] Pre-fills name and email from Clerk
  - [ ] Add phone number
  - [ ] Choose "Use existing resume" or "Upload new"
  - [ ] If upload new: file picker works
  - [ ] Add optional cover letter
  - [ ] "Next" button enables when required fields filled

- [ ] **Application Modal - Step 2**
  - [ ] Review application summary
  - [ ] Check "authorized to work" checkbox
  - [ ] Check "agree to terms" checkbox
  - [ ] "Submit Application" enables when both checked

- [ ] **Application Modal - Step 3**
  - [ ] Success message displays
  - [ ] Modal auto-closes after 2 seconds
  - [ ] "Apply Now" button changes to "Applied" (disabled)

### 7. Applications Tracking (`/applications`)
- [ ] **Stats Cards**
  - [ ] Click stats cards to filter by status
  - [ ] Numbers should match filtered results

- [ ] **Search & Sort**
  - [ ] Search by job title or company
  - [ ] Filter by status dropdown
  - [ ] Sort by date/company/status

- [ ] **Application Cards**
  - [ ] Status badges show correct icon/color
  - [ ] "View Job" navigates to job detail
  - [ ] "View Application" (placeholder for now)

### 8. Employer Dashboard (`/employer`)
- [ ] **Stats Overview**
  - [ ] All stats cards display
  - [ ] Numbers are visible

- [ ] **Actions**
  - [ ] "Post New Job" button is visible

- [ ] **Tabs**
  - [ ] Overview shows recent activity
  - [ ] Active Jobs lists job postings
  - [ ] Applications/Analytics show placeholder

### 9. Navigation & Routing
- [ ] **Protected Routes**
  - [ ] Try accessing `/dashboard` when logged out → redirects to `/sign-in`
  - [ ] Try accessing `/profile` when logged out → redirects to `/sign-in`
  - [ ] Try accessing `/applications` when logged out → redirects to `/sign-in`
  - [ ] Try accessing `/employer` as job seeker → stays on job seeker dashboard

- [ ] **Public Routes**
  - [ ] `/` (home) accessible without login
  - [ ] `/jobs` accessible without login
  - [ ] `/jobs/[id]` accessible without login

### 10. Responsive Design
- [ ] **Mobile (< 768px)**
  - [ ] Navigation menu works
  - [ ] Cards stack properly
  - [ ] Modals are scrollable
  - [ ] Forms are usable

- [ ] **Tablet (768px - 1024px)**
  - [ ] Grid layouts adjust
  - [ ] Sidebar becomes bottom section

- [ ] **Desktop (> 1024px)**
  - [ ] Full layouts display
  - [ ] Sidebars show properly

## 🐛 Known Issues to Verify

1. **Onboarding Error**: Should now be caught and handled gracefully
2. **Clerk Metadata**: User role should persist after onboarding
3. **Resume Upload**: Currently UI only (no actual upload)
4. **Mock Data**: All data is hardcoded, no persistence

## 🚀 Performance Checks

- [ ] Page load times are reasonable
- [ ] No console errors in browser
- [ ] Smooth transitions between pages
- [ ] Modals open/close smoothly
- [ ] Search/filter updates quickly

## 📱 Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## 🔒 Security Checks

- [ ] Protected routes redirect when not authenticated
- [ ] User can only see their own data
- [ ] No sensitive data in console logs
- [ ] Clerk authentication working properly

## Notes

- Currently using mock data - database integration pending
- Email notifications not implemented
- Payment system not implemented
- File uploads are UI-only
- Some buttons/features are placeholders