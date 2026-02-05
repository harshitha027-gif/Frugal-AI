-- Add missing columns for the new Tool Submission Flow
-- Run this entire script in your Supabase SQL Editor

-- 1. Core Fields
ALTER TABLE tools ADD COLUMN IF NOT EXISTS destination_url TEXT; 
ALTER TABLE tools ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS description_md TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS license_url TEXT;

-- 2. Hardware & Requirements
ALTER TABLE tools ADD COLUMN IF NOT EXISTS min_ram TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS storage_footprint TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_offline_capable BOOLEAN DEFAULT FALSE;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS gpu_vram TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS supported_hardware TEXT[];
ALTER TABLE tools ADD COLUMN IF NOT EXISTS deployment_context TEXT[];

-- 3. Evidence & Admin
ALTER TABLE tools ADD COLUMN IF NOT EXISTS efficiency_justification TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS efficiency_evidence_links TEXT[];
ALTER TABLE tools ADD COLUMN IF NOT EXISTS admin_feedback TEXT;

-- 4. Ensure status can accept new values if it's an enum (Optional, safe to run if text)
-- If status is a check constraint or enum, you might need to update it. 
-- For now we assume existing status column is TEXT or flexible enough.

-- 5. Frugal AI Index Scores
ALTER TABLE tools ADD COLUMN IF NOT EXISTS frugal_score_total INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS score_footprint INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS score_hardware INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS score_energy INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS score_tco INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS score_data INTEGER DEFAULT 0;

-- 6. Vetting Results
ALTER TABLE tools ADD COLUMN IF NOT EXISTS vetting_results JSONB DEFAULT '{}'::jsonb;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 7. Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'view_tool', 'click_outbound', 'form_start'
    tool_id UUID REFERENCES tools(id),
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics speed
CREATE INDEX IF NOT EXISTS idx_analytics_tool_id ON analytics_events(tool_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
