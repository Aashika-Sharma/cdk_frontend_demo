// services/api.ts
export const fetchEngineNames = async (): Promise<string[]> => {
    return ["mysql", "postgres", "snowflake"];
  };
