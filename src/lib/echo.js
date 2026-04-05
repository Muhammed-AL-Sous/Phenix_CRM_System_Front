import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
  authEndpoint: "/api/broadcasting/auth", // ✅ يمر عبر الـ proxy
  auth: {
    withCredentials: true,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      get "X-XSRF-TOKEN"() {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : "";
      },
    },
  },
});

export default echo;
