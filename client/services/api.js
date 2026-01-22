import { getToken } from "@/utils/tokenStorage";

// NOTE: Physical device with Expo Go
// - Backend runs on your PC on port 6000
// - Replace 192.168.1.3 with your actual PC IPv4 if it changes
const BASE_URL = "http://192.168.1.3:6000/api";

// Helper function to create a timeout promise
const timeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), ms);
  });
};

export const apiRequest = async (endpoint, method, body) => {
  const token = await getToken();
  const url = `${BASE_URL}/${endpoint}`;

  try {
    // Log request body before sending
    if (body && body.completed !== undefined) {
      console.log('[API] Request body:', JSON.stringify(body), 'completed type:', typeof body.completed);
    }
    // Create a fetch promise with timeout (10 seconds)
    const fetchPromise = fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : null,
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetchPromise,
      timeout(10000), // 10 second timeout
    ]);

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      let errorMessage = "Something went wrong";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error:", error);

    // Handle timeout errors
    if (error.message === "Request timeout") {
      throw new Error(
        "Request timed out. Please check if the backend server is running on port 6000."
      );
    }

    // Handle network errors
    if (
      error.message === "Network request failed" ||
      error.message.includes("fetch")
    ) {
      throw new Error(
        `Unable to connect to server at ${BASE_URL}. Make sure your phone and PC are on the same Wi‑Fi and that port 6000 is open in the firewall.`
      );
    }
    throw error;
  }
};

