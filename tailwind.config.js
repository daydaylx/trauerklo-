/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kl: {
          bg: "#0f0f12",
          fg: "#e6e6ea",
          accent: "#7dd3fc",
          muted: "#9aa0a6"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.12)"
      },
      keyframes: {
        wobble: {
          "0%,100%": { transform: "translateY(0) rotate(-0.6deg)" },
          "50%": { transform: "translateY(-1.5px) rotate(0.6deg)" }
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" }
        }
      },
      animation: {
        "wobble-slow": "wobble 2.4s ease-in-out infinite",
        "wobble-fast": "wobble 1.2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "blink": "blink 4.5s ease-in-out infinite"
      }
    },
  },
  plugins: [],
};
