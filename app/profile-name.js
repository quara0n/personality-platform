// Profile name, e.g. "The Warm Hermit" / "Den varme eneboeren": a playful, shareable label that
// describes the scores, not a type. Built from the facets that sit furthest from the middle
// (percentile 50), so it can catch the small extremes that make a profile recognisable.
// 1. A hand-written signature name when two of the most distinctive facets form a known pairing.
// 2. Otherwise "<adjective> <noun>": the noun from the most distinctive facet, the adjective from
//    the most distinctive facet in another trait. One distinctive facet gives the noun alone.
// 3. No facet outside the middle range gives a balanced name.
// [English, Norwegian bokmål]; editorial copy written to be warm and a little cheeky, never a
// diagnosis. No MBTI letters or names. Flagged for the same professional review as the
// combination sentences.
import {standouts} from './combination-copy.js';

// code+direction: [English adjective, Norwegian definite adjective, English noun, Norwegian definite noun].
// Norwegian nouns are all common gender, so "Den <adjektiv> <substantiv>" always fits.
const words = {
  O1h: ['Dreamy', 'drømmende', 'Daydreamer', 'dagdrømmeren'],
  O1l: ['Down-to-Earth', 'jordnære', 'Realist', 'realisten'],
  O2h: ['Artistic', 'kunstneriske', 'Aesthete', 'estetikeren'],
  O2l: ['Unfussy', 'ukompliserte', 'Pragmatist', 'pragmatikeren'],
  O3h: ['Heartfelt', 'inderlige', 'Romantic', 'romantikeren'],
  O3l: ['Level-Headed', 'nøkterne', 'Stoic', 'stoikeren'],
  O4h: ['Adventurous', 'eventyrlystne', 'Adventurer', 'eventyreren'],
  O4l: ['Routine-Loving', 'rutinekjære', 'Regular', 'stamgjesten'],
  O5h: ['Curious', 'nysgjerrige', 'Philosopher', 'filosofen'],
  O5l: ['Hands-On', 'praktiske', 'Practitioner', 'praktikeren'],
  O6h: ['Free-Thinking', 'frisinnede', 'Rebel', 'opprøreren'],
  O6l: ['Traditional', 'tradisjonsbevisste', 'Tradition Keeper', 'tradisjonsbæreren'],
  C1h: ['Capable', 'handlekraftige', 'Problem Solver', 'problemknuseren'],
  C1l: ['Unassuming', 'ydmyke', 'Apprentice', 'lærlingen'],
  C2h: ['Tidy', 'ryddige', 'Organiser', 'systematikeren'],
  C2l: ['Creatively Chaotic', 'kreativt kaotiske', 'Chaos Pilot', 'kaospiloten'],
  C3h: ['Dependable', 'pålitelige', 'Promise Keeper', 'ordholderen'],
  C3l: ['Spontaneous', 'spontane', 'Free Spirit', 'frifuglen'],
  C4h: ['Ambitious', 'ambisiøse', 'Goal Hunter', 'måljegeren'],
  C4l: ['Contented', 'tilfredse', 'Bon Vivant', 'livsnyteren'],
  C5h: ['Disciplined', 'disiplinerte', 'Finisher', 'fullføreren'],
  C5l: ['Easily Sidetracked', 'distré', 'Last-Minute Artist', 'sisteliten-kunstneren'],
  C6h: ['Careful', 'varsomme', 'Safety Officer', 'sikkerhetssjefen'],
  C6l: ['Impulsive', 'impulsive', 'Improviser', 'improvisatoren'],
  E1h: ['Warm', 'varme', 'Charmer', 'sjarmøren'],
  E1l: ['Reserved', 'reserverte', 'Sphinx', 'sfinksen'],
  E2h: ['Sociable', 'selskapelige', 'Party Lion', 'festløven'],
  E2l: ['Stay-at-Home', 'hjemmekjære', 'Hermit', 'eneboeren'],
  E3h: ['Assertive', 'bestemte', 'Captain', 'kapteinen'],
  E3l: ['Low-Key', 'lavmælte', 'Backstage Hero', 'kulissehelten'],
  E4h: ['Busy', 'travle', 'Whirlwind', 'virvelvinden'],
  E4l: ['Laid-Back', 'avslappede', 'Stroller', 'slentreren'],
  E5h: ['Daring', 'dristige', 'Daredevil', 'våghalsen'],
  E5l: ['Peace-Loving', 'fredelige', 'Comfort Connoisseur', 'kosemesteren'],
  E6h: ['Cheerful', 'blide', 'Ray of Sunshine', 'solstrålen'],
  E6l: ['Deadpan', 'tørrvittige', 'Straight Face', 'alvorsmesteren'],
  A1h: ['Trusting', 'tillitsfulle', 'Idealist', 'idealisten'],
  A1l: ['Sceptical', 'skeptiske', 'Detective', 'detektiven'],
  A2h: ['Honest', 'ærlige', 'Knight of Fair Play', 'fair play-ridderen'],
  A2l: ['Crafty', 'lure', 'Fox', 'reven'],
  A3h: ['Generous', 'gavmilde', 'Guardian Angel', 'skytsengelen'],
  A3l: ['Self-Reliant', 'selvhjulpne', 'Self-Starter', 'selvbergeren'],
  A4h: ['Accommodating', 'imøtekommende', 'Peacemaker', 'fredsmegleren'],
  A4l: ['Feisty', 'stridbare', 'Debater', 'debattanten'],
  A5h: ['Modest', 'beskjedne', 'Everyday Hero', 'hverdagshelten'],
  A5l: ['Self-Assured', 'selvsikre', 'Star', 'stjernen'],
  A6h: ['Soft-Hearted', 'bløthjertede', 'Comforter', 'trøsteren'],
  A6l: ['Clear-Eyed', 'klarsynte', 'Strategist', 'strategen'],
  N1h: ['Watchful', 'årvåkne', 'Worrier', 'grubleren'],
  N1l: ['Unflappable', 'uforskrekkede', 'Zen Master', 'zenmesteren'],
  N2h: ['Fiery', 'fyrrige', 'Volcano', 'vulkanen'],
  N2l: ['Patient', 'tålmodige', 'Diplomat', 'diplomaten'],
  N3h: ['Melancholic', 'melankolske', 'Poet', 'poeten'],
  N3l: ['Hopeful', 'håpefulle', 'Optimist', 'optimisten'],
  N4h: ['Shy', 'sjenerte', 'Wallflower', 'veggblomsten'],
  N4l: ['Unabashed', 'frimodige', 'Entertainer', 'entertaineren'],
  N5h: ['Pleasure-Loving', 'livsglade', 'Hedonist', 'hedonisten'],
  N5l: ['Moderate', 'måteholdne', 'Monk', 'munken'],
  N6h: ['Sensitive', 'følsomme', 'Seismograph', 'seismografen'],
  N6l: ['Steady', 'stødige', 'Rock', 'klippen']
};

// Signature names for pairings that say more together than apart. [facet, facet, English, Norwegian]
const signatures = [
  ['E1h', 'E2l', 'The Warm Hermit', 'Den varme eneboeren'],
  ['E2h', 'N4h', 'The Shy Party Lion', 'Den sjenerte festløven'],
  ['E3h', 'N1h', 'The Captain with Butterflies', 'Kapteinen med sommerfugler i magen'],
  ['E3h', 'A5h', 'The Humble Captain', 'Den beskjedne kapteinen'],
  ['E5h', 'C6h', 'The Careful Daredevil', 'Den forsiktige våghalsen'],
  ['O4h', 'C6h', 'The Adventurer with a First-Aid Kit', 'Eventyreren med førstehjelpsskrin'],
  ['E5h', 'A6h', 'The Soft-Hearted Daredevil', 'Våghalsen med det myke hjertet'],
  ['E5h', 'N1l', 'The Unflappable Thrill-Seeker', 'Den uforskrekkede adrenalinjegeren'],
  ['O1h', 'C2h', 'The Daydreamer with a Label Maker', 'Dagdrømmeren med merkemaskin'],
  ['O1h', 'C2l', 'The Creative Chaos Pilot', 'Den kreative kaospiloten'],
  ['O1h', 'E4l', 'The Sofa Daydreamer', 'Dagdrømmeren i sofakroken'],
  ['O2h', 'C2h', 'The Aesthete with Alphabetised Shelves', 'Estetikeren med alfabetisk bokhylle'],
  ['O5h', 'E2l', 'The Reading-Nook Philosopher', 'Filosofen i lesekroken'],
  ['O5h', 'A4l', "The Devil's Advocate", 'Djevelens advokat'],
  ['C4h', 'C5l', 'The Ambitious Last-Minute Artist', 'Den ambisiøse sisteliten-kunstneren'],
  ['C4h', 'A5h', 'The Quiet High Achiever', 'Den stille stjernen'],
  ['E4h', 'C5l', 'The Whirlwind with Ten Tabs Open', 'Virvelvinden med ti faner åpne'],
  ['N5h', 'C5l', 'The Just-One-More-Episode Enthusiast', 'Bare-én-episode-til-entusiasten'],
  ['A3h', 'N1h', 'The Worried Guardian Angel', 'Den bekymrede skytsengelen'],
  ['A3h', 'N2h', 'The Volcano with a Heart of Gold', 'Vulkanen med gullhjerte'],
  ['A3h', 'N6l', 'The Calm in the Storm', 'Roen i stormen'],
  ['A3h', 'C3h', 'The Rock Everyone Calls', 'Klippen alle ringer til'],
  ['A6h', 'N6h', 'The Tender Soul', 'Den ømme sjelen'],
  ['E6h', 'N1h', 'The Cheerful Worrier', 'Den blide grubleren'],
  ['E6h', 'A3h', 'The Ray of Sunshine Who Shows Up', 'Solstrålen som stiller opp'],
  ['A1l', 'C6h', 'The Careful Detective', 'Den grundige detektiven'],
  ['A2l', 'E1h', 'The Charming Fox', 'Den sjarmerende reven'],
  ['N4l', 'E2h', 'The Life of the Party', 'Midtpunktet i festen'],
  ['N5l', 'C5h', 'The Monk with a Plan', 'Munken med en plan'],
  ['O6h', 'A2h', 'The Rebel with a Cause', 'Opprøreren med en sak']
];

// One-line closers for the share video, per signature. [English, Norwegian]
const signatureLines = {
  'E1h-E2l': ["Loves people. One at a time. Preferably at home.", "Elsker folk. Én om gangen. Helst hjemme."],
  'E2h-N4h': ["First to the party, last to take the mic.", "Først på festen, sist til mikrofonen."],
  'E3h-N1h': ["Leads the way, with a quiet plan B in the pocket.", "Går først, med en stille plan B i lomma."],
  'E3h-A5h': ["Takes charge, then gives everyone else the credit.", "Tar styringen, og gir æren til alle andre."],
  'E5h-C6h': ["Jumps out of planes. After checking the parachute twice.", "Hopper i fallskjerm. Etter å ha sjekket skjermen to ganger."],
  'O4h-C6h': ["Off on an adventure. With plasters for everyone.", "Drar på eventyr. Med plaster til alle."],
  'E5h-A6h': ["Up for anything, and the first to check you're okay.", "Med på alt, og først til å spørre om du har det bra."],
  'E5h-N1l': ["Says 'how hard can it be?' and means it.", "Sier «hvor vanskelig kan det være?» og mener det."],
  'O1h-C2h': ["Dreams in colour. Files the dreams by colour too.", "Drømmer i farger. Sorterer drømmene etter farge også."],
  'O1h-C2l': ["Ideas everywhere. Including under the sofa.", "Ideer overalt. Også under sofaen."],
  'O1h-E4l': ["Has travelled the world without leaving the blanket.", "Har reist jorda rundt uten å forlate pleddet."],
  'O2h-C2h': ["Art on the walls. Spines lined up perfectly.", "Kunst på veggene. Bokryggene i perfekt rekke."],
  'O5h-E2l': ["Best conversations: with a book and a cup of tea.", "Beste samtalene: med en bok og en kopp te."],
  'O5h-A4l': ["Agrees with you. Just not yet.", "Er enig med deg. Bare ikke ennå."],
  'C4h-C5l': ["Big goals. Starts tomorrow. Delivers at 23:59.", "Store mål. Begynner i morgen. Leverer 23.59."],
  'C4h-A5h': ["Does great things and hopes nobody makes a fuss.", "Gjør store ting og håper ingen lager noe styr."],
  'E4h-C5l': ["Doing five things at once. All of them fun.", "Holder på med fem ting samtidig. Alle er gøy."],
  'N5h-C5l': ["Knows exactly how many episodes 'just one more' is.", "Vet nøyaktig hvor mange episoder «bare én til» er."],
  'A3h-N1h': ["Worries about you so you don't have to.", "Bekymrer seg for deg, så du slipper."],
  'A3h-N2h': ["Boils over fast. Would still give you the last slice.", "Koker fort over. Gir deg likevel det siste kakestykket."],
  'A3h-N6l': ["When everything shakes, this is who you call.", "Når alt rister, er det denne du ringer."],
  'A3h-C3h': ["Says yes. And then actually turns up.", "Sier ja. Og møter faktisk opp."],
  'A6h-N6h': ["Feels everything, and holds space for everyone.", "Kjenner alt, og har plass til alle."],
  'E6h-N1h': ["Smiling on the outside, running scenarios on the inside.", "Smiler utenpå, kjører scenarioer inni."],
  'E6h-A3h': ["Brightens the room, then helps clear the table.", "Lyser opp rommet, og hjelper til med å rydde bordet."],
  'A1l-C6h': ["Reads the small print. Twice.", "Leser det med liten skrift. To ganger."],
  'A2l-E1h': ["Could talk you into anything. Usually something fun.", "Kan prate deg med på hva som helst. Som regel noe gøy."],
  'N4l-E2h': ["Never waits to be asked to dance.", "Venter aldri på å bli bedt opp."],
  'N5l-C5h': ["One piece of chocolate. Actually just one.", "Én bit sjokolade. Faktisk bare én."],
  'O6h-A2h': ["Breaks the rules for the right reasons.", "Bryter reglene av de riktige grunnene."]
};

const balanced = ['The All-Rounder', 'Den allsidige'];
const SIGNATURE_SHARE = 0.85; // a signature wins when it rests on at least this share of the plain name's distinctiveness
const extremity = x => Number.isFinite(x.percentile) ? Math.abs(x.percentile - 50) / 50 : Math.abs(x.mean - 3) / 2;
const key = f => `${f.code}${f.band[0]}`;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/** Name, a video closer line for signatures (`line`), the facets it rests on (most distinctive first), the standout traits and a rule id. */
export function profileName(domains, language) {
  const no = language === 'no' ? 1 : 0, traits = standouts(domains);
  const out = domains.flatMap(d => d.facets || []).filter(f => f.band && f.band !== 'middle')
    .sort((a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code));
  if (!out.length) return {name: balanced[no], facets: [], traits, ruleId: 'profile-name-v2/balanced'};
  const [core] = out, second = out.find(f => f.code[0] !== core.code[0]);
  const plain = extremity(core) + (second ? extremity(second) : 0);
  const byKey = Object.fromEntries(out.map(f => [key(f), f]));
  const sig = signatures.filter(([a, b]) => byKey[a] && byKey[b])
    .map(s => ({s, score: extremity(byKey[s[0]]) + extremity(byKey[s[1]])}))
    .sort((x, y) => y.score - x.score)[0];
  if (sig && sig.score >= SIGNATURE_SHARE * plain) {
    const facets = [byKey[sig.s[0]], byKey[sig.s[1]]].sort((a, b) => extremity(b) - extremity(a));
    const id = `${sig.s[0]}-${sig.s[1]}`;
    return {name: sig.s[no ? 3 : 2], line: signatureLines[id][no], facets, traits, ruleId: `profile-name-v2/signature/${id}`};
  }
  const noun = words[key(core)][no ? 3 : 2];
  if (!second) return {name: no ? cap(noun) : `The ${noun}`, facets: [core], traits, ruleId: `profile-name-v2/${key(core)}`};
  const adj = words[key(second)][no ? 1 : 0];
  return {name: no ? `Den ${adj} ${noun}` : `The ${adj} ${noun}`, facets: [core, second], traits, ruleId: `profile-name-v2/${key(core)}-${key(second)}`};
}

export {words, signatures, signatureLines};
