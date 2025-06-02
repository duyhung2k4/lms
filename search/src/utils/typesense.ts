import { SearchResponse } from "typesense/lib/Typesense/Documents";
import { typesenseClient } from "../infrastructure/connect_typesense";

export const searchCollections = async (q: string) => {
    const listQuery: Promise<SearchResponse<object>>[] = [];
    const collectionName = ["subjects", "departments", "semesters", "profiles"];
    collectionName.map(item => {
        listQuery.push(typesenseClient.typesenseSearchClient
            .collections(item)
            .documents()
            .search({
                q: q.toString(),
                query_by: "*"
            }))
    });

    const [subjects, departments, semsters, profiles] = await Promise.all(listQuery);

    return {
        subjects,
        departments,
        semsters,
        profiles,
    };
}