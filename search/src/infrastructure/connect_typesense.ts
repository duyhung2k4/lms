import { Client } from "typesense";

const typesenseAdminClient = new Client({
  nodes: [
    {
      host: 'localhost', // hoặc IP/host của server
      port: 8108,
      protocol: 'http'
    }
  ],
  apiKey: 'XEh2vla5fsBBIG3scTtNmIrhkrXogiTY', // Admin API Key
  connectionTimeoutSeconds: 2
});

const typesenseSearchClient = new Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http'
    }
  ],
  apiKey: 'K7iyLuywV7EVfr5nOgkFDLuQzkGRHBxI',
  connectionTimeoutSeconds: 2
});

export const typesenseClient = {
    typesenseAdminClient,
    typesenseSearchClient,
}