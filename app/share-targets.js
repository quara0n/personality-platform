// Where the profile video can go when the browser cannot hand the file to the phone's share sheet (mostly PC).
// No social network lets a web page post a video for someone, so there are two kinds of target:
// `upload` opens the network's own upload page after the video is saved, `link` shares the site address.

/** Upload pages for the networks that take the saved file in a desktop browser. */
export const UPLOADS = [
  {id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/'},
  {id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/tiktokstudio/upload'},
  {id: 'messenger', name: 'Messenger', url: 'https://www.messenger.com/'}
];

/** Share links for `url` with the caption `text`; these networks only take a link from the web.
 *  E-mail opens the person's own mail program; a mailto link cannot attach the video, so on PC it is attached by hand. */
export function linkTargets(url, text, subject = 'Kaleido') {
  const u = encodeURIComponent(url), t = encodeURIComponent(text);
  return [
    {id: 'email', name: 'E-post', url: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${text}: ${url}`)}`},
    {id: 'facebook', name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${u}`},
    {id: 'whatsapp', name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`},
    {id: 'x', name: 'X', url: `https://x.com/intent/post?text=${t}&url=${u}`},
    {id: 'linkedin', name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
  ];
}

/** Caption that goes with the video: the end-card question and the site address. */
export const caption = (s, url) => `${s.end} ${s.cta}: ${url}`;

/** The row of apps in the share window, in the order people in Norway use them most (Rune 2026-10-21: «viser appen
 *  logo etc i en rekke» like other apps). `kind` says what a tap does:
 *  'link' opens `url` with the link filled in; 'paste' copies the link and opens `url`, for apps whose web page cannot
 *  take a link (Messenger on a computer); 'file' hands over the video file, for Instagram and TikTok, which only take
 *  a real video (the phone's share sheet, or a download plus the upload page on a computer). */
export function appTargets(url, text, {touch = false, subject = 'Kaleido'} = {}) {
  const u = encodeURIComponent(url), both = encodeURIComponent(`${text} ${url}`);
  return [
    touch ? {id: 'messenger', name: 'Messenger', kind: 'link', url: `fb-messenger://share/?link=${u}`} : {id: 'messenger', name: 'Messenger', kind: 'paste', url: 'https://www.messenger.com/'},
    {id: 'snapchat', name: 'Snapchat', kind: 'link', url: `https://www.snapchat.com/scan?attachmentUrl=${u}`},
    {id: 'instagram', name: 'Instagram', kind: 'file', url: 'https://www.instagram.com/'},
    {id: 'whatsapp', name: 'WhatsApp', kind: 'link', url: `https://wa.me/?text=${both}`},
    {id: 'facebook', name: 'Facebook', kind: 'link', url: `https://www.facebook.com/sharer/sharer.php?u=${u}`},
    {id: 'tiktok', name: 'TikTok', kind: 'file', url: 'https://www.tiktok.com/tiktokstudio/upload'},
    ...(touch ? [{id: 'sms', name: 'SMS', kind: 'link', url: `sms:?&body=${both}`}] : []),
    {id: 'email', name: 'E-post', kind: 'link', url: `mailto:?subject=${encodeURIComponent(subject)}&body=${both}`},
    {id: 'x', name: 'X', kind: 'link', url: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${u}`},
    {id: 'telegram', name: 'Telegram', kind: 'link', url: `https://t.me/share/url?url=${u}&text=${encodeURIComponent(text)}`},
    {id: 'linkedin', name: 'LinkedIn', kind: 'link', url: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
  ];
}
