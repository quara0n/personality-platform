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
