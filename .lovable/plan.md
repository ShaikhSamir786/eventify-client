

# Complete Feature & UI Enhancement Plan

This plan covers all the suggested features and UI improvements in a single implementation pass.

---

## Part 1: Edit Event Page

**File: `src/pages/CreateEvent.tsx`**

Refactor the existing CreateEvent page to serve as both create and edit. When navigating to `/events/:id/edit`, it will:
- Detect the `id` param and fetch event data using `useGetEvent`
- Pre-fill the form with existing event data (title, description, date, location, emails)
- Switch the submit handler to call `useUpdateEvent` instead of `useCreateEvent`
- Update heading text to "Edit Event" and button text to "Save Changes"

---

## Part 2: Notifications Dropdown

**New file: `src/components/dashboard/NotificationsDropdown.tsx`**

Build a functional notifications dropdown for the dashboard header bell icon:
- Uses `useGetInvitedEvents` to show recent event invitations as notifications
- Each notification shows event title, creator name, and relative time (using `date-fns`)
- Read/unread visual state (stored in local component state)
- "Mark all as read" action
- Empty state when no notifications
- Badge count on bell icon showing unread count

**File: `src/components/dashboard/DashboardLayout.tsx`**
- Replace the static bell button with the new `NotificationsDropdown` component

---

## Part 3: Dashboard UI Polish

**File: `src/pages/Dashboard.tsx`**

- **Animated count-up stats**: Add a `useCountUp` hook that animates numbers from 0 to their target value using `requestAnimationFrame`
- **Color-coded event card left borders**: Add a left accent border to event rows -- blue for upcoming, green for today, gray for past
- **Better loading skeletons**: Replace plain `animate-pulse` divs with content-shaped skeletons (icon placeholder, text lines, badge shapes) using the Skeleton component

---

## Part 4: Sidebar Active Indicator Animation

**File: `src/components/dashboard/DashboardLayout.tsx`**

- Add a `motion.div` with `layoutId="sidebar-active"` behind the active nav item to create a smooth sliding background indicator when navigating between pages

---

## Part 5: Landing Page -- Testimonials Section

**New file: `src/components/landing/Testimonials.tsx`**

- Section with 3 testimonial cards showing avatar, name, role, and quote
- Uses static placeholder data
- Animated entrance with staggered `framer-motion` variants
- Star ratings on each card

---

## Part 6: Landing Page -- Pricing Section

**New file: `src/components/landing/Pricing.tsx`**

- 3-tier pricing layout (Free, Pro, Enterprise)
- Feature list with checkmarks for each tier
- "Most Popular" badge on the Pro tier
- Gradient border highlight on the featured plan
- CTA buttons linking to `/register`

**File: `src/pages/Index.tsx`**
- Add `<Testimonials />` and `<Pricing />` between HowItWorks and CTA sections

---

## Part 7: Editable Profile in Settings

**File: `src/pages/Settings.tsx`**

- Convert the read-only profile info section to an editable form with "Edit Profile" toggle button
- When editing, show Input fields for first name and last name
- Save button calls a new `UPDATE_PROFILE` GraphQL mutation (defined but gracefully handles if backend doesn't support it yet)
- Cancel button reverts to read-only view

---

## Part 8: Content-Shaped Loading Skeletons

**File: `src/pages/Events.tsx`**

- Replace generic `animate-pulse` divs with structured skeleton cards matching the EventCard layout (icon, title line, description line, metadata row)

**File: `src/pages/EventDetails.tsx`**

- Replace the loading skeleton with a layout-matched skeleton (header, details card, participants card shapes)

---

## Technical Details

### Files Created (5)
- `src/components/dashboard/NotificationsDropdown.tsx`
- `src/components/landing/Testimonials.tsx`
- `src/components/landing/Pricing.tsx`
- `src/hooks/useCountUp.ts`
- `src/lib/graphql/mutations/profile.ts` (UPDATE_PROFILE mutation)

### Files Modified (6)
- `src/pages/CreateEvent.tsx` -- dual create/edit mode
- `src/pages/Dashboard.tsx` -- count-up stats, color borders, better skeletons
- `src/pages/Events.tsx` -- content-shaped skeletons
- `src/pages/EventDetails.tsx` -- improved loading skeleton
- `src/pages/Settings.tsx` -- editable profile form
- `src/pages/Index.tsx` -- add Testimonials and Pricing sections
- `src/components/dashboard/DashboardLayout.tsx` -- notifications dropdown, animated sidebar indicator
- `src/lib/graphql/queries.ts` -- add UPDATE_PROFILE mutation

### Dependencies
- No new dependencies needed. Uses existing `framer-motion`, `date-fns`, `lucide-react`, and shadcn/ui components.

### Patterns
- All new components follow existing patterns: `framer-motion` entrance animations, `bg-card rounded-2xl border border-border p-6` card styling, color tokens from the design system
- GraphQL mutations follow existing hook patterns with error handling via `getErrorMessage`
- Edit mode detection via `useParams` matching the existing `/events/:id/edit` route already defined in App.tsx

