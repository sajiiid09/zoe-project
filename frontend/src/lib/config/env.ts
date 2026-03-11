const required = (value: string | undefined, fallback: string) => value ?? fallback;

const apiBaseUrl = required(
  process.env.NEXT_PUBLIC_API_BASE_URL,
  "http://localhost:8000/api"
);

const pointsToLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
  apiBaseUrl
);

if (process.env.NODE_ENV === "production" && pointsToLocalhost) {
  console.warn(
    "[env] NEXT_PUBLIC_API_BASE_URL points to localhost in production. Set it to your public backend URL."
  );
}

export const env = {
  appName: required(process.env.NEXT_PUBLIC_APP_NAME, "Zoe Market"),
  apiBaseUrl,
  appOrigin: required(process.env.NEXT_PUBLIC_APP_ORIGIN, "http://localhost:3000"),
};
