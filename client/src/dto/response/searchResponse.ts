import type { SearchResponse } from "typesense/lib/Typesense/Documents";

export type SearchCollectionResponse = {
    subjects: SearchResponse<object>;
    departments: SearchResponse<object>;
    semsters: SearchResponse<object>;
    profiles: SearchResponse<object>;
}