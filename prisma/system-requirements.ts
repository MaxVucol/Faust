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
  // Added with the October 2026 catalogue expansion (retrieved on 1 October 2026).
  "subnautica-2": {
    source: "https://store.steampowered.com/app/1962700/",
    minimum: { os: "Windows 10/11", processor: "Intel Core i5-8400 / AMD Ryzen 5 2600", memory: "12 GB RAM", graphics: "GeForce GTX 1660 6GB / RX 5500 XT 6GB", directX: "Version 12", storage: "50 GB available space" },
    recommended: { os: "Windows 11", processor: "Intel Core i7-13700 / AMD Ryzen 7 7700X", memory: "16 GB RAM", graphics: "Geforce RTX 3070 8GB / RX 6700 XT 8GB", directX: "Version 12", storage: "50 GB available space" },
  },
  "minecraft-dungeons-ii": {
    source: "https://store.steampowered.com/app/1912410/",
    minimum: { os: "Windows 10 64‑bit (1703 or newer)", processor: "Intel Core i3‑8100, AMD Ryzen 3 2200G or equivalent", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 1050, AMD Radeon RX 560 or equivalent dedicated graphics card with at least 2 GB VRAM", directX: "Version 11" },
    recommended: { os: "Windows 10 64‑bit (1703 or newer)", processor: "Intel Core i5‑8400, AMD Ryzen 5 2600 or equivalent or higher", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1060, AMD Radeon RX 580, with at least 6 GB VRAM or equivalent", directX: "Version 11" },
  },
  "lego-batman-legacy-of-the-dark-knight": {
    source: "https://store.steampowered.com/app/2215200/",
    minimum: { os: "Windows 11", processor: "Intel Core i5-10600K or AMD Ryzen 5 1600", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 6400, 4 GB or Intel Arc A580, 8 GB", storage: "50 GB available space" },
    recommended: { os: "Windows 11", processor: "Intel Core i7-12700 or AMD Ryzen 7 5800X", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 2070 SUPER, 8 GB or AMD Radeon RX 6650 XT, 8 GB or Intel Arc B580, 12 GB", storage: "50 GB available space" },
  },
  "hades-ii": {
    source: "https://store.steampowered.com/app/1145350/",
    minimum: { os: "Windows 10 64-bit", processor: "Dual Core 2.4 GHz", memory: "8 GB RAM", graphics: "GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630", storage: "11 GB available space" },
    recommended: { os: "Windows 10 64-bit", processor: "Quad Core 2.4ghz", memory: "16 GB RAM", graphics: "GeForce RTX 2060, Radeon RX 5600 XT, or Intel Arc A580", storage: "11 GB available space" },
  },
  "spongebob-squarepants-titans-of-the-tide": {
    source: "https://store.steampowered.com/app/2479650/",
    minimum: { os: "Windows 10", processor: "Ryzen 3 1300X / Core i5-3570k", memory: "8 GB RAM", graphics: "GeForce GTX 1050 Ti / Radeon RX 470", directX: "Version 11", storage: "11 GB available space" },
    recommended: { os: "Windows 11", processor: "Ryzen 5 5600X / Core i5-12400", memory: "16 GB RAM", graphics: "GeForce RTX 3060 / Radeon RX 6600XT / Arc B580", directX: "Version 11", storage: "11 GB available space" },
  },
  "ea-sports-fc-26": {
    source: "https://store.steampowered.com/app/3405690/",
    minimum: { os: "Windows 10/11 - 64-Bit (Latest Update).", processor: "AMD Ryzen 5 1600 or Intel Core i5 6600k", memory: "8 GB RAM", graphics: "AMD RX 570 or Nvidia GTX 1050 Ti", directX: "Version 12", storage: "100 GB available space" },
    recommended: { os: "Windows 10/11 - 64-Bit (Latest Update).", processor: "AMD Ryzen 7 2700X or Intel Core i7 6700", memory: "12 GB RAM", graphics: "AMD RX 5600 XT or Nvidia GTX 1660", directX: "Version 12", storage: "100 GB available space" },
  },
  "nba-2k26": {
    source: "https://store.steampowered.com/app/3472040/",
    minimum: { os: "Windows 10 64-Bit (latest update)", processor: "Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200", memory: "8 GB RAM", graphics: "NVIDIA® GeForce® GTX 1060 5 GB or AMD Radeon™ RX 5500 XT 4 GB or Intel® Arc™ A580", directX: "Version 12", storage: "110 GB available space" },
    recommended: { os: "Windows 11 64-Bit (latest update)", processor: "Intel® Core™ i5-10600 or AMD Ryzen™ 5 3600X", memory: "16 GB RAM", graphics: "NVIDIA® GeForce® RTX 2070 8 GB or AMD Radeon™ RX 5700 8 GB or Intel® Arc™ A770", directX: "Version 12", storage: "110 GB available space" },
  },
  "sonic-racing-crossworlds": {
    source: "https://store.steampowered.com/app/2486820/",
    minimum: { os: "Windows 10", processor: "Intel Core i5-3470 or AMD Ryzen 3 1200", memory: "12 GB RAM", graphics: "NVIDIA GeForce GTX 1630, 4GB or AMD Radeon R9 380, 4GB or Intel Arc A380, 6GB", directX: "Version 12", storage: "20 GB available space" },
    recommended: { os: "Windows 11", processor: "Intel Core i7-8700K or AMD Ryzen 5 2600", memory: "12 GB RAM", graphics: "NVIDIA GeForce GTX 1660 Ti, 6 GB or AMD Radeon RX 5600 XT, 6 GB", directX: "Version 12", storage: "20 GB available space" },
  },
  "assassins-creed-shadows": {
    source: "https://store.steampowered.com/app/3159330/",
    minimum: { os: "Windows 10/11", processor: "INTEL® Core TM i7 8700K AMD RYZEN 5 3600", memory: "16 GB RAM", graphics: "NVIDIA® GEFORCE GTX 1650 4GB / AMD RX-5500 XT 8GB / INTEL® ARC TM A380 6GB (REBAR ON)\"", directX: "Version 12", storage: "115 GB available space" },
    recommended: { os: "Windows 10/11", processor: "Intel® Core™ i5 11600k/AMD Ryzen™ 5 5600x", memory: "16 GB RAM", graphics: "Nvidia® GeForce RTX™ 3060Ti 8GB/AMD Radeon™ RX 6700 XT 12GB/Intel® Arc™ B580 12GB (REBAR ON)", directX: "Version 12", storage: "115 GB available space" },
  },
  "split-fiction": {
    source: "https://store.steampowered.com/app/2001120/",
    minimum: { os: "64 bit Windows 10/11", processor: "Intel Core i5-6600K or AMD Ryzen 5 2600X", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 970 - 4GB or Radeon RX 470 - 4GB", directX: "Version 12", storage: "85 GB available space" },
    recommended: { os: "64 bit Windows 10/11", processor: "Intel Core i7-11700k or AMD Ryzen 7 5800X", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 3070 - 8GB or AMD Radeon 6700 XT - 12GB", directX: "Version 12", storage: "85 GB available space" },
  },
  "two-point-museum": {
    source: "https://store.steampowered.com/app/2185060/",
    minimum: { os: "Windows 10 version 21H1 (build 19043) or newer", processor: "Intel Core i3-8100 or Ryzen 5 1400", memory: "6 GB RAM", graphics: "Nvidia GeForce GT 1030 (2 GB) or AMD Radeon RX 560 (2 GB) or Intel UHD Graphics 630", directX: "Version 11", storage: "8 GB available space" },
    recommended: { os: "Windows 10 version 21H1 (build 19043) or newer", processor: "Intel Core i5-11600 or AMD Ryzen 5 5600", memory: "8 GB RAM", graphics: "Nvidia GeForce GTX 1070 (8 GB) or AMD Radeon RX 5600 XT (6 GB) or Intel Arc A750 (8 GB)", directX: "Version 11", storage: "8 GB available space" },
  },
  "the-last-of-us-part-ii-remastered": {
    source: "https://store.steampowered.com/app/2531310/",
    minimum: { os: "Windows 10/11 64-bit (version 1909 or higher)", processor: "Intel Core i3-8100, AMD Ryzen 3 1300X", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1650, AMD Radeon RX 5500XT", storage: "150 GB available space" },
    recommended: { os: "Windows 10/11 64-bit (version 1909 or higher)", processor: "Intel Core i5-8600, AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 3060, AMD Radeon RX 5700", storage: "150 GB available space" },
  },
  "microsoft-flight-simulator-2024": {
    source: "https://store.steampowered.com/app/2537590/",
    minimum: { os: "Windows 10", processor: "AMD Ryzen 5 2600X or Intel Core i7-6800K", memory: "16 GB RAM", graphics: "Radeon RX 5700 or GeForce GTX 970", directX: "Version 12", storage: "50 GB available space" },
    recommended: { os: "Windows 10", processor: "AMD Ryzen 7 2700X or Intel Core i7-10700K", memory: "32 GB RAM", graphics: "Radeon RX 5700 XT or GeForce RTX 2080", directX: "Version 12", storage: "50 GB available space" },
  },
  "lego-horizon-adventures": {
    source: "https://store.steampowered.com/app/2428810/",
    minimum: { os: "Windows 10", processor: "Intel Core i5-8400 / AMD Ryzen 5 2600", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1650 / AMD Radeon RX 580", storage: "30 GB available space" },
    recommended: { os: "Windows 10", processor: "Intel Core i5-10600K / AMD Ryzen 5 3600", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 3070 / AMD Radeon RX 6800", storage: "30 GB available space" },
  },
  "planet-coaster-2": {
    source: "https://store.steampowered.com/app/2688950/",
    minimum: { os: "Windows 10 64bit (22H2)", processor: "Intel i5-6600K / AMD Ryzen 5 2600", memory: "16 GB RAM", graphics: "NVIDIA GeForce GTX 1060 (6GB VRAM) / AMD Radeon RX 5600XT (6GB VRAM) / Intel Arc A750 (8GB VRAM)", directX: "Version 12", storage: "25 GB available space" },
    recommended: { os: "Windows 10,11 64bit", processor: "Intel i7-10700K / AMD Ryzen 7 5800", memory: "16 GB RAM", graphics: "NVIDIA GeForce RTX 2070 Super (8GB VRAM) / AMD Radeon RX 6700 XT (12GB VRAM) / Intel Arc A770 (16GB VRAM)", directX: "Version 12", storage: "25 GB available space" },
  },
  "sonic-x-shadow-generations": {
    source: "https://store.steampowered.com/app/2513280/",
    minimum: { os: "Windows 10", processor: "Intel Core i3-2120 or FX-6300", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 550 Ti, 1GB or AMD Radeon HD 5770, 1GB", storage: "35.3 GB available space" },
    recommended: { os: "Windows 10", processor: "Intel Core i7-2600 or AMD Ryzen 5 1400", memory: "12 GB RAM", graphics: "NVIDIA GeForce GTX 780, 3GB or AMD Radeon RX 470, 4GB or Intel Arc A310, 4GB", storage: "35.3 GB available space" },
  },
  "balatro": {
    source: "https://store.steampowered.com/app/2379780/",
    minimum: { os: "Windows 7, 8, 10, 11 x64", processor: "Intel Core i3", memory: "1 GB RAM", graphics: "OpenGL 2.1 compatible graphics card, integrated graphics", storage: "150 MB available space" },
  },
  "disney-dreamlight-valley": {
    source: "https://store.steampowered.com/app/1401590/",
    minimum: { os: "Windows 10", processor: "Intel Core i3-540 or AMD Phenom II X4 940", memory: "6 GB RAM", graphics: "NVIDIA GeForce 9600 GT, 512 MB or AMD Radeon HD 6570, 1 GB", directX: "Version 10", storage: "26 GB available space" },
    recommended: { os: "Windows 10", processor: "Intel Core i5-4690 or AMD Ryzen 3 1300X", memory: "6 GB RAM", graphics: "NVIDIA GeForce GTX 960, 4 GB or AMD Radeon R9 380, 4 GB", directX: "Version 11", storage: "26 GB available space" },
  },
  "bluey-the-videogame": {
    source: "https://store.steampowered.com/app/2078350/",
    minimum: { os: "Windows 10 64-Bit", processor: "AMD Ryzen 3 1200 /Intel Core i3-7100", memory: "8 GB RAM", graphics: "AMD Radeon RX 550 4GB / GeForce GTX 1630", directX: "Version 11", storage: "7 GB available space" },
    recommended: { os: "Windows 10 64-Bit", processor: "AMD Ryzen 5 2500X / Intel Core i5-8400", memory: "16 GB RAM", graphics: "AMD Radeon R9 280 / Nvidia GTX 960", directX: "Version 12", storage: "10 GB available space" },
  },
  "cities-skylines-ii": {
    source: "https://store.steampowered.com/app/949230/",
    minimum: { os: "Windows® 10 Home 64 Bit", processor: "Intel® Core™ i7-6700K | AMD® Ryzen™ 5 2600X", memory: "8 GB RAM", graphics: "Nvidia® GeForce™ GTX 970 (4 GB) | AMD® Radeon™ RX 480 (8 GB)", storage: "60 GB available space" },
    recommended: { os: "Windows® 10 Home 64 Bit | Windows® 11", processor: "Intel® Core™ i5-12600K | AMD® Ryzen™ 7 5800X", memory: "16 GB RAM", graphics: "Nvidia® GeForce™ RTX 3080 (10 GB) | AMD® Radeon™ RX 6800 XT (16 GB)", storage: "60 GB available space" },
  },
  "hot-wheels-unleashed-2-turbocharged": {
    source: "https://store.steampowered.com/app/2051120/",
    minimum: { os: "Windows 10 64-Bit or later", processor: "Intel Core i5-4590 or equivalent / AMD FX-4350 or equivalent", memory: "8 GB RAM", graphics: "GeForce GTX 1050 / Radeon RX 460", directX: "Version 11", storage: "30 GB available space" },
    recommended: { os: "Windows 10 64-Bit or later", processor: "Intel Core i9-9900k or equivalent / AMD Ryzen 7 2700X or equivalent", memory: "16 GB RAM", graphics: "GeForce RTX 2070 Super / Radeon RX 6800 XT", directX: "Version 11", storage: "30 GB available space" },
  },
  "paw-patrol-world": {
    source: "https://store.steampowered.com/app/1952520/",
    minimum: { os: "Windows 10 64-Bit", processor: "AMD Ryzen 3 1200 /Intel Core i3-7100", memory: "8 GB RAM", graphics: "AMD Radeon RX 550 4GB / Nvidia GTX 750", directX: "Version 11", storage: "8 GB available space" },
    recommended: { os: "Windows 10 64-Bit", processor: "AMD Ryzen 5 2500X / Intel Core i5-8400", memory: "16 GB RAM", graphics: "AMD Radeon R9 280 / Nvidia GTX 960", directX: "Version 11", storage: "16 GB available space" },
  },
  "dave-the-diver": {
    source: "https://store.steampowered.com/app/1868140/",
    minimum: { os: "Windows 10 64 bit", processor: "Intel Core i3 Dual Core", memory: "8 GB RAM", graphics: "NVIDIA Geforce GTS 450 / AMD Radeon HD 5570", directX: "Version 11", storage: "10 GB available space" },
    recommended: { os: "Windows 10 64 bit", processor: "Intel Core i5 (Hexa Core) / i7 (Quad Core)", memory: "16 GB RAM", graphics: "NVIDIA GTX 1060 3GB / AMD RX 480", directX: "Version 11", storage: "10 GB available space" },
  },
  "lego-star-wars-the-skywalker-saga": {
    source: "https://store.steampowered.com/app/920210/",
    minimum: { os: "Windows 10 64-bit", processor: "Intel Core i5-2400 or AMD Ryzen 3 1200", memory: "8 GB RAM", graphics: "GeForce GTX 750 Ti or Radeon HD 7850", directX: "Version 11", storage: "40 GB available space" },
    recommended: { os: "Windows 10 64-bit", processor: "Intel Core i5-6600 or AMD Ryzen 3 3100", memory: "8 GB RAM", graphics: "GeForce GTX 780 or Radeon R9 290", directX: "Version 11", storage: "40 GB available space" },
  },
  "powerwash-simulator": {
    source: "https://store.steampowered.com/app/1290000/",
    minimum: { os: "Windows 8 (64-bit) or newer", processor: "Intel i5-760 (4*2800), AMD Phenom II", memory: "4 GB RAM", graphics: "GeForce GTX 760, AMD R7-260X", directX: "Version 11", storage: "6 GB available space" },
  },
  "forza-horizon-5": {
    source: "https://store.steampowered.com/app/1551360/",
    minimum: { os: "Windows 10 version 18362.0 or higher", processor: "Intel i5-4460 or AMD Ryzen 3 1200", memory: "8 GB RAM", graphics: "NVidia GTX 970, AMD RX 470, OR Intel Arc A380", directX: "Version 12", storage: "110 GB available space" },
    recommended: { os: "Windows 10 version 18362.0 or higher", processor: "Intel i5-8400 or AMD Ryzen 5 1500X", memory: "16 GB RAM", graphics: "NVidia GTX 1070, AMD RX 590, OR Intel Arc A750", directX: "Version 12", storage: "110 GB available space" },
  },
  "overcooked-all-you-can-eat": {
    source: "https://store.steampowered.com/app/1243830/",
    minimum: { os: "WIN7-64 bit", processor: "Intel Core 2 Quad Q6600 or AMD Phenom II X3 720", memory: "4 GB RAM", graphics: "NVIDIA GeForce GTS 450, 1 GB / AMD Radeon HD 5750, 1 GB", directX: "Version 11", storage: "8 GB available space" },
    recommended: { os: "Windows 10 64 Bit", processor: "Intel core i5-2300, 2.8 GHz or AMD FX-4300, 3.8 GHz", memory: "6 GB RAM", graphics: "GeForce GTX 660 2GB VRAM / Radeon HD 7870 2GB VRAM", directX: "Version 12", storage: "10 GB available space" },
  },
  "minecraft-dungeons": {
    source: "https://store.steampowered.com/app/1672970/",
    minimum: { os: "Windows 10 (November 2019 Update or higher), 8 or 7 (64-bit with the latest updates; some functionality not supported on Windows 7 and 8)", processor: "Core i5 2.8GHz or equivalent", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 660 or AMD Radeon HD 7870 or equivalent DX11 GPU", directX: "Version 11", storage: "6 GB available space" },
    recommended: { os: "Windows 10 (November 2019 Update or higher), 8 or 7 (64-bit with the latest updates; some functionality not supported on Windows 7 and 8)", processor: "Core i5 2.8GHz or equivalent", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 660 or AMD Radeon HD 7870 or equivalent DX11 GPU", directX: "Version 11", storage: "6 GB available space" },
  },
  "red-dead-redemption-2": {
    source: "https://store.steampowered.com/app/1174180/",
    minimum: { os: "Windows 10 - 64-bit", processor: "Intel® Core™ i5-2500K / AMD FX-6300", memory: "8 GB RAM", graphics: "Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB", storage: "150 GB available space" },
    recommended: { os: "Windows 10 - 64-bit", processor: "Intel® Core™ i7-4770K / AMD Ryzen 5 1500X", memory: "12 GB RAM", graphics: "Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB", storage: "150 GB available space" },
  },
  "the-elder-scrolls-v-skyrim-special-edition": {
    source: "https://store.steampowered.com/app/489830/",
    minimum: { os: "Windows 7/8.1/10 (64-bit Version)", processor: "Intel i5-750/AMD Phenom II X4-945", memory: "8 GB RAM", graphics: "NVIDIA GTX 470 1GB /AMD HD 7870 2GB", storage: "12 GB available space" },
    recommended: { os: "Windows 7/8.1/10 (64-bit Version)", processor: "Intel i5-2400/AMD FX-8320", memory: "8 GB RAM", graphics: "NVIDIA GTX 780 3GB /AMD R9 290 4GB", storage: "12 GB available space" },
  },
  "stardew-valley": {
    source: "https://store.steampowered.com/app/413150/",
    minimum: { os: "Windows Vista or greater", processor: "2 Ghz", memory: "2 GB RAM", graphics: "256 mb video memory, shader model 3.0+", directX: "Version 10", storage: "500 MB available space" },
  },
  "euro-truck-simulator-2": {
    source: "https://store.steampowered.com/app/227300/",
    minimum: { os: "Windows 10 64-bit", processor: "Intel Core i5-6400 or AMD Ryzen 3 1200 or similar", memory: "8 GB RAM", graphics: "NVIDIA GeForce GTX 660 or AMD Radeon RX 460 or Intel HD 630 (2GB VRAM)" },
    recommended: { os: "Windows 10 64-bit", processor: "Intel Core i5-9600 or AMD Ryzen 5 3600 or similar", memory: "12 GB RAM", graphics: "NVIDIA GeForce GTX 1660 or AMD Radeon RX 590 (2GB VRAM)" },
  },
  "tony-hawks-pro-skater-3-4": {
    source: "https://store.steampowered.com/app/2545710/",
    minimum: { os: "Windows® 10 64 Bit (latest update)", processor: "AMD FX 6300 / Intel® Core™ i3-4340", memory: "8 GB RAM", graphics: "AMD HD 7950 / NVIDIA® GTX 660", directX: "Version 11", storage: "55 GB available space" },
    recommended: { os: "Windows® 10 64 Bit (latest update) or Windows® 11 64 Bit (latest update)", processor: "AMD Ryzen™ 5 1600X / Intel® Core™ i5-2500K", memory: "12 GB RAM", graphics: "AMD Radeon™ R9 390 / NVIDIA® GTX 970", directX: "Version 11", storage: "55 GB available space" },
  },
};
