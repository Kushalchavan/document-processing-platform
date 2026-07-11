-- Adding column in document chunks for embeddings 
ALTER TABLE document_chunks
ADD COLUMN embedding vector(768);