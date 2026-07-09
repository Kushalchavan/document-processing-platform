-- Migration: Add file path column to documents table 
ALTER TABLE documents
ADD COLUMN file_path VARCHAR(500) NOT NULL DEFAULT '';