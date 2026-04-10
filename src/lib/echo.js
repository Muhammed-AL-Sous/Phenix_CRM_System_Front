import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const scheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";
const envHost = import.meta.env.VITE_REVERB_HOST ?? "127.0.0.1";
const envPort = Number(import.meta.env.VITE_REVERB_PORT) || 8080;

/**
 * pusher-js forces TLS (wss) when the page is loaded over https, and then uses
 * wssPort (default 443) unless both wsPort and wssPort are set. Reverb on :8080
 * is plain ws — so wss://localhost:443 fails. In dev, route WebSocket through
 * the Vite server (see vite.config.js proxy "/app") so ws/wss hit :5173 and
 * forward to Reverb.
 */
function reverbClientOptions() {
  if (import.meta.env.DEV && typeof window !== "undefined") {
    const { hostname, port: locPort, protocol } = window.location;
    const port = locPort
      ? Number(locPort)
      : protocol === "https:"
        ? 443
        : 80;
    return {
      wsHost: hostname,
      wsPort: port,
      wssPort: port,
      forceTLS: scheme === "https",
    };
  }
  return {
    wsHost: envHost,
    wsPort: envPort,
    wssPort: envPort,
    forceTLS: scheme === "https",
  };
}

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  ...reverbClientOptions(),
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
