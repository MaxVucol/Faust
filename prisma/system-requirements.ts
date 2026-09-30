/**
 * Official PC system requirements, copied from each game's Steam store page (the publisher's own
 * listing; the page is linked in `source`). Retrieved on 30 September 2026. Only the six fields below
 * are kept; any field the publisher does not list stays out.
 *
 * A game that is missing here has no verified requirements and its page says so. Never add values
 * from another game or from a generic template.
 */
export type RequirementSet = { os?: string; processor?: string; memory?: string; graphics?: string; directX?: string; storage?: string };
export type GameRequirements = { source: string; minimum?: RequirementSet; recommended?: RequirementSet };

export const systemRequirements: Record<string, GameRequirements> = {
  "elden-ring": {
    source: "https://store.steampowered.com/app/1245620/",
    minimum: { os: "Windows 10", processor: "INTEL CORE I5-8400 or AMD RYZEN 3 3300X", memory: "12 GB RAM", graphics: "NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB", directX: "Version 12", storage: "60 GB available space" },
    recommended: { os: "Windows 10/11", processor: "INTEL CORE I7-8700K or AMD RYZEN 5 3600X", memory: "16 GB RAM", graphics: "NVIDIA GEFORCE GTX 1070 8 GB or AMD RADEON RX VEGA 56 8 GB", directX: "Version 12", storage: "60 GB available space" },
  },
  "sekiro-shadows-die-twice": {
    source: "https://store.steampowered.com/app/814380/",
    minimum: { os: "Windows 7 64-bit | Windows 8 64-bit | Windows 10 64-bit", processor: "Intel Core i3-2100 | AMD FX-6300", memory: "4 GB RAM", graphics: "NVIDIA GeForce GTX 760 | AMD Radeon HD 7950", directX: "Version 11", storage: "25 GB available space" },
    recommended: { os: "Windows 7 64-bit | Windows 8 64-bit | Windows 10 64-bit", processor: "Intel Core i5-2500K | AMD Ryzen 5 1400", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 970 | AMD Radeon RX 570", directX: "Version 11", storage: "25 GB available space" },
  },
  "the-witcher-3-wild-hunt": {
    source: "https://store.steampowered.com/app/292030/",
    minimum: { os: "64-bit Windows 11", processor: "Core i5-8400 / Ryzen 5 2600", memory: "12 GB RAM", graphics: "GeForce GTX 1660 / Radeon RX 5500 XT 8GB / Arc A580", storage: "60 SSD GB available space" },
    recommended: { os: "64-bit Windows 11", processor: "Intel Core i7 8700K / AMD Ryzen 5 3600X", memory: "16 GB RAM", graphics: "RTX 2060 Super / AMD Radeon RX 6600 XT / Intel Arc B580", storage: "60 SSD GB available space" },
  },
  "resident-evil-4": {
    source: "https://store.steampowered.com/app/2050650/",
    minimum: { os: "Windows 10 (64 bit)", processor: "AMD Ryzen 3 1200 / Intel Core i5-7500", memory: "8 GB RAM", graphics: "AMD Radeon RX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM", directX: "Version 12" },
    recommended: { os: "Windows 10 (64 bit)/Windows 11 (64 bit)", processor: "AMD Ryzen 5 3600 / Intel Core i7 8700", memory: "16 GB RAM", graphics: "AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070", directX: "Version 12" },
  },
  "europa-universalis-v": {
    source: "https://store.steampowered.com/app/3450310/",
    minimum: { os: "Windows® 10 Home 64 Bit", processor: "Intel® Core™ i7-8700K | AMD® Ryzen™ 5 3600", memory: "16 GB RAM", graphics: "Nvidia® GeForce™ GTX 1060 (6GB) | AMD® Radeon™ RX 580 (8GB) | Intel® Arc™ A380 (6GB) | Intel® Arc™ 140V", storage: "20 GB available space" },
    recommended: { os: "Windows® 11", processor: "Intel® Core™ i7-14700K | AMD® Ryzen™ 7 7800X3D", memory: "32 GB RAM", graphics: "Nvidia® GeForce™ RTX 3060 Ti (8GB) | AMD® Radeon™ RX 6700 XT (12 GB)", storage: "20 GB available space" },
  },
  "kingdom-come-deliverance-ii": {
    source: "https://store.steampowered.com/app/1771300/",
    minimum: { os: "Windows 10 64-bit (or newer)", processor: "Intel Core i5-8400, AMD Ryzen 5 2600", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1060 (6GB), AMD Radeon RX 580", storage: "100 GB available space" },
    recommended: { os: "Windows 10 64-bit (or newer)", processor: "Intel Core i7-13700K, AMD Ryzen 7 7800X3D", memory: "32 GB RAM", graphics: "NVIDIA GeForce RTX 4070, AMD Radeon RX 7800 XT", storage: "100 GB available space" },
  },
  "silent-hill-f": {
    source: "https://store.steampowered.com/app/2947440/",
    minimum: { os: "Windows 11 x64", processor: "Intel Core i5-8400 / AMD Ryzen 5 2600", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700", directX: "Version 12", storage: "50 GB available space" },
    recommended: { os: "Windows 11 x64", processor: "Intel Core i7-9700 / AMD Ryzen 5 5500", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® RTX 2080 or AMD Radeon™ RX 6800XT", directX: "Version 12", storage: "50 GB available space" },
  },
  "anno-117-pax-romana": {
    source: "https://store.steampowered.com/app/3274580/",
    minimum: { os: "Windows 10 (64 bit only)", processor: "Intel 7th Gen: Intel Core i7-7700 or AMD Ryzen 5 1600", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1660 (6GB) or AMD Radeon RX-5600 XT (6GB)", directX: "Version 12", storage: "117 GB available space" },
    recommended: { os: "Windows 11 (64 bit only)", processor: "Intel 9th Gen: Intel Core i5-9600k or AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 2070 (8GB) or AMD Radeon RX-6600 XT (8GB)", directX: "Version 12", storage: "117 GB available space" },
  },
  "lords-of-the-fallen": {
    source: "https://store.steampowered.com/app/1501750/",
    minimum: { os: "Windows 10 64bit", processor: "intel i5 8400 | AMD Ryzen 5 2600", memory: "12 GB RAM", graphics: "6GBs VRAM | NVIDIA GTX-1060 | AMD Radeon RX 590", directX: "Version 12", storage: "45 GB available space" },
    recommended: { os: "Windows 10 64bit", processor: "intel i7 8700 | AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "8GBs VRAM | NVIDIA RTX-2080 | AMD Radeon RX 6700", directX: "Version 12", storage: "45 GB available space" },
  },
  "civilization-vii": {
    source: "https://store.steampowered.com/app/1295660/",
    minimum: { os: "Win 10 64 Bit", processor: "Intel i5-4690 / Intel i3-10100 / AMD Ryzen 3 1200", memory: "8 GB RAM", graphics: "NVIDIA GTX 1050 / AMD RX 460 / Intel Arc A380", directX: "Version 12", storage: "20 GB available space" },
    recommended: { os: "Win 10 64 Bit", processor: "Intel Core i5-10400 / AMD Ryzen 5 3600X", memory: "16 GB RAM", graphics: "NVIDIA RTX 2060 / AMD RX 6600 / Intel Arc A750", directX: "Version 12", storage: "20 GB available space" },
  },
  "clair-obscur-expedition-33": {
    source: "https://store.steampowered.com/app/1903340/",
    minimum: { os: "Windows 10", processor: "Intel Core i7-8700K / AMD Ryzen 5 1600X", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB", directX: "Version 12", storage: "55 GB available space" },
    recommended: { os: "Windows 11", processor: "Intel Core i7-12700K / AMD Ryzen 7 5800X", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 3060 Ti 8 GB / AMD Radeon RX 6800 XT 16 GB", directX: "Version 12", storage: "55 GB available space" },
  },
  "doom-the-dark-ages": {
    source: "https://store.steampowered.com/app/3017860/",
    minimum: { os: "Windows 10 64-Bit / Windows 11 64-Bit", processor: "AMD Zen 2 or Intel 10th Generation CPU @3.2Ghz with 8 cores / 16 threads or better (examples: AMD Ryzen 7 3700X or better, or Intel Core i7 10700K or better)", memory: "16 GB RAM", graphics: "NVIDIA or AMD hardware Raytracing-capable GPU with 8GB dedicated VRAM or better (examples: NVIDIA RTX 2060 SUPER or better, AMD RX 6600 or better)", storage: "100 GB available space" },
    recommended: { os: "Windows 10 64-Bit / Windows 11 64-Bit", processor: "AMD Zen 3 or Intel 12th Generation CPU @3.2Ghz with 8 cores / 16 threads or better (examples: AMD Ryzen 7 5700X or better, or Intel Core i7 12700K or better)", memory: "32 GB RAM", graphics: "NVIDIA or AMD hardware Raytracing-capable GPU with 10GB dedicated VRAM or better (examples: NVIDIA RTX 3080 or better, AMD RX 6800 or better)", storage: "100 GB available space" },
  },
  "dark-souls-iii": {
    source: "https://store.steampowered.com/app/374320/",
    minimum: { os: "Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit", processor: "Intel Core i3-2100 / AMD® FX-6300", memory: "4 GB RAM", graphics: "NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950", directX: "Version 11", storage: "25 GB available space" },
    recommended: { os: "Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit", processor: "Intel Core i7-3770 / AMD® FX-8350", memory: "8 GB RAM", graphics: "NVIDIA® GeForce GTX 970 / ATI Radeon R9 series", directX: "Version 11", storage: "25 GB available space" },
  },
  "resident-evil-requiem": {
    source: "https://store.steampowered.com/app/3764200/",
    minimum: { os: "Windows 11 (64bit required)", processor: "Intel corei5-8500 / AMD Ryzen 5 3500", memory: "16 GB RAM", graphics: "GeForce GTX 1660 6GB / Radeon RX 5500 XT 8GB", directX: "Version 12" },
    recommended: { os: "Windows 11 (64bit required)", processor: "Intel Core i7-8700 / AMD Ryzen 5 5500", memory: "16 GB RAM", graphics: "GeForce RTX 2060 Super 8GB / Radeon RX 6600 8GB", directX: "Version 12" },
  },
  "monster-hunter-wilds": {
    source: "https://store.steampowered.com/app/2246340/",
    minimum: { os: "Windows®10 (64-bit Required)/Windows®11 (64-bit Required)", processor: "Intel® Core™ i5-10400 or Intel® Core™ i3-12100 or AMD Ryzen™ 5 3600", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® GTX 1660(VRAM 6GB) or AMD Radeon™ RX 5500 XT(VRAM 8GB)", directX: "Version 12", storage: "75 GB available space" },
    recommended: { os: "Windows®10 (64-bit Required)/Windows®11 (64-bit Required)", processor: "Intel® Core™ i5-10400 or Intel® Core™ i3-12100 or AMD Ryzen™ 5 3600", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® RTX 2060 Super(VRAM 8GB) or AMD Radeon™ RX 6600(VRAM 8GB)", directX: "Version 12", storage: "75 GB available space" },
  },
  "hogwarts-legacy": {
    source: "https://store.steampowered.com/app/990080/",
    minimum: { os: "64-bit Windows 10", processor: "Intel Core i5-6600 (3.3Ghz) or AMD Ryzen 5 1400 (3.2Ghz)", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 960 4GB or AMD Radeon RX 470 4GB", directX: "Version 12", storage: "85 GB available space" },
    recommended: { os: "64-bit Windows 10", processor: "Intel Core i7-8700 (3.2Ghz) or AMD Ryzen 5 3600 (3.6 Ghz)", memory: "16 GB RAM", graphics: "NVIDIA GeForce 1080 Ti or AMD Radeon RX 5700 XT or INTEL Arc A770", directX: "Version 12", storage: "85 GB available space" },
  },
  "baldurs-gate-3": {
    source: "https://store.steampowered.com/app/1086940/",
    minimum: { os: "Windows 10 64-bit", processor: "Intel I5 4690 / AMD FX 8350 / Snapdragon X Elite", memory: "8 GB RAM", graphics: "Nvidia GTX 970 / RX 480 / Intel Arc A380 / Qualcomm Adreno X1 (4GB+ of VRAM)", directX: "Version 11", storage: "150 GB available space" },
    recommended: { os: "Windows 10 64-bit", processor: "Intel i7 8700K / AMD r5 3600", memory: "16 GB RAM", graphics: "Nvidia 2060 Super / RX 5700 XT / Intel Arc A580 (8GB+ of VRAM)", directX: "Version 11", storage: "150 GB available space" },
  },
  "black-myth-wukong": {
    source: "https://store.steampowered.com/app/2358720/",
    minimum: { os: "Windows 10 64-bit", processor: "Intel Core i5-8400 / AMD Ryzen 5 1600", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB", directX: "Version 11", storage: "130 GB available space" },
    recommended: { os: "Windows 10 64-bit", processor: "Intel Core i7-9700 / AMD Ryzen 5 5500", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT / INTEL Arc A750", directX: "Version 12", storage: "130 GB available space" },
  },
  "darkest-dungeon-ii": {
    source: "https://store.steampowered.com/app/1940340/",
    minimum: { os: "Windows 10", processor: "AMD Athlon X4 | Intel Core i5 4460", memory: "8 GB RAM", graphics: "Nvidia GTX 950 | AMD R7 370", storage: "6 GB available space" },
    recommended: { os: "Windows 10", processor: "i7 6700k", memory: "16 GB RAM", storage: "6 GB available space" },
  },
  "hollow-knight-silksong": {
    source: "https://store.steampowered.com/app/1030300/",
    minimum: { os: "Windows 10 version 21H1 (build 19043) or newer", processor: "Intel Core i3-3240, AMD FX-4300", memory: "4 GB RAM", graphics: "GeForce GTX 560 Ti (1GB), Radeon HD 7750 (1GB)", directX: "Version 10", storage: "8 GB available space" },
    recommended: { os: "Windows 10 version 21H1 (build 19043) or newer", processor: "Intel Core i5-3470", memory: "8 GB RAM", graphics: "GeForce GTX 1050 (2GB), Radeon R9 380 (2GB)", directX: "Version 10", storage: "8 GB available space" },
  },
  "ninja-gaiden-4": {
    source: "https://store.steampowered.com/app/2627260/",
    minimum: { os: "Windows® 10/11, 64bit", processor: "Intel® Core™ i5-8400 or AMD Ryzen™ 5 3400G", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® GTX 1060 (VRAM 6GB) or ​ AMD Radeon™ RX 590(VRAM 8GB)", directX: "Version 12", storage: "100 GB available space" },
    recommended: { os: "Windows® 10/11, 64bit", processor: "Intel® Core™ i5-10400 or AMD Ryzen™ 5 3600", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® RTX 2060 Super(VRAM 8GB) or AMD Radeon™ RX 5700XT(VRAM 8GB)", directX: "Version 12", storage: "100 GB available space" },
  },
  "the-outer-worlds-2": {
    source: "https://store.steampowered.com/app/1449110/",
    minimum: { os: "Windows 10/11 with updates", processor: "AMD Ryzen 5 2600 / Intel i5-8400", memory: "16 GB RAM", graphics: "AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580", directX: "Version 12", storage: "110 GB available space" },
    recommended: { os: "Windows 10/11 with updates", processor: "AMD Ryzen 5 5600X / Intel Core i7-10700K", memory: "16 GB RAM", graphics: "AMD Radeon RX 6800 XT / Nvidia RTX 3080", directX: "Version 12", storage: "110 GB available space" },
  },
  "little-nightmares-iii": {
    source: "https://store.steampowered.com/app/1392860/",
    minimum: { os: "Windows 11", processor: "Intel Core i5-6500 or AMD Ryzen 3 1200", memory: "8 GB RAM", graphics: "Nvidia GeForce GTX 1060 or AMD Radeon RX 580" },
    recommended: { os: "Windows 11", processor: "Intel Core i5-8400 or AMD Ryzen 5 1600", memory: "12 GB RAM", graphics: "Nvidia GeForce RTX 2080, 8 GB or AMD RX 6800" },
  },
  "nioh-3": {
    source: "https://store.steampowered.com/app/3681010/",
    minimum: { os: "Windows® 11", processor: "Intel Core i5-10400, AMD Ryzen 5 2600 6 cores / 12 threads or higher", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1060 VRAM 6GB, AMD Radeon RX 5600 XT (Rev. 2.0) VRAM 6GB", directX: "Version 12", storage: "125 GB available space" },
    recommended: { os: "Windows® 11", processor: "Intel Core i5-10600K, AMD Ryzen 5 5600X 6 cores / 12 threads or higher", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 3060 Ti VRAM 8GB, AMD Radeon RX 6700 XT VRAM 12GB", directX: "Version 12", storage: "125 GB available space" },
  },
  "code-vein-ii": {
    source: "https://store.steampowered.com/app/2362060/",
    minimum: { os: "Windows 11", processor: "Intel Core i5-9600K /AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "Nvidia GeForce GTX 1660 Super / AMD Radeon RX 5700 / Intel Arc B570", directX: "Version 12", storage: "70 GB available space" },
    recommended: { os: "Windows 11", processor: "Intel Core i7-12700KF / AMD Ryzen 7 7800X3D", memory: "16 GB RAM", graphics: "Nvidia GeForce RTX 3080 / AMD Radeon RX 6800", directX: "Version 12", storage: "70 GB available space" },
  },
  "dragon-quest-vii-reimagined": {
    source: "https://store.steampowered.com/app/2499860/",
    minimum: { os: "Windows® 11", processor: "AMD Ryzen™ 3 1200/Intel® Core™ i3-6100", memory: "8 GB RAM", graphics: "AMD Radeon™ RX 460/Intel® Arc™ A380/NVIDIA® GeForce® GTX 750", directX: "Version 12", storage: "15 GB available space" },
    recommended: { os: "Windows® 11", processor: "AMD Ryzen™ 3 1200/Intel® Core™ i3-6100", memory: "16 GB RAM", graphics: "AMD Radeon™ RX 580/Intel® Arc™ A750/NVIDIA® GeForce® GTX 1070", directX: "Version 12", storage: "15 GB available space" },
  },
  "crimson-desert": {
    source: "https://store.steampowered.com/app/3321460/",
    minimum: { os: "Windows 10 64-bit", processor: "Ryzen 5 2600X / i5-8500", memory: "16 GB RAM", graphics: "RX 5500 XT / GTX 1060", directX: "Version 12", storage: "150 GB available space" },
    recommended: { os: "Windows 10 64-bit", processor: "Ryzen 5 5600 / i5-11600K", memory: "16 GB RAM", graphics: "RX 6700 XT / RTX 2080", directX: "Version 12", storage: "150 GB available space" },
  },
  "octopath-traveler-0": {
    source: "https://store.steampowered.com/app/3014320/",
    minimum: { os: "Windows® 11", processor: "AMD Ryzen™ 3 2300X / Intel® Core™ i3-8100", memory: "8 GB RAM", graphics: "AMD Radeon™ RX 470 / NVIDIA® GeForce® GTX 960", directX: "Version 12", storage: "10 GB available space" },
    recommended: { os: "Windows® 11", processor: "AMD Ryzen™ 5 2600 / Intel® Core™ i5-8400", memory: "16 GB RAM", graphics: "AMD Radeon™ RX 5600XT / NVIDIA® GeForce® GTX 1070 / Intel® Arc™ A580", directX: "Version 12", storage: "10 GB available space" },
  },
  "lies-of-p": {
    source: "https://store.steampowered.com/app/1627720/",
    minimum: { os: "Windows 10 64bit", processor: "AMD Ryzen 3 1200／Intel Core i3-6300", memory: "8 GB RAM", graphics: "AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB", directX: "Version 12", storage: "50 GB available space" },
    recommended: { os: "Windows 10 64bit", processor: "AMD Ryzen 3 1200／Intel Core i3-6300", memory: "16 GB RAM", graphics: "AMD Radeon RX 6500 XT 4GB / NVIDIA GeForce GTX 1660 6GB", directX: "Version 12", storage: "50 GB available space" },
  },
  "cyberpunk-2077": {
    source: "https://store.steampowered.com/app/1091500/",
    minimum: { os: "64-bit Windows 10", processor: "Core i7-6700 or Ryzen 5 1600", memory: "12 GB RAM", graphics: "GeForce GTX 1060 6GB or Radeon RX 580 8GB or Arc A380", directX: "Version 12", storage: "70 GB available space" },
    recommended: { os: "64-bit Windows 10", processor: "Core i7-12700 or Ryzen 7 7800X3D", memory: "16 GB RAM", graphics: "GeForce RTX 2060 SUPER or Radeon RX 5700 XT or Arc A770", directX: "Version 12", storage: "70 GB available space" },
  },
  "god-of-war-ragnarok": {
    source: "https://store.steampowered.com/app/2322010/",
    minimum: { os: "Windows 10 20H1", processor: "Intel i5-4670k or AMD Ryzen 3 1200", memory: "8 GB RAM", graphics: "NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750", directX: "Version 12", storage: "190 GB available space" },
    recommended: { os: "Windows 10 20H1", processor: "Intel i5-8600 or AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "NVIDIA RTX 2060 Super or AMD RX 5700 or Intel Arc A770", directX: "Version 12", storage: "190 GB available space" },
  },
  "dead-space": {
    source: "https://store.steampowered.com/app/1693980/",
    minimum: { os: "Window 10 64-bit +", processor: "Ryzen 5 2600x, Core i5 8600", memory: "16 GB RAM", graphics: "AMD RX 5700, GTX 1070", directX: "Version 12", storage: "50 GB available space" },
    recommended: { os: "Window 10 64-bit +", processor: "Ryzen 5 5600X,Core i5 11600K", memory: "16 GB RAM", graphics: "Radeon RX 6700 XT, Geforce RTX 2070", directX: "Version 12", storage: "50 GB available space" },
  },
  "frostpunk-2": {
    source: "https://store.steampowered.com/app/1601580/",
    minimum: { os: "Windows 10/11 (64-bit)", processor: "AMD Ryzen 5 1600 / Intel Core i5-8400", memory: "8 GB RAM", graphics: "AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM", directX: "Version 12", storage: "30 GB available space" },
    recommended: { os: "Windows 10/11 (64-bit)", processor: "AMD Ryzen 7 3700x / Intel Core i7-10700", memory: "16 GB RAM", graphics: "AMD RX 5700 8 GB VRAM / NVIDIA 2060 Super RTX 8 GB VRAM / INTEL ARC A770 8GB VRAM", directX: "Version 12", storage: "30 GB available space" },
  },
  "total-war-warhammer-iii": {
    source: "https://store.steampowered.com/app/1142710/",
    minimum: { os: "Windows 7 64-bit", processor: "Intel i3/Ryzen 3 series", memory: "6 GB RAM", graphics: "Nvidia GTX 900/AMD RX 400 series | Intel Iris Xe Graphics", directX: "Version 11", storage: "120 GB available space" },
    recommended: { os: "Windows 10 64-bit", processor: "Intel i5/Ryzen 5 series", memory: "8 GB RAM", graphics: "Nvidia GeForce GTX 1660 Ti/AMD RX 5600-XT/Intel Arc A750", directX: "Version 11", storage: "120 GB available space" },
  },
  "crusader-kings-iii": {
    source: "https://store.steampowered.com/app/1158310/",
    minimum: { os: "Windows® 10 Home 64 bit", processor: "Intel Core i5-750 | AMD FX 4300", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 660 | AMD Radeon HD 7870 | Intel Arc A310 | Intel Iris Plus G7 | AMD Radeon Vega 11", storage: "20 GB available space" },
    recommended: { os: "Windows® 10 Home 64 bit or Windows® 11", processor: "Intel Core i5-8400 | AMD Ryzen 5 1600X", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 970 | AMD Radeon RX 480 | Intel Arc A580", storage: "20 GB available space" },
  },
  "blasphemous-2": {
    source: "https://store.steampowered.com/app/2114740/",
    minimum: { os: "Windows 10", processor: "Intel Core 2 Duo E8400 or AMD Phenom II X2 550", memory: "4 GB RAM", graphics: "NVIDIA GeForce GT 520, 1 GB or AMD Radeon HD 7470, 1 GB or Intel HD Graphics 4400", storage: "4 GB available space" },
    recommended: { os: "Windows 10", processor: "Intel Core i3-550 or AMD FX-4100", memory: "6 GB RAM", graphics: "NVIDIA GeForce GT 710, 1 GB or AMD Radeon R7 240, 1 GB or Intel HD Graphics 530", storage: "4 GB available space" },
  },
};
