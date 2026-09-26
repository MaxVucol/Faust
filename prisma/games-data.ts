import type { GenreName } from "../lib/catalog";

export type GameSeed = {
  title: string;
  slug: string;
  description: string;
  price: number;
  /** Discount percentage and the number of days until it expires, counted from seed time. */
  discount?: { percent: number; days: number };
  genres: GenreName[];
  platforms: string[];
  rating: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  stock: number;
  featured?: boolean;
};

const ALL = ["PC", "PlayStation 5", "Xbox Series X|S"];

export const games: GameSeed[] = [
  {
    title: "Elden Ring",
    slug: "elden-ring",
    description:
      "Regele a murit de trei ierni, iar coroana lui arde încă în catedrala părăsită din Valdrenn. Pornești ca un cavaler fără nume, legat prin jurământ de o dinastie care nu mai există.\n\nLumea deschisă se întinde peste mlaștini, mănăstiri năruite și cetăți ocupate de ordine rivale. Fiecare alianță are un preț, iar fiecare alegere lasă urme în cronica finală.",
    price: 299.99,
    genres: ["RPG", "Souls-like"],
    platforms: ALL,
    rating: 9.3,
    releaseDate: "2026-03-14",
    developer: "Grimhallow Studio",
    publisher: "Blackwater Interactive",
    stock: 140,
    featured: true,
  },
  {
    title: "Sekiro: Shadows Die Twice",
    slug: "sekiro-shadows-die-twice",
    description:
      "Grădinile mănăstirii Sfântul Oswin au fost înghițite de spini care sângerează la atingere. Ultimul frate veghetor trebuie să coboare prin cripte și să înfrunte ce a crescut din rădăcinile lor.\n\nLupte exigente, bazate pe ritm și răbdare, cu un sistem de posturi care răsplătește observația atentă mai mult decât reflexele.",
    price: 249.99,
    discount: { percent: 30, days: 6 },
    genres: ["Souls-like", "Action"],
    platforms: ["PC", "PlayStation 5"],
    rating: 9.1,
    releaseDate: "2025-11-02",
    developer: "Kettle & Crow",
    publisher: "Kettle & Crow",
    stock: 85,
    featured: true,
  },
  {
    title: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    description:
      "Relicvele sfinților sunt ultima barieră împotriva negurii care urcă din văi. Ca păstrător al ultimului reliquariu, călătorești între sate asediate și decizi cine primește protecție și cine rămâne în întuneric.\n\nUn RPG narativ, cu dialoguri ramificate, o hartă construită manual și un sistem de reputație care ține minte fiecare promisiune încălcată.",
    price: 274.99,
    genres: ["RPG"],
    platforms: [...ALL, "Nintendo Switch"],
    rating: 8.9,
    releaseDate: "2025-09-19",
    developer: "Ordo Lumen",
    publisher: "Blackwater Interactive",
    stock: 60,
    featured: true,
  },
  {
    title: "Resident Evil 4",
    slug: "resident-evil-4",
    description:
      "Episcopul din Carrow Fen a predicat patruzeci de nopți la rând, fără să mănânce și fără să doarmă. Enoriașii au început să dispară unul câte unul.\n\nHorror psihologic la persoana întâi, fără arme, în care singura ta apărare este lumina unei lămpi care se stinge prea repede.",
    price: 149.99,
    discount: { percent: 40, days: 4 },
    genres: ["Horror", "Adventure"],
    platforms: ["PC", "PlayStation 5"],
    rating: 8.4,
    releaseDate: "2024-10-31",
    developer: "Sallow Lantern",
    publisher: "Nightjar Games",
    stock: 200,
  },
  {
    title: "Iron Covenant",
    slug: "iron-covenant",
    description:
      "Cinci case nobiliare, un singur tron și un legământ scris cu fier topit. Conduci o casă mică de la granița de nord și încerci să supraviețuiești unui secol de trădări.\n\nStrategie pe ture cu diplomație detaliată, căsătorii politice, asedii de lungă durată și economie bazată pe recolte și anotimpuri.",
    price: 224.99,
    genres: ["Strategy"],
    platforms: ["PC"],
    rating: 8.7,
    releaseDate: "2025-02-11",
    developer: "Stonewright",
    publisher: "Stonewright",
    stock: 95,
  },
  {
    title: "Blood of the Marches",
    slug: "blood-of-the-marches",
    description:
      "Mărcile de hotar nu au rege, doar căpitani de mercenari și sate care plătesc tribut oricui trece. Îți formezi compania, îți alegi contractele și îți îngropi morții.\n\nLupte în timp real cu formații, echipament care se uzează și răni care nu se vindecă pe deplin.",
    price: 199.99,
    discount: { percent: 25, days: 8 },
    genres: ["Action", "RPG"],
    platforms: ALL,
    rating: 8.2,
    releaseDate: "2024-06-07",
    developer: "Marchward",
    publisher: "Nightjar Games",
    stock: 120,
  },
  {
    title: "The Drowned Abbey",
    slug: "the-drowned-abbey",
    description:
      "Abația a fost înghițită de mare într-o singură noapte de furtună. La reflux, clopotele încă sună sub apă.\n\nExplorare atmosferică și puzzle-uri de mediu, cu o poveste spusă prin scrisori, registre și inscripții găsite pe pereții inundați.",
    price: 124.99,
    genres: ["Horror"],
    platforms: ["PC", "Xbox Series X|S", "Nintendo Switch"],
    rating: 7.9,
    releaseDate: "2023-11-17",
    developer: "Sallow Lantern",
    publisher: "Sallow Lantern",
    stock: 70,
  },
  {
    title: "Winterhold Siege",
    slug: "winterhold-siege",
    description:
      "Iarna a venit devreme, iar armata din sud a ajuns înaintea ei. Ai o cetate, patru sute de suflete și provizii pentru două luni.\n\nStrategie de asediu în timp real: construiești ziduri, raționalizezi hrana, trimiți iscoade și alegi când să ieși la luptă.",
    price: 174.99,
    genres: ["Strategy"],
    platforms: ["PC", "PlayStation 5"],
    rating: 8.0,
    releaseDate: "2024-01-23",
    developer: "Stonewright",
    publisher: "Iron Quill",
    stock: 0,
  },
  {
    title: "Lantern of the Deep Wood",
    slug: "lantern-of-the-deep-wood",
    description:
      "Un băiat de cărbunar pleacă în pădurea adâncă să-și caute sora, cu o lanternă care arată doar lucrurile pe care ceilalți nu le văd.\n\nAventură liniștită și melancolică, cu puzzle-uri de lumină și umbră și o coloană sonoră pentru lăută și cor.",
    price: 99.99,
    genres: ["Adventure"],
    platforms: [...ALL, "Nintendo Switch"],
    rating: 8.5,
    releaseDate: "2025-04-30",
    developer: "Hearthmoss",
    publisher: "Iron Quill",
    stock: 150,
  },
  {
    title: "Lords of the Fallen",
    slug: "lords-of-the-fallen",
    description:
      "Ai jurat să aperi un mormânt. Au trecut trei sute de ani și încă stai de pază, iar jefuitorii devin tot mai îndrăzneți.\n\nLupte scurte și brutale, într-o singură necropolă verticală care se schimbă după fiecare moarte.",
    price: 149.99,
    discount: { percent: 20, days: 5 },
    genres: ["Action", "Souls-like"],
    platforms: ["PC", "Xbox Series X|S"],
    rating: 8.1,
    releaseDate: "2024-08-15",
    developer: "Kettle & Crow",
    publisher: "Nightjar Games",
    stock: 45,
  },
  {
    title: "Kingdom of Rust",
    slug: "kingdom-of-rust",
    description:
      "Un regat construit pe mine de fier a început să ruginească din interior. Ca ultim cancelar, trebuie să țină în viață o coroană care nu mai are ce să conducă.\n\nStrategie de administrare cu elemente RPG: sfetnici cu personalitate, conspirații de curte și reforme care pot salva sau distruge regatul.",
    price: 199.99,
    genres: ["Strategy", "RPG"],
    platforms: ["PC"],
    rating: 7.6,
    releaseDate: "2023-05-09",
    developer: "Iron Quill",
    publisher: "Iron Quill",
    stock: 30,
  },
  {
    title: "The Pale Cartographer",
    slug: "the-pale-cartographer",
    description:
      "Hărțile ei sunt atât de exacte încât ținuturile desenate încep să existe. Hărțile greșite creează locuri care nu ar fi trebuit să existe.\n\nAventură narativă de explorare, în care desenezi harta cu propria mână, iar lumea se rearanjează după ce ai trasat.",
    price: 139.99,
    genres: ["Adventure", "RPG"],
    platforms: ["PC", "Nintendo Switch"],
    rating: 8.8,
    releaseDate: "2025-07-18",
    developer: "Hearthmoss",
    publisher: "Blackwater Interactive",
    stock: 110,
  },
  {
    title: "Mourning Blade",
    slug: "mourning-blade",
    description:
      "O sabie care plânge de fiecare dată când ia o viață și un spadasin care a încetat să o mai asculte.\n\nAcțiune rapidă, cu dueluri precise, combo-uri construite din posturi și un sistem de parare care cere sânge rece.",
    price: 174.99,
    genres: ["Action"],
    platforms: ALL,
    rating: 7.8,
    releaseDate: "2024-03-02",
    developer: "Marchward",
    publisher: "Nightjar Games",
    stock: 90,
  },
  {
    title: "Dark Souls III",
    slug: "dark-souls-iii",
    description:
      "Farul de pe muntele Cinder s-a stins, iar ceea ce ardea în el umblă acum liber prin vale.\n\nUn souls-like compact, cu o singură zonă interconectată, scurtături ingenioase și șefi care își schimbă tactica după comportamentul tău.",
    price: 164.99,
    discount: { percent: 35, days: 3 },
    genres: ["Souls-like"],
    platforms: ["PC", "PlayStation 5"],
    rating: 8.6,
    releaseDate: "2025-10-10",
    developer: "Ember Rook",
    publisher: "Ember Rook",
    stock: 55,
  },
  {
    title: "Hymn of the Barrow",
    slug: "hymn-of-the-barrow",
    description:
      "Tumulii de pe câmpia Esk cântă noaptea. Cei care îi ascultă prea mult nu se mai întorc acasă.\n\nHorror folcloric cu investigație: aduni mărturii, descifrezi imnuri vechi și alegi ce adevăruri rămân îngropate.",
    price: 114.99,
    genres: ["Horror", "Adventure"],
    platforms: ["PC", "Xbox Series X|S"],
    rating: 7.4,
    releaseDate: "2023-10-13",
    developer: "Sallow Lantern",
    publisher: "Nightjar Games",
    stock: 65,
  },
  {
    title: "Crows over Varenholm",
    slug: "crows-over-varenholm",
    description:
      "Ciorile s-au adunat deasupra orașului înaintea ciumei, a foametei și a războiului. Acum s-au adunat din nou.\n\nStrategie de construcție și supraviețuire urbană: gestionezi breslele, carantinele, miliția și credința unui oraș care se destramă.",
    price: 149.99,
    discount: { percent: 15, days: 9 },
    genres: ["Strategy"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X|S"],
    rating: 8.3,
    releaseDate: "2025-01-28",
    developer: "Stonewright",
    publisher: "Blackwater Interactive",
    stock: 80,
  },
  {
    title: "Black Tithe",
    slug: "black-tithe",
    description:
      "Biserica cere zeciuiala în sânge, iar colectorul ei ești tu. Până într-o noapte în care refuzi.\n\nAcțiune horror cu arme albe, resurse puține și inamici care învață din fiecare întâlnire cu tine.",
    price: 199.99,
    genres: ["Action", "Horror"],
    platforms: ["PC", "PlayStation 5"],
    rating: 7.7,
    releaseDate: "2024-11-22",
    developer: "Ember Rook",
    publisher: "Nightjar Games",
    stock: 40,
  },
  {
    title: "Hogwarts Legacy",
    slug: "hogwarts-legacy",
    description:
      "Un cavaler în armură neagră străbate regatele de miazănoapte în căutarea stăpânului care l-a trădat.\n\nAventură de acțiune clasică, cu călătorie călare, castele de explorat și un bestiar ilustrat pe care îl completezi pe parcurs.",
    price: 224.99,
    discount: { percent: 50, days: 2 },
    genres: ["Action", "Adventure"],
    platforms: [...ALL, "Nintendo Switch"],
    rating: 8.0,
    releaseDate: "2023-08-24",
    developer: "Grimhallow Studio",
    publisher: "Blackwater Interactive",
    stock: 175,
  },
  {
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    description:
      "Cronicile provinciei Duskmarch acoperă o sută de ani de război, iar tu scrii fiecare pagină.\n\nRPG tactic pe ture, cu o companie de personaje care îmbătrânesc, se retrag și își lasă moștenirea următoarei generații.",
    price: 249.99,
    genres: ["RPG", "Strategy"],
    platforms: ["PC", "Nintendo Switch"],
    rating: 9.0,
    releaseDate: "2026-06-05",
    developer: "Ordo Lumen",
    publisher: "Iron Quill",
    stock: 100,
  },
  {
    title: "Black Myth: Wukong",
    slug: "black-myth-wukong",
    description:
      "Fierarul din Hallow Deep a forjat arme pentru zei și a fost pedepsit să le repare pentru eternitate.\n\nSouls-like cu accent pe fierărie: armele se forjează din materialele învinșilor și capătă istoria lor.",
    price: 274.99,
    genres: ["Souls-like", "RPG"],
    platforms: ALL,
    rating: 8.9,
    releaseDate: "2026-08-21",
    developer: "Ember Rook",
    publisher: "Blackwater Interactive",
    stock: 75,
  },
  {
    title: "Darkest Dungeon II",
    slug: "darkest-dungeon-ii",
    description:
      "Sub orașul sfânt se află un osuar cât un oraș întreg. Cineva a aprins acolo o flacără care nu ar fi trebuit să ardă.\n\nRPG horror cu explorare de temnițe, gestionarea sănătății mintale și un grup de exploratori care nu se încred unii în alții.",
    price: 184.99,
    discount: { percent: 20, days: 7 },
    genres: ["Horror", "RPG"],
    platforms: ["PC"],
    rating: 8.2,
    releaseDate: "2026-09-04",
    developer: "Ordo Lumen",
    publisher: "Nightjar Games",
    stock: 50,
  },
  {
    title: "Hollow Knight: Silksong",
    slug: "hollow-knight-silksong",
    description:
      "În valea aceasta, clopotele nu mai sună de o generație. Un călugăr tânăr este trimis să afle de ce.\n\nAventură contemplativă, cu dialoguri scrise atent, o vale care se schimbă odată cu anotimpurile și un final care depinde de ce alegi să asculți.",
    price: 109.99,
    genres: ["Adventure"],
    platforms: ["PC", "PlayStation 5", "Nintendo Switch"],
    rating: 7.2,
    releaseDate: "2026-09-12",
    developer: "Hearthmoss",
    publisher: "Hearthmoss",
    stock: 90,
  },
];

export function coverPath(slug: string): string {
  return `/images/games/${slug}/cover.jpg`;
}

export function screenshotPaths(slug: string): string[] {
  return [1, 2, 3, 4].map((n) => `/images/games/${slug}/shot-${n}.jpg`);
}
