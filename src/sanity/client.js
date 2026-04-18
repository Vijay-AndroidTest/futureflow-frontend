import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "rrjf4tuc",
  dataset: "production",
  apiVersion: "2024-04-13",
  useCdn: false,
});