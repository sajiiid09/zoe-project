import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncClerkUser } from "../../../inngest/functions/syncClerkUser.js";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncClerkUser,
    /* your functions will be passed here later! */
  ],
});