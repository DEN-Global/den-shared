# DEN pet notification companion

The manager and rider workspaces show an original radio-themed DEN pet inspired by the bold red-and-black reference the user shared. It surfaces new order and available-delivery notices, speaks new notices only while that workspace is in the foreground when Voice is on, and can be muted independently.

## Background alerts

Managers and riders can opt in from the companion card. DEN registers a root-scoped service worker, requests browser notification permission from that user action, and stores the user's encrypted Web Push subscription in D1. The subscription endpoint is a capability URL; the database stores a one-way hash for lookup and encrypts the full subscription with the existing server encryption key. Push delivery uses VAPID credentials and sends only short order summaries. The local development server generates a stable local VAPID key pair in its ignored `.data/local-config.json`.

The Cloudflare Worker needs `DEN_VAPID_PUBLIC_KEY` as a text variable and `VAPID_PRIVATE_KEY` as a Worker secret. Set `DEN_VAPID_SUBJECT` to a contact URI for the application server. Without those bindings, background push is disabled. Use a separate VAPID key pair per environment and never commit the private key.

Web Push can show a system notification when the app is not loaded, after the user grants permission and subscribes. The operating system and browser decide whether to show or mute it; DEN cannot bypass Do Not Disturb. A service worker cannot speak a voice alert while the page is closed. Speech is available only while the manager or rider workspace is open and focused.
