

# Improve OTP Pop-up UI

Enhance both the OTP Verification Modal and Reset Password Modal with a more polished, modern design using animations, better visual hierarchy, and improved input styling.

## Changes

### 1. Styled OTP Input Slots
- Increase slot size from `h-10 w-10` to `h-12 w-12` with larger text
- Add a subtle glow/border effect on the active slot using the primary color
- Add rounded corners and spacing between individual slots instead of connected borders
- Apply a glass-morphism background tint to each slot for depth

### 2. Animated Transitions (framer-motion)
- Add entrance animation (fade + slide up) to the modal icon and content
- Animate the success checkmark with a scale-in bounce effect
- Add a subtle shake animation on the OTP group when an error occurs

### 3. Better Visual Hierarchy
- Add a masked email display (e.g., `j***@example.com`) styled as a highlighted pill/badge
- Add a circular countdown timer ring around the resend cooldown number
- Style the resend section with a subtle divider line above it

### 4. Success State Enhancement
- Add animated confetti dots or sparkle particles behind the success checkmark
- Smooth transition from verification view to success view

### 5. Reset Password Modal Improvements
- Apply the same OTP slot styling and animations
- Add a password strength indicator bar below the new password field
- Visual step indicator showing "Step 1: Enter Code" and "Step 2: New Password"

## Files Modified

- **`src/components/ui/input-otp.tsx`** -- Restyle the `InputOTPSlot` with larger size, rounded corners, gap between slots, and primary-colored active ring
- **`src/components/auth/OTPVerificationModal.tsx`** -- Add framer-motion animations (icon entrance, error shake, success scale), masked email badge, circular countdown timer, improved layout spacing
- **`src/components/auth/ResetPasswordModal.tsx`** -- Same animation improvements, add password strength indicator bar, add step indicator UI

## Technical Details

- Use `framer-motion` (already installed) for `motion.div` wrappers with `initial`/`animate` props
- Password strength calculated from length + character variety (uppercase, numbers, symbols) displayed as a colored progress bar
- OTP slots styled individually with `rounded-lg` and `gap-2` instead of connected border style
- All changes use existing design tokens (`--primary`, `--success`, `--destructive`) for theme consistency in both light and dark mode

