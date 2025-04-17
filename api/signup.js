import { createClient } from "@supabase/supabase-js";
import getRawBody from "raw-body";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ message: "Method Not Allowed" }));
  }

  try {
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());
    const { email } = body;

    if (!email || typeof email !== "string") {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid email" }));
    }

    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      if (error.code === "23505") {
        res.statusCode = 409;
        return res.end(JSON.stringify({ message: "Already signed up" }));
      }
      res.statusCode = 500;
      return res.end(JSON.stringify({ message: "Error inserting", error }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Signed up successfully" }));
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ message: "Unexpected error", error: err.message })
    );
  }
}
