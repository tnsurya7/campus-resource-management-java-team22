-- ============================================
-- Database Schema Update Script
-- Campus Resource Management System
-- ============================================
-- This script updates the bookings table to support new time slots and booking statuses
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing constraints
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_time_slot_check;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Step 2: Add rejection_reason column if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500);

-- Step 3: Add new constraints with updated values
ALTER TABLE bookings ADD CONSTRAINT bookings_time_slot_check 
  CHECK (time_slot IN (
    'MORNING',      -- Legacy: Morning slot
    'AFTERNOON',    -- Legacy: Afternoon slot  
    'ONE_HOUR',     -- New: 1 hour (Students & Staff)
    'TWO_HOURS',    -- New: 2 hours (Students & Staff)
    'THREE_HOURS',  -- New: 3 hours (Students & Staff)
    'FOUR_HOURS',   -- New: 4 hours (Staff only)
    'FIVE_HOURS',   -- New: 5 hours (Staff only)
    'FULL_DAY'      -- Full day (Staff only)
  ));

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN (
    'PENDING',      -- Waiting for staff approval
    'APPROVED',     -- Approved by staff
    'REJECTED'      -- Rejected by staff
  ));

-- Step 4: Update existing bookings status to APPROVED if they don't have a status
UPDATE bookings SET status = 'APPROVED' WHERE status IS NULL;

-- Step 5: Verify the changes
SELECT 
  constraint_name, 
  check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name IN ('bookings_time_slot_check', 'bookings_status_check');

-- Success message
SELECT 'Database constraints updated successfully!' as message;
