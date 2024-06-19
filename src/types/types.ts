export interface OpenLibraryResponse {
  docs: Doc[];
}

export interface Doc {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  number_of_pages_median?: number;
}
