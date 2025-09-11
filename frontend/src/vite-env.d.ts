
// /// <reference types="vite/client" />

// interface ImportMetaEnv {
//   readonly VITE_GOOGLE_MAPS_API_KEY: string
//   // Add other VITE_ environment variables here as needed
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }

// may need to implement origin of bin scans in farm blocks for the day, as it occurs not now


/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
