-- Update docuement table by adding extracted_text column
ALTER TABLE documents
ADD COLUMN extracted_text TEXT;