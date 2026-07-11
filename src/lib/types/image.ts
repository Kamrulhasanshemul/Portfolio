export interface ImageMetadata {
	id: string;
	user_id: string;
	bucket_path: string;
	mime_type: string;
	file_size: number;
	created_at: string;
	url?: string; // Signed URL for display
}
