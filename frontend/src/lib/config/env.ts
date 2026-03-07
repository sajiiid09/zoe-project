const required = (value: string | undefined, fallback: string) => value ?? fallback;

export const env = {
  appName: required(process.env.NEXT_PUBLIC_APP_NAME, "Zoe Market"),
  apiBaseUrl: required(process.env.NEXT_PUBLIC_API_BASE_URL, "http://localhost:8000/api"),
  appOrigin: required(process.env.NEXT_PUBLIC_APP_ORIGIN, "http://localhost:3000"),
};
