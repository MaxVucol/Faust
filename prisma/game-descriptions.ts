/**
 * Full game descriptions in every language, keyed by slug. Paragraphs are separated by a blank
 * line (the game page renders each as its own paragraph). Seed and update scripts read from here.
 */
const j = (...paragraphs: string[]) => paragraphs.join("\n\n");

export type DescriptionSet = { ro: string; ru: string; en: string };

export const gameDescriptions: Record<string, DescriptionSet> = {
  "elden-ring": {
    ro: j(
      "Inelul Elden a fost sfărâmat, iar fragmentele lui au căzut în mâinile semizeilor, copiii reginei Marika, care și-au pierdut mințile în setea de putere. Ținuturile de Mijloc, odinioară strălucitoare sub ramurile Arborelui Erd, au devenit un tărâm al războaielor fără sfârșit. Tu ești un Tarnished, un exilat chemat înapoi din moarte de harul pierdut, cu o singură menire: să aduni fragmentele și să devii Lordul Elden.",
      "Lumea deschisă e imensă și lasă libertate totală: poți galopa pe Torrent, armăsarul spectral, peste câmpii mistuite de ceață, poți coborî în catacombe uitate sau poți urca spre castele în care fiecare încăpere ascunde un secret. Nu există un drum impus, iar curiozitatea e răsplătită la fiecare pas cu arme rare, vrăji străvechi și inamici care îți vor testa fiecare reflex.",
      "Lupta e exigentă, dar dreaptă. Îți construiești personajul exact cum vrei, de la cavaler în armură grea la vrăjitor care comandă stelele sau războinic care cheamă spiritele morților în ajutor. Fiecare boss e o poveste în sine, iar victoria după zeci de încercări are un gust pe care puține jocuri îl pot oferi.",
      "Un univers creat împreună cu George R. R. Martin, plin de mituri fragmentate, personaje tragice și finaluri care depind de alegerile tale. Elden Ring nu îți spune povestea — te lasă să o descoperi.",
    ),
    ru: j(
      "Кольцо Элден разбито, а его осколки достались полубогам, детям королевы Марики, которые обезумели в жажде власти. Междуземье, некогда сиявшее под ветвями Древа Эрд, превратилось в край бесконечных войн. Ты — Погасший, изгнанник, возвращённый из смерти утраченной благодатью, и у тебя одна цель: собрать осколки и стать Повелителем Элдена.",
      "Открытый мир огромен и даёт полную свободу: можно мчаться на призрачном скакуне Потоке по окутанным туманом равнинам, спускаться в забытые катакомбы или подниматься в замки, где каждая комната хранит тайну. Навязанного пути нет, а любопытство на каждом шагу вознаграждается редким оружием, древними заклинаниями и врагами, которые проверят каждую твою реакцию.",
      "Бои требовательны, но честны. Ты создаёшь героя так, как хочешь: рыцаря в тяжёлых доспехах, чародея, повелевающего звёздами, или воина, призывающего на помощь духов мёртвых. Каждый босс — отдельная история, а победа после десятков попыток даёт ощущение, которое способны подарить немногие игры.",
      "Вселенная, созданная вместе с Джорджем Р. Р. Мартином, полна обрывочных мифов, трагических персонажей и концовок, зависящих от твоих решений. Elden Ring не рассказывает историю — он позволяет открыть её самому.",
    ),
    en: j(
      "The Elden Ring has been shattered, and its shards have fallen to the demigods, children of Queen Marika, who lost their minds in their hunger for power. The Lands Between, once radiant beneath the boughs of the Erdtree, have become a realm of endless war. You are one of the Tarnished, an exile called back from death by lost grace, with a single purpose: gather the shards and become Elden Lord.",
      "The open world is vast and gives you total freedom: gallop across mist-shrouded plains on Torrent, your spectral steed, descend into forgotten catacombs or climb into castles where every room hides a secret. There is no set path, and curiosity is rewarded at every step with rare weapons, ancient sorceries and enemies that will test every reflex you have.",
      "Combat is demanding but fair. Build your character exactly as you like, from a heavily armoured knight to a sorcerer who commands the stars or a warrior who summons the spirits of the dead to fight at their side. Every boss is a story in itself, and victory after dozens of attempts has a taste few games can offer.",
      "A world created together with George R. R. Martin, full of fragmented myths, tragic characters and endings shaped by your choices. Elden Ring doesn't tell you its story — it lets you uncover it.",
    ),
  },

  "sekiro-shadows-die-twice": {
    ro: j(
      "Japonia sfârșitului de secol XVI, în epoca Sengoku. Provincia Ashina se clatină la marginea prăbușirii, iar tu ești Lupul, un shinobi fără stăpân lăsat să moară pe câmpul de luptă. Când tânărul moștenitor divin pe care ai jurat să-l aperi este răpit, pornești într-o misiune de răzbunare și onoare care te va duce prin castele, temple și păduri bântuite.",
      "Brațul tău stâng, pierdut în luptă, a fost înlocuit cu o proteză shinobi care ascunde o mulțime de unelte: un topor care sparge scuturi, o flacără care alungă fiarele, un cârlig care te aruncă pe acoperișuri. Te miști vertical, te strecori în spatele gărzilor și alegi când să lovești din umbră și când să înfrunți inamicul față în față.",
      "Sistemul de luptă e construit în jurul posturii: fiecare parare perfectă, fiecare lovitură bine plasată rupe echilibrul adversarului până când poți da lovitura fatală. Nu e un joc al rezistenței, ci al ritmului și al curajului — săbiile se ciocnesc, scânteile zboară, iar un duel câștigat pare o coregrafie perfectă.",
      "Iar moartea nu e sfârșitul: moștenirea sângelui divin îți permite să revii la viață chiar în mijlocul luptei. Fiecare înviere are însă un preț, iar lumea din jurul tău îl plătește.",
    ),
    ru: j(
      "Япония конца XVI века, эпоха Сэнгоку. Провинция Асина стоит на краю гибели, а ты — Волк, шиноби без господина, брошенный умирать на поле боя. Когда похищают юного божественного наследника, которого ты поклялся защищать, начинается путь мести и чести через замки, храмы и проклятые леса.",
      "Твою потерянную в бою левую руку заменил протез шиноби, в котором спрятано множество инструментов: топор, раскалывающий щиты, огонь, отпугивающий зверей, крюк, забрасывающий тебя на крыши. Ты двигаешься по вертикали, подкрадываешься к стражникам и сам решаешь, когда ударить из тени, а когда встретить врага лицом к лицу.",
      "Боевая система построена вокруг концентрации: каждое идеальное парирование и каждый точный удар выбивают противника из равновесия, пока не откроется возможность для смертельного удара. Это игра не выносливости, а ритма и смелости — клинки сталкиваются, летят искры, и выигранная дуэль выглядит как безупречная хореография.",
      "А смерть — не конец: наследие божественной крови позволяет воскреснуть прямо посреди боя. Но у каждого воскрешения есть цена, и платит её мир вокруг тебя.",
    ),
    en: j(
      "Japan in the late 16th century, the Sengoku era. The province of Ashina teeters on the edge of collapse, and you are the Wolf, a masterless shinobi left to die on the battlefield. When the young divine heir you swore to protect is kidnapped, you set out on a mission of vengeance and honour that leads through castles, temples and haunted forests.",
      "Your left arm, lost in battle, has been replaced by a shinobi prosthetic that hides a host of tools: an axe that shatters shields, a flame that drives off beasts, a grappling hook that flings you onto rooftops. You move vertically, slip behind guards and choose when to strike from the shadows and when to face the enemy head-on.",
      "Combat is built around posture: every perfect deflection and every well-placed strike breaks your opponent's balance until you can land a deathblow. It isn't a game of endurance but of rhythm and courage — blades clash, sparks fly, and a duel won feels like flawless choreography.",
      "And death isn't the end: the legacy of divine blood lets you rise again in the middle of a fight. But every resurrection has a price, and the world around you pays it.",
    ),
  },

  "the-witcher-3-wild-hunt": {
    ro: j(
      "Ești Geralt din Rivia, vânător de monștri plătit cu argint, într-o lume sfâșiată de război. Imperiul Nilfgaard avansează spre nord, satele ard, iar pe cer a apărut Vânătoarea Sălbatică — o armată de călăreți spectrali care o urmăresc pe Ciri, fiica ta adoptivă și singura persoană la care ții cu adevărat.",
      "Călătoria te poartă prin mlaștinile sărace din Velen, pe străzile pline de intrigi ale marelui oraș Novigrad și printre insulele înghețate ale Skellige. Fiecare regiune are propriile povești, iar misiunile secundare sunt scrise cu atâta grijă încât multe dintre ele rămân în memorie mai mult decât aventurile principale.",
      "Ca vânător, te pregătești pentru fiecare contract: studiezi monstrul, prepari poțiuni și uleiuri, alegi semnele magice potrivite și apoi intri în luptă cu două săbii — oțel pentru oameni, argint pentru bestii. Iar când vrei o pauză, poți juca Gwent la orice han, un joc de cărți care a devenit o legendă în sine.",
      "Ediția completă include și cele două expansiuni mari, Hearts of Stone și Blood and Wine, cu zeci de ore de poveste în plus. Alegerile tale contează, consecințele apar uneori abia peste multe ore, iar finalul depinde de omul care ai ales să fii.",
    ),
    ru: j(
      "Ты — Геральт из Ривии, охотник на чудовищ, работающий за серебро, в мире, раздираемом войной. Нильфгаардская империя наступает на север, деревни горят, а в небе появилась Дикая Охота — армия призрачных всадников, преследующих Цири, твою приёмную дочь и единственного человека, который тебе по-настоящему дорог.",
      "Путь ведёт через нищие болота Велена, по улицам полного интриг вольного города Новиграда и среди заснеженных островов Скеллиге. У каждого края свои истории, а побочные задания написаны с такой заботой, что многие из них запоминаются сильнее основных приключений.",
      "Как ведьмак, ты готовишься к каждому заказу: изучаешь чудовище, варишь эликсиры и масла, выбираешь нужные знаки и вступаешь в бой с двумя мечами — стальным для людей и серебряным для тварей. А когда захочется передохнуть, в любом трактире можно сыграть в гвинт — карточную игру, ставшую легендой сама по себе.",
      "Полное издание включает оба крупных дополнения, «Каменные сердца» и «Кровь и вино», с десятками часов новой истории. Твои решения важны, их последствия порой проявляются лишь спустя много часов, а финал зависит от того, каким человеком ты решишь быть.",
    ),
    en: j(
      "You are Geralt of Rivia, a monster hunter who works for silver, in a world torn apart by war. The Nilfgaardian Empire marches north, villages burn, and the Wild Hunt has appeared in the sky — an army of spectral riders pursuing Ciri, your adopted daughter and the one person you truly care about.",
      "Your journey takes you through the impoverished swamps of Velen, the intrigue-filled streets of the free city of Novigrad and the frozen isles of Skellige. Every region has its own stories, and the side quests are written with such care that many of them stay with you longer than the main adventure.",
      "As a witcher, you prepare for every contract: study the monster, brew potions and oils, choose the right signs, then enter battle with two swords — steel for humans, silver for beasts. And when you want a break, any tavern offers a game of Gwent, a card game that has become a legend in its own right.",
      "The Complete Edition also includes both major expansions, Hearts of Stone and Blood and Wine, with dozens of hours of extra story. Your choices matter, their consequences sometimes surface many hours later, and the ending depends on the man you choose to be.",
    ),
  },

  "resident-evil-4": {
    ro: j(
      "Au trecut șase ani de la dezastrul biologic din Raccoon City. Leon S. Kennedy, fost polițist-începător devenit agent special, primește o misiune aparent simplă: să o găsească și să o aducă acasă pe Ashley, fiica președintelui Statelor Unite, răpită și ascunsă într-un sat izolat din Europa.",
      "Satul pare liniștit doar de la distanță. Localnicii se întorc spre tine cu priviri goale și unelte ridicate, controlați de un cult misterios care venerează o forță străveche. Fiecare casă devine o capcană, fiecare pădure ascunde ceva care te urmărește, iar liniștea dintre atacuri e aproape mai înfricoșătoare decât atacurile înseși.",
      "Remake-ul reconstruiește clasicul din temelii: grafică modernă, o atmosferă mult mai apăsătoare și o luptă mai tactică. Poți para loviturile cu cuțitul, poți ținti membrele inamicilor ca să-i dezechilibrezi și trebuie să-ți gestionezi cu grijă muniția, ierburile și spațiul din valiză.",
      "Între momentele de groază, misteriosul negustor îți oferă arme noi și îmbunătățiri, iar misiunile secundare te trimit să explorezi colțuri ascunse ale hărții. Un amestec perfect de horror și acțiune care a definit un întreg gen.",
    ),
    ru: j(
      "Прошло шесть лет после биологической катастрофы в Раккун-Сити. Леон С. Кеннеди, бывший полицейский-новичок, а ныне специальный агент, получает на первый взгляд простое задание: найти и вернуть домой Эшли, дочь президента США, похищенную и спрятанную в глухой европейской деревне.",
      "Деревня кажется спокойной только издалека. Местные жители поворачиваются к тебе с пустыми взглядами и поднятыми вилами, подчинённые таинственному культу, поклоняющемуся древней силе. Каждый дом превращается в ловушку, в каждом лесу что-то следит за тобой, а тишина между атаками пугает едва ли не сильнее самих атак.",
      "Ремейк перестраивает классику с нуля: современная графика, гораздо более гнетущая атмосфера и более тактические бои. Можно парировать удары ножом, стрелять врагам по конечностям, чтобы сбить их с ног, и приходится бережно распоряжаться патронами, травами и местом в кейсе.",
      "Между моментами ужаса загадочный торговец предлагает новое оружие и улучшения, а побочные задания отправляют исследовать скрытые уголки карты. Идеальное сочетание хоррора и экшена, определившее целый жанр.",
    ),
    en: j(
      "Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, once a rookie cop and now a special agent, is handed a seemingly simple mission: find Ashley, the daughter of the President of the United States, who has been kidnapped and hidden in an isolated European village, and bring her home.",
      "The village only looks peaceful from a distance. The locals turn towards you with empty eyes and raised tools, controlled by a mysterious cult that worships an ancient power. Every house becomes a trap, every forest hides something that follows you, and the silence between attacks is almost more frightening than the attacks themselves.",
      "The remake rebuilds the classic from the ground up: modern visuals, a far more oppressive atmosphere and more tactical combat. You can parry blows with your knife, aim for enemies' limbs to stagger them, and you must carefully manage your ammunition, herbs and the space in your attaché case.",
      "Between the moments of terror, the mysterious merchant offers new weapons and upgrades, while side requests send you into hidden corners of the map. A perfect blend of horror and action that defined an entire genre.",
    ),
  },

  "lords-of-the-fallen": {
    ro: j(
      "Au trecut o mie de ani de când zeul demon Adyr a fost învins, dar legăturile care îl țin închis încep să slăbească. Ținutul Mournstead e acum un loc al ruinelor, fanaticilor și morților care nu își găsesc odihna. Ești un Cruciat Întunecat, purtătorul unei lămpi străvechi, și trebuie să oprești întoarcerea lui Adyr.",
      "Lampa e cheia întregii aventuri: cu ea poți privi și trece în Umbral, tărâmul morților care există chiar dedesubtul lumii celor vii. Acolo apar poduri, pasaje și secrete invizibile altfel — dar și creaturi care nu te lasă în pace. Cu cât stai mai mult în Umbral, cu atât mai periculos devine.",
      "Lupta e dură și brutală, cu arme grele, magie sacră sau întunecată și boși care îți cer răbdare și atenție. Moartea în lumea celor vii te aruncă în Umbral, oferindu-ți o ultimă șansă să te întorci — dacă reușești să supraviețuiești acolo.",
      "O lume interconectată, cu scurtături ingenioase, un design gotic apăsător și posibilitatea de a o explora împreună cu un prieten în cooperativ.",
    ),
    ru: j(
      "Прошла тысяча лет с тех пор, как бог-демон Адир был повержен, но оковы, удерживающие его, начинают слабеть. Морнстед теперь край руин, фанатиков и мёртвых, не находящих покоя. Ты — Тёмный крестоносец, носитель древнего фонаря, и тебе предстоит остановить возвращение Адира.",
      "Фонарь — ключ ко всему приключению: с его помощью можно заглянуть и перейти в Умбрал, мир мёртвых, существующий прямо под миром живых. Там появляются мосты, проходы и тайны, иначе невидимые, — но и существа, которые не оставят тебя в покое. Чем дольше ты в Умбрале, тем опаснее становится.",
      "Бои жёсткие и беспощадные: тяжёлое оружие, святая или тёмная магия и боссы, требующие терпения и внимания. Смерть в мире живых отправляет тебя в Умбрал, давая последний шанс вернуться, — если сумеешь там выжить.",
      "Взаимосвязанный мир с хитроумными срезками, гнетущей готикой и возможностью исследовать его вместе с другом в кооперативе.",
    ),
    en: j(
      "A thousand years have passed since the demon god Adyr was defeated, but the bonds that hold him are weakening. Mournstead is now a land of ruins, fanatics and restless dead. You are a Dark Crusader, bearer of an ancient lamp, and you must stop Adyr's return.",
      "The lamp is the key to the whole adventure: with it you can peer into and cross over to the Umbral, the realm of the dead that lies just beneath the world of the living. There, bridges, passages and secrets appear that are otherwise invisible — along with creatures that won't leave you in peace. The longer you stay in the Umbral, the more dangerous it becomes.",
      "Combat is hard and brutal, with heavy weapons, holy or dark magic and bosses that demand patience and focus. Dying in the world of the living casts you into the Umbral, giving you one last chance to return — if you can survive there.",
      "An interconnected world with clever shortcuts, oppressive gothic design and the option to explore it together with a friend in co-op.",
    ),
  },

  "dark-souls-iii": {
    ro: j(
      "Epoca Focului se stinge. Clopotele au sunat, iar Lorzii Cenușii — eroii care și-au dat odinioară viața pentru a aprinde Prima Flacără — și-au părăsit tronurile. În regatul muribund Lothric, te ridici din mormânt ca Cel Cenușiu, un nemort fără nume, cu misiunea de a-i aduce înapoi, vii sau morți.",
      "Lumea e apăsătoare și splendidă în același timp: castele înalte cu ziduri erodate de vreme, catedrale pline de pelerini înnebuniți, mlaștini otrăvite și orașe înghițite de ceață. Fiecare zonă se leagă de celelalte prin scurtături ingenioase, iar focurile de tabără devin singurele locuri în care te simți în siguranță.",
      "Lupta e mai rapidă decât în jocurile anterioare ale seriei, cu arme care au abilități speciale și boși memorabili, de la cavaleri corupți la creaturi gigantice. Fiecare înfrângere te învață ceva, iar fiecare victorie se simte câștigată pe merit.",
      "Capitolul final al trilogiei Dark Souls, cu o poveste spusă prin fragmente de descrieri, ruine și dialoguri enigmatice, și cu întrebarea care străbate întreaga serie: merită focul să fie aprins din nou?",
    ),
    ru: j(
      "Эра Огня угасает. Колокола прозвонили, и Повелители пепла — герои, некогда отдавшие жизни, чтобы разжечь Первое Пламя, — покинули свои троны. В умирающем королевстве Лотрик ты восстаёшь из могилы как Пепельный, безымянная нежить, чья задача — вернуть их, живыми или мёртвыми.",
      "Мир гнетущий и великолепный одновременно: высокие замки с выветренными стенами, соборы, полные обезумевших паломников, ядовитые болота и города, поглощённые туманом. Каждая зона связана с другими хитроумными срезками, а костры становятся единственными местами, где чувствуешь себя в безопасности.",
      "Бои быстрее, чем в прежних частях серии: у оружия есть особые навыки, а боссы запоминаются надолго — от павших рыцарей до гигантских созданий. Каждое поражение чему-то учит, а каждая победа ощущается заслуженной.",
      "Заключительная глава трилогии Dark Souls с историей, рассказанной через обрывки описаний, руины и загадочные диалоги, и с вопросом, проходящим через всю серию: стоит ли снова разжигать огонь?",
    ),
    en: j(
      "The Age of Fire is fading. The bells have tolled, and the Lords of Cinder — heroes who once gave their lives to kindle the First Flame — have abandoned their thrones. In the dying kingdom of Lothric, you rise from the grave as the Ashen One, a nameless undead tasked with bringing them back, alive or dead.",
      "The world is oppressive and magnificent at once: towering castles with weather-worn walls, cathedrals full of maddened pilgrims, poisoned swamps and cities swallowed by fog. Every area connects to the others through clever shortcuts, and bonfires become the only places where you feel safe.",
      "Combat is faster than in the series' earlier entries, with weapons that carry special skills and memorable bosses, from fallen knights to gigantic creatures. Every defeat teaches you something, and every victory feels truly earned.",
      "The final chapter of the Dark Souls trilogy, with a story told through fragments of item descriptions, ruins and enigmatic dialogue — and the question that runs through the whole series: is the fire worth kindling again?",
    ),
  },

  "hogwarts-legacy": {
    ro: j(
      "Anii 1800, cu mult înainte de evenimentele pe care le cunoaște toată lumea. Primești o scrisoare neobișnuită: ești admis direct în anul cinci la Școala de Magie și Vrăjitorie Hogwarts. Dar nu ești un elev oarecare — porți în tine o magie străveche, uitată de secole, pe care puțini o mai pot vedea.",
      "Castelul Hogwarts e al tău de explorat: săli mari, turnuri, pasaje secrete, tablouri care vorbesc și scări care își schimbă locul. Mergi la cursuri de farmece, poțiuni și ierbologie, îți alegi casa, îți faci prieteni și descoperi misterele ascunse chiar sub nasul profesorilor.",
      "Dincolo de zidurile școlii se întinde o lume deschisă: satul Hogsmeade, Pădurea Interzisă, peșteri, ruine și dealuri pe care le poți survola pe mătură sau pe spatele unui hipogrif. Duelurile de magie sunt spectaculoase, iar vrăjile se combină în moduri tot mai creative pe măsură ce înveți.",
      "Un conflict amenință însă totul: o rebeliune a goblinilor și vrăjitori întunecați care vânează aceeași magie străveche pe care o porți tu. O aventură care îți permite, în sfârșit, să trăiești propria poveste în lumea vrăjitorilor.",
    ),
    ru: j(
      "1800-е годы, задолго до событий, известных всему миру. Ты получаешь необычное письмо: тебя принимают сразу на пятый курс Школы чародейства и волшебства Хогвартс. Но ты не обычный ученик — в тебе живёт древняя магия, забытая веками, которую мало кто способен увидеть.",
      "Замок Хогвартс открыт для исследования: большие залы, башни, тайные ходы, говорящие портреты и лестницы, меняющие своё место. Ты ходишь на уроки заклинаний, зельеварения и травологии, выбираешь факультет, заводишь друзей и раскрываешь тайны, спрятанные прямо под носом у преподавателей.",
      "За стенами школы раскинулся открытый мир: деревня Хогсмид, Запретный лес, пещеры, руины и холмы, над которыми можно пролететь на метле или на спине гиппогрифа. Магические дуэли зрелищны, а заклинания по мере обучения сочетаются всё изобретательнее.",
      "Но всему грозит конфликт: восстание гоблинов и тёмные волшебники, охотящиеся за той же древней магией, что живёт в тебе. Приключение, которое наконец позволяет прожить собственную историю в мире волшебников.",
    ),
    en: j(
      "The 1800s, long before the events the whole world knows. You receive an unusual letter: you have been accepted straight into fifth year at Hogwarts School of Witchcraft and Wizardry. But you are no ordinary student — you carry an ancient magic, forgotten for centuries, that very few can still perceive.",
      "Hogwarts Castle is yours to explore: great halls, towers, secret passages, talking portraits and staircases that change their place. Attend classes in Charms, Potions and Herbology, join your house, make friends and uncover mysteries hidden right under the professors' noses.",
      "Beyond the school walls lies an open world: the village of Hogsmeade, the Forbidden Forest, caves, ruins and hills you can soar over on a broom or on the back of a hippogriff. Wizard duels are spectacular, and spells combine in ever more creative ways as you learn.",
      "Yet a conflict threatens everything: a goblin rebellion and dark wizards hunting the very same ancient magic you carry. An adventure that finally lets you live your own story in the wizarding world.",
    ),
  },

  "baldurs-gate-3": {
    ro: j(
      "Te trezești pe o navă a mind flayerilor care se prăbușește, cu un parazit în creier. Mormolocul ar trebui să te transforme în una dintre aceste creaturi, dar, dintr-un motiv misterios, transformarea nu începe. Împreună cu alți supraviețuitori la fel de infectați, pornești pe Coasta Săbiilor să găsești un leac înainte să fie prea târziu.",
      "Tovarășii tăi sunt printre cele mai bine scrise personaje din jocurile video: o preoteasă cu secrete, un vampir fermecător și periculos, un vrăjitor cu o bombă magică în piept, o războinică githyanki, un paladin cu un pact infernal. Fiecare are propria poveste, propriile dorințe și propriile păreri despre deciziile tale — iar unii pot deveni mai mult decât prieteni.",
      "Lupta pe ture, bazată pe regulile Dungeons & Dragons, îți oferă libertate totală: poți împinge inamici în prăpăstii, poți aprinde butoaie cu ulei, poți convinge un boss să nu lupte deloc. Aproape orice idee creativă funcționează, iar zarurile decid dacă planul tău e genial sau dezastruos.",
      "O poveste uriașă, cu sute de ore de conținut, finaluri multiple și consecințe reale, pe care o poți juca singur sau în cooperativ cu prietenii.",
    ),
    ru: j(
      "Ты приходишь в себя на падающем корабле свежевателей разума с паразитом в мозгу. Личинка должна превратить тебя в одно из этих существ, но по загадочной причине превращение не начинается. Вместе с другими такими же заражёнными выжившими ты отправляешься по Побережью Мечей искать лекарство, пока не стало слишком поздно.",
      "Твои спутники — одни из лучших персонажей в видеоиграх: жрица со своими тайнами, обаятельный и опасный вампир, волшебник с магической бомбой в груди, воительница-гитьянки, паладин, связанный адским договором. У каждого своя история, свои желания и своё мнение о твоих решениях, а с некоторыми можно стать больше чем друзьями.",
      "Пошаговые бои по правилам Dungeons & Dragons дают полную свободу: можно столкнуть врагов в пропасть, поджечь бочки с маслом или уговорить босса вовсе не сражаться. Почти любая творческая идея работает, а кубики решают, окажется план гениальным или катастрофическим.",
      "Огромная история на сотни часов с множеством концовок и реальными последствиями, которую можно пройти в одиночку или в кооперативе с друзьями.",
    ),
    en: j(
      "You wake aboard a crashing mind flayer ship with a parasite in your brain. The tadpole should turn you into one of these creatures, but for some mysterious reason the transformation never begins. Together with other survivors who are just as infected, you set out across the Sword Coast to find a cure before it's too late.",
      "Your companions are some of the best-written characters in video games: a cleric with secrets, a charming and dangerous vampire, a wizard with a magical bomb in his chest, a githyanki warrior, a paladin bound by an infernal pact. Each has their own story, their own desires and their own opinions about your choices — and some may become more than friends.",
      "Turn-based combat built on the Dungeons & Dragons rules gives you total freedom: shove enemies off cliffs, ignite barrels of oil or persuade a boss not to fight at all. Almost any creative idea works, and the dice decide whether your plan is brilliant or disastrous.",
      "A huge story with hundreds of hours of content, multiple endings and real consequences, which you can play alone or in co-op with friends.",
    ),
  },

  "black-myth-wukong": {
    ro: j(
      "Inspirat din Călătoria spre Vest, unul dintre cele mai mari romane clasice chinezești, Black Myth: Wukong te pune în rolul Celui Destinat, un luptător-maimuță care pornește pe urmele legendarului Rege al Maimuțelor, Sun Wukong. Pentru a descoperi adevărul din spatele unei legende, trebuie să înfrunți ființe din mitologie și să recuperezi relicve pierdute.",
      "Lumea e spectaculoasă: temple ascunse în munți, păduri de bambus învăluite în ceață, deșerturi arzătoare și tărâmuri de zăpadă, toate desenate cu o atenție incredibilă la detalii. Fiecare capitol te duce într-un loc nou, cu propria atmosferă și propriile legende.",
      "Lupta se bazează pe toiag și pe trei posturi diferite, fiecare cu un stil propriu. Pe lângă asta, poți folosi vrăji care îngheață inamicii, te poți transforma în creaturile învinse și poți chema clone care luptă alături de tine. Boșii sunt numeroși, variați și adesea uimitori ca proporții.",
      "O aventură souls-like cu o identitate unică, care aduce mitologia chineză pe ecran cu o forță rar întâlnită.",
    ),
    ru: j(
      "Вдохновлённая «Путешествием на Запад», одним из великих классических китайских романов, Black Myth: Wukong отправляет тебя в роли Предначертанного — воина-обезьяны, идущего по следам легендарного Царя обезьян Сунь Укуна. Чтобы узнать правду, скрытую за легендой, предстоит сразиться с существами из мифов и вернуть утраченные реликвии.",
      "Мир захватывает дух: храмы, спрятанные в горах, бамбуковые леса в тумане, раскалённые пустыни и снежные края — всё нарисовано с невероятным вниманием к деталям. Каждая глава переносит в новое место со своей атмосферой и своими легендами.",
      "Бои построены на посохе и трёх разных стойках, у каждой из которых свой стиль. Кроме того, можно применять заклинания, замораживающие врагов, превращаться в побеждённых существ и призывать клонов, сражающихся рядом с тобой. Боссов много, они разнообразны и нередко поражают масштабом.",
      "Souls-like приключение со своим неповторимым лицом, которое переносит китайскую мифологию на экран с редкой силой.",
    ),
    en: j(
      "Inspired by Journey to the West, one of the great classic Chinese novels, Black Myth: Wukong casts you as the Destined One, a monkey warrior following in the footsteps of the legendary Monkey King, Sun Wukong. To uncover the truth behind a legend, you must face beings from mythology and recover lost relics.",
      "The world is breathtaking: temples hidden in the mountains, mist-wrapped bamboo forests, scorching deserts and snowbound lands, all crafted with incredible attention to detail. Every chapter takes you somewhere new, with its own atmosphere and its own legends.",
      "Combat is built around the staff and three different stances, each with its own style. On top of that, you can cast spells that freeze enemies in place, transform into creatures you have defeated and summon clones to fight at your side. The bosses are numerous, varied and often astonishing in scale.",
      "A souls-like adventure with a unique identity, bringing Chinese mythology to the screen with rare power.",
    ),
  },

  "darkest-dungeon-ii": {
    ro: j(
      "Lumea se prăbușește. Un cataclism numit Ruina a învăluit ținuturile într-o umbră care îi înnebunește pe oameni, iar singura speranță e o Flacără străveche aflată în vârful Muntelui. Alegi patru eroi frânți de viață, îi urci într-o diligență și pornești într-o călătorie pe care puțini au supraviețuit-o.",
      "Drumul trece prin orașe în flăcări, păduri bântuite și ruine pline de creaturi. Fiecare oprire e o luptă tactică pe ture, în care poziția eroilor, abilitățile lor și momentul ales pentru atac pot decide totul. Iar diligența trebuie reparată, aprovizionată și păzită.",
      "Cea mai mare amenințare nu sunt însă monștrii, ci mintea eroilor. Stresul se acumulează, iar relațiile dintre ei evoluează: pot deveni prieteni care se protejează unul pe altul sau dușmani care își sabotează reciproc acțiunile. Uneori, un erou se prăbușește sub presiune în cel mai rău moment.",
      "Un RPG roguelike sumbru și plin de tensiune, în care fiecare expediție e diferită, iar fiecare pas spre Munte are un preț.",
    ),
    ru: j(
      "Мир рушится. Катаклизм, называемый Порчей, накрыл земли тенью, сводящей людей с ума, и единственная надежда — древнее Пламя на вершине Горы. Ты выбираешь четырёх сломленных жизнью героев, сажаешь их в дилижанс и отправляешься в путь, который мало кто пережил.",
      "Дорога идёт через горящие города, проклятые леса и руины, полные тварей. Каждая остановка — пошаговый тактический бой, где всё решают расстановка героев, их навыки и выбранный для атаки момент. А дилижанс нужно чинить, снабжать и охранять.",
      "Но главная угроза — не чудовища, а рассудок героев. Стресс накапливается, а отношения между ними развиваются: они могут стать друзьями, прикрывающими друг друга, или врагами, мешающими друг другу. Иногда герой ломается под давлением в самый неподходящий момент.",
      "Мрачная и напряжённая roguelike-RPG, где каждый поход непохож на предыдущий, а у каждого шага к Горе есть своя цена.",
    ),
    en: j(
      "The world is falling apart. A cataclysm called the Shroud has blanketed the land in a shadow that drives people mad, and the only hope is an ancient Flame at the summit of the Mountain. You choose four heroes broken by life, load them into a stagecoach and set out on a journey few have survived.",
      "The road passes through burning cities, haunted forests and ruins crawling with creatures. Every stop is a turn-based tactical battle where your heroes' positions, their skills and the moment you choose to strike can decide everything. And the stagecoach must be repaired, supplied and defended.",
      "The greatest threat, though, isn't the monsters but your heroes' minds. Stress builds up, and the relationships between them evolve: they may become friends who protect one another or enemies who sabotage each other's actions. Sometimes a hero breaks under pressure at the worst possible moment.",
      "A grim, tension-filled roguelike RPG in which every expedition is different and every step towards the Mountain has its price.",
    ),
  },

  "hollow-knight-silksong": {
    ro: j(
      "Hornet, prințesa-protectoare a regatului Hallownest, este capturată și dusă într-un ținut necunoscut: Pharloom, un regat condus de mătase și cântec. Singura cale spre libertate trece prin vârful unei citadele strălucitoare, iar drumul până acolo e lung, periculos și plin de secrete.",
      "Pharloom e o lume vastă, desenată de mână, cu peșteri adânci, păduri de corali, sate de insecte și orașe suspendate. Explorezi liber, descoperi scurtături, abilități noi și zone ascunse, iar harta se desenează treptat pe măsură ce înaintezi.",
      "Hornet e mult mai agilă decât eroii obișnuiți ai genului: sare, se cațără, se prinde de margini și atacă rapid cu acul și firul ei de mătase. Poți folosi zeci de unelte create din materialele găsite pe drum, iar luptele cu boșii sunt rapide, acrobatice și memorabile.",
      "Continuarea mult așteptată a unui metroidvania îndrăgit, cu misiuni pentru locuitorii regatului, o coloană sonoră superbă și o poveste despre libertate și ascensiune.",
    ),
    ru: j(
      "Хорнет, принцесса-защитница королевства Халлоунест, попадает в плен и оказывается в незнакомых землях — в Фарлуме, королевстве, которым правят шёлк и песня. Единственный путь к свободе ведёт на вершину сияющей цитадели, и дорога туда долгая, опасная и полная тайн.",
      "Фарлум — огромный мир, нарисованный вручную: глубокие пещеры, коралловые леса, деревни насекомых и подвешенные города. Ты свободно исследуешь его, находишь срезки, новые способности и скрытые зоны, а карта постепенно дорисовывается по мере продвижения.",
      "Хорнет гораздо подвижнее привычных героев жанра: она прыгает, карабкается, цепляется за уступы и стремительно атакует иглой и шёлковой нитью. Можно использовать десятки инструментов, созданных из найденных материалов, а бои с боссами быстрые, акробатичные и запоминающиеся.",
      "Долгожданное продолжение любимой метроидвании с заданиями для жителей королевства, великолепным саундтреком и историей о свободе и восхождении.",
    ),
    en: j(
      "Hornet, princess-protector of the kingdom of Hallownest, is captured and carried off to an unknown land: Pharloom, a kingdom ruled by silk and song. The only way to freedom leads to the top of a shining citadel, and the road there is long, dangerous and full of secrets.",
      "Pharloom is a vast, hand-drawn world of deep caverns, coral forests, bug villages and suspended cities. You explore freely, uncovering shortcuts, new abilities and hidden areas, and the map fills in gradually as you advance.",
      "Hornet is far more agile than the genre's usual heroes: she leaps, climbs, grabs ledges and strikes quickly with her needle and silk thread. You can use dozens of tools crafted from materials found along the way, and the boss fights are fast, acrobatic and memorable.",
      "The long-awaited sequel to a beloved metroidvania, with quests for the kingdom's inhabitants, a gorgeous soundtrack and a story about freedom and the climb to the top.",
    ),
  },

  "europa-universalis-v": {
    ro: j(
      "Europa, anul 1337. Regate, imperii, republici comerciale și principate mărunte își dispută un continent care se va schimba de nerecunoscut în următorii cinci sute de ani. Alegi oricare dintre sute de state — de la marile puteri la un mic ducat uitat de istorie — și îl conduci până în 1837.",
      "Europa Universalis V e o strategie grand-scale construită în jurul oamenilor care îți populează ținuturile. Țăranii, burghezii, clerul și nobilimea au interese proprii, iar echilibrul dintre ele decide dacă statul tău prosperă sau se destramă în revolte. Economia, comerțul și producția sunt mai detaliate ca oricând.",
      "Diplomația e la fel de importantă ca războiul: căsătorii dinastice, alianțe fragile, uniri personale și rivalități care durează secole. Poți construi un imperiu colonial peste mări, poți uni un popor divizat sau poți supraviețui între doi vecini mult mai puternici prin inteligență și răbdare.",
      "Fiecare campanie scrie o istorie alternativă diferită, iar sutele de ore de joc trec aproape pe nesimțite.",
    ),
    ru: j(
      "Европа, 1337 год. Королевства, империи, торговые республики и мелкие княжества борются за континент, который за следующие пятьсот лет изменится до неузнаваемости. Ты выбираешь любое из сотен государств — от великих держав до маленького, забытого историей герцогства — и ведёшь его до 1837 года.",
      "Europa Universalis V — глобальная стратегия, построенная вокруг людей, населяющих твои земли. У крестьян, горожан, духовенства и знати свои интересы, и баланс между ними решает, процветает ли государство или распадается в мятежах. Экономика, торговля и производство проработаны глубже, чем когда-либо.",
      "Дипломатия важна не меньше войны: династические браки, хрупкие союзы, личные унии и соперничество длиной в века. Можно построить заморскую колониальную империю, объединить раздробленный народ или выжить между двумя куда более сильными соседями благодаря уму и терпению.",
      "Каждая кампания пишет новую альтернативную историю, а сотни часов игры пролетают почти незаметно.",
    ),
    en: j(
      "Europe, 1337. Kingdoms, empires, merchant republics and tiny principalities vie for a continent that will change beyond recognition over the next five hundred years. Choose any of hundreds of states — from the great powers to a small duchy history forgot — and lead it all the way to 1837.",
      "Europa Universalis V is a grand strategy game built around the people who populate your lands. Peasants, burghers, clergy and nobility each have their own interests, and the balance between them decides whether your realm prospers or falls apart in revolt. The economy, trade and production are more detailed than ever.",
      "Diplomacy matters as much as war: dynastic marriages, fragile alliances, personal unions and rivalries that last for centuries. You can build a colonial empire across the seas, unite a divided people or survive between two far stronger neighbours through wit and patience.",
      "Every campaign writes a different alternate history, and hundreds of hours of play pass almost without notice.",
    ),
  },

  "kingdom-come-deliverance-ii": {
    ro: j(
      "Boemia, anul 1403. Regatul e sfâșiat de un război civil, iar Henry din Skalitz, fiul unui fierar devenit om al nobilului Hans Capon, pornește într-o misiune care se transformă rapid într-o luptă pentru supraviețuire. O poveste amplă despre loialitate, răzbunare și prietenie, spusă pe fundalul unor evenimente istorice reale.",
      "Lumea e una dintre cele mai autentice văzute vreodată într-un RPG: sate, mănăstiri, păduri și marele oraș Kuttenberg, recreate cu o atenție uimitoare față de epocă. Oamenii au rutine zilnice, țin minte ce faci și reacționează la hainele tale, la reputația ta și chiar la mirosul tău după o luptă.",
      "Lupta cu sabia la persoana întâi e realistă și exigentă, iar fiecare duel se câștigă prin tehnică, nu prin statistici. Henry învață totul exersând: să citească, să prepare poțiuni prin alchimie, să fure, să vorbească convingător sau să mânuiască arbaleta și primele arme de foc.",
      "Poți rezolva aproape orice situație în mai multe feluri — prin forță, diplomație, viclenie sau pur și simplu evitând-o. Un RPG medieval imens și profund, cu zeci de ore de poveste și o libertate rar întâlnită.",
    ),
    ru: j(
      "Богемия, 1403 год. Королевство раздирает гражданская война, а Индржих из Скалицы, сын кузнеца, ставший человеком пана Ганса Капона, отправляется с поручением, которое быстро превращается в борьбу за выживание. Большая история о верности, мести и дружбе на фоне реальных исторических событий.",
      "Мир — один из самых достоверных, что когда-либо появлялись в RPG: деревни, монастыри, леса и большой город Кутна-Гора воссозданы с поразительным вниманием к эпохе. У людей есть распорядок дня, они запоминают твои поступки и реагируют на одежду, репутацию и даже на запах после драки.",
      "Бои на мечах от первого лица реалистичны и требовательны, и каждая дуэль выигрывается техникой, а не цифрами. Индржих учится всему на практике: читать, варить зелья с помощью алхимии, воровать, убедительно говорить или обращаться с арбалетом и первым огнестрельным оружием.",
      "Почти любую ситуацию можно решить по-разному — силой, дипломатией, хитростью или просто обойдя её стороной. Огромная и глубокая средневековая RPG с десятками часов сюжета и редкой свободой.",
    ),
    en: j(
      "Bohemia, 1403. The kingdom is torn apart by civil war, and Henry of Skalitz, a blacksmith's son turned retainer of the nobleman Hans Capon, sets out on a mission that quickly becomes a fight for survival. A sweeping story of loyalty, revenge and friendship, told against the backdrop of real historical events.",
      "The world is one of the most authentic ever seen in an RPG: villages, monasteries, forests and the great city of Kuttenberg, recreated with astonishing attention to the period. People have daily routines, remember what you do and react to your clothes, your reputation and even how you smell after a fight.",
      "First-person sword combat is realistic and demanding, and every duel is won through technique rather than statistics. Henry learns everything by doing: reading, brewing potions through alchemy, stealing, speaking persuasively or handling a crossbow and the earliest firearms.",
      "Almost any situation can be solved in several ways — by force, diplomacy, cunning or simply by avoiding it. A vast, deep medieval RPG with dozens of hours of story and a rare sense of freedom.",
    ),
  },

  "silent-hill-f": {
    ro: j(
      "Japonia anilor 1960. Ebisugaoka e un orășel de munte liniștit, până în ziua în care o ceață densă coboară peste el și totul se transformă. Hinako Shimizu, o adolescentă care se simte prizonieră în propria viață, se trezește singură pe străzi pustii, în timp ce florile roșii de lycoris și ceva viu din ceață pun stăpânire pe oraș.",
      "Silent Hill f duce seria celebră într-un loc complet nou, cu o poveste scrisă de Ryukishi07, unul dintre cei mai apreciați autori japonezi de horror psihologic. Frumusețea și groaza merg mână în mână: imagini delicate, aproape poetice, se transformă în coșmaruri greu de uitat.",
      "Hinako nu e o luptătoare antrenată. Se apără cu ce găsește — țevi, unelte, arme improvizate care se tocesc — iar fiecare întâlnire e o decizie între a lupta și a fugi. Resursele sunt puține, iar orașul ascunde puzzle-uri care te obligă să înțelegi ce s-a întâmplat cu adevărat.",
      "Un horror psihologic despre identitate, presiune și alegeri, în care cele mai înfricoșătoare lucruri nu se află doar în ceață.",
    ),
    ru: j(
      "Япония 1960-х. Эбисугаока — тихий горный городок, пока однажды на него не опускается густой туман и всё не меняется. Хинако Симидзу, девушка, которая чувствует себя пленницей собственной жизни, оказывается одна на опустевших улицах, а красные ликорисы и что-то живое в тумане захватывают город.",
      "Silent Hill f переносит знаменитую серию в совершенно новое место. Сценарий написал Рюкиси07 — один из самых известных японских авторов психологического хоррора. Красота и ужас идут рука об руку: нежные, почти поэтичные образы превращаются в незабываемые кошмары.",
      "Хинако — не обученный боец. Она защищается тем, что найдёт: трубами, инструментами, самодельным оружием, которое тупится и ломается, и каждая встреча — выбор между боем и бегством. Ресурсов мало, а город хранит головоломки, заставляющие понять, что произошло на самом деле.",
      "Психологический хоррор об идентичности, давлении и выборе, где самое страшное скрывается не только в тумане.",
    ),
    en: j(
      "Japan in the 1960s. Ebisugaoka is a quiet mountain town until the day a thick fog rolls in and everything changes. Hinako Shimizu, a teenager who feels trapped in her own life, finds herself alone in deserted streets as red spider lilies and something alive in the fog take hold of the town.",
      "Silent Hill f takes the celebrated series somewhere entirely new, with a story written by Ryukishi07, one of Japan's most acclaimed authors of psychological horror. Beauty and terror go hand in hand: delicate, almost poetic imagery turns into nightmares that are hard to forget.",
      "Hinako is no trained fighter. She defends herself with whatever she finds — pipes, tools, makeshift weapons that dull and break — and every encounter is a choice between fighting and fleeing. Resources are scarce, and the town hides puzzles that force you to understand what truly happened.",
      "A psychological horror about identity, pressure and choice, where the most frightening things aren't only in the fog.",
    ),
  },

  "anno-117-pax-romana": {
    ro: j(
      "Anul 117, apogeul Imperiului Roman. Ești numit guvernator al unei provincii și primești o misiune simplă doar în aparență: să transformi câteva așezări modeste într-o regiune prosperă, demnă de numele Romei.",
      "Construiești orașe de la temelii — case, forumuri, temple, apeducte, băi publice — și creezi lanțuri de producție tot mai complexe pentru a satisface nevoile locuitorilor. Cu cât oamenii sunt mai mulțumiți, cu atât cresc în rang, iar orașul tău devine mai bogat și mai frumos.",
      "Pe lângă inima Imperiului, administrezi și ținuturi îndepărtate precum Albionul celtic, unde decizi dacă impui cultura romană sau lași tradițiile locale să înflorească. Alegerile tale influențează economia, religia, armata și chiar stabilitatea provinciei.",
      "Comerțul pe mare, diplomația cu alte puteri și bătăliile navale completează un joc de construcție relaxant și în același timp profund, în care fiecare oraș devine o operă personală.",
    ),
    ru: j(
      "117 год, расцвет Римской империи. Тебя назначают наместником провинции и дают задание, которое простое лишь на первый взгляд: превратить несколько скромных поселений в процветающий край, достойный имени Рима.",
      "Ты строишь города с нуля — дома, форумы, храмы, акведуки, термы — и создаёшь всё более сложные производственные цепочки, чтобы удовлетворить нужды жителей. Чем довольнее люди, тем выше их сословие, и тем богаче и красивее становится город.",
      "Помимо сердца империи ты управляешь и далёкими землями вроде кельтского Альбиона, где решаешь, насаждать римскую культуру или позволить расцвести местным традициям. Твой выбор влияет на экономику, религию, армию и даже на стабильность провинции.",
      "Морская торговля, дипломатия с другими державами и морские сражения дополняют градостроительную игру — спокойную и одновременно глубокую, где каждый город становится личным произведением.",
    ),
    en: j(
      "The year 117, the height of the Roman Empire. You are appointed governor of a province and given a task that only looks simple: turn a few modest settlements into a thriving region worthy of the name of Rome.",
      "Build cities from the ground up — houses, forums, temples, aqueducts, public baths — and create ever more complex production chains to meet your citizens' needs. The happier your people, the higher they rise in rank, and the richer and more beautiful your city becomes.",
      "Beyond the heart of the Empire, you also govern distant lands such as Celtic Albion, where you decide whether to impose Roman culture or let local traditions flourish. Your choices shape the economy, religion, the army and even the province's stability.",
      "Sea trade, diplomacy with other powers and naval battles round out a city-builder that is relaxing and deep at the same time, where every city becomes a personal masterpiece.",
    ),
  },

  "death-stranding-2-on-the-beach": {
    ro: j(
      "La un an după ce a reconectat America, Sam Porter Bridges se retrage din lume, încercând să ducă o viață liniștită. Liniștea nu durează: o nouă misiune îl trimite dincolo de granițe, spre Mexic și apoi spre Australia, pentru a extinde rețeaua care ține umanitatea unită.",
      "Continuarea viziunii lui Hideo Kojima e o călătorie emoționantă despre conexiune, pierdere și ce înseamnă să mergi mai departe. Personaje vechi și noi, interpretate de actori celebri, se întâlnesc într-o poveste cinematografică, ciudată și profund umană.",
      "Transportul rămâne inima jocului: planifici trasee, echilibrezi încărcătura, construiești drumuri, poduri și tiroliene și înfrunți un teren care se schimbă sub ochii tăi — cutremure, furtuni de nisip, inundații. De data aceasta ai la dispoziție mult mai multe opțiuni de luptă și infiltrare atunci când drumul e blocat de inamici sau de creaturi.",
      "Lumea e conectată cu ceilalți jucători: structurile construite de ei te pot salva, iar ale tale îi pot ajuta pe alții. O experiență unică, care nu seamănă cu nimic altceva.",
    ),
    ru: j(
      "Через год после того, как он заново соединил Америку, Сэм Портер Бриджес уходит от мира, пытаясь жить спокойно. Покой длится недолго: новое задание отправляет его за границу — в Мексику, а затем в Австралию, чтобы расширить сеть, удерживающую человечество вместе.",
      "Продолжение замысла Хидэо Кодзимы — трогательное путешествие о связи, потере и о том, что значит идти дальше. Старые и новые персонажи в исполнении известных актёров встречаются в кинематографичной, странной и глубоко человечной истории.",
      "Доставка остаётся сердцем игры: ты прокладываешь маршруты, распределяешь груз, строишь дороги, мосты и канатные переправы и противостоишь меняющейся на глазах местности — землетрясениям, песчаным бурям, наводнениям. На этот раз гораздо больше возможностей для боя и скрытности, когда путь преграждают враги или существа.",
      "Мир связан с другими игроками: их постройки могут тебя спасти, а твои — помочь другим. Уникальный опыт, не похожий ни на что другое.",
    ),
    en: j(
      "A year after reconnecting America, Sam Porter Bridges withdraws from the world, trying to live a quiet life. The quiet doesn't last: a new mission sends him beyond the borders, to Mexico and then to Australia, to extend the network that holds humanity together.",
      "The continuation of Hideo Kojima's vision is a moving journey about connection, loss and what it means to keep going. Familiar and new characters, played by well-known actors, meet in a cinematic, strange and deeply human story.",
      "Delivery remains the heart of the game: plan routes, balance your cargo, build roads, bridges and ziplines, and face terrain that changes before your eyes — earthquakes, sandstorms, floods. This time you have far more options for combat and stealth when enemies or creatures block the way.",
      "The world is connected to other players: the structures they build can save you, and yours can help others. A unique experience unlike anything else.",
    ),
  },

  "civilization-vii": {
    ro: j(
      "„Încă o tură” — puține jocuri au făcut ca aceste cuvinte să însemne atât de mult. Civilization VII îți pune în mâini destinul unui popor, de la primele așezări din Antichitate până în epoca modernă, și te provoacă să construiești o civilizație care să reziste testului timpului.",
      "Cea mai mare noutate e împărțirea istoriei în trei ere: Antichitatea, Epoca Explorărilor și Epoca Modernă. La trecerea dintre ere, civilizația ta se transformă, alegând o nouă identitate inspirată de realizările și de istoria ei, în timp ce liderul rămâne același de la început până la sfârșit.",
      "Orașele se extind natural pe hartă, comandanții conduc armate întregi, iar diplomația, comerțul, știința și cultura îți oferă căi diferite spre victorie. Fiecare eră are propriile obiective și crize, astfel încât partida rămâne interesantă de la prima la ultima tură.",
      "O strategie pe ture profundă și accesibilă, perfectă pentru serile lungi în care îți spui că mai faci doar o tură.",
    ),
    ru: j(
      "«Ещё один ход» — мало какие игры придали этим словам такой смысл. Civilization VII вручает тебе судьбу народа от первых поселений древности до современности и бросает вызов: построить цивилизацию, которая выдержит испытание временем.",
      "Главное новшество — деление истории на три эпохи: Древность, Эпоху исследований и Новое время. При переходе между эпохами твоя цивилизация преображается, выбирая новую идентичность, вдохновлённую её достижениями и историей, а лидер остаётся тем же от начала до конца.",
      "Города естественно разрастаются по карте, командиры ведут целые армии, а дипломатия, торговля, наука и культура открывают разные пути к победе. У каждой эпохи свои цели и кризисы, поэтому партия остаётся интересной с первого до последнего хода.",
      "Глубокая и доступная пошаговая стратегия — идеальна для долгих вечеров, когда обещаешь себе сделать всего один ход.",
    ),
    en: j(
      "\"One more turn\" — few games have made those words mean so much. Civilization VII hands you the destiny of a people, from the first settlements of antiquity to the modern age, and challenges you to build a civilisation that stands the test of time.",
      "The biggest change is the division of history into three ages: Antiquity, Exploration and Modern. As you cross from one age to the next, your civilisation transforms, choosing a new identity inspired by its achievements and history, while your leader stays the same from start to finish.",
      "Cities spread naturally across the map, commanders lead entire armies, and diplomacy, trade, science and culture offer different roads to victory. Every age has its own goals and crises, so the game stays gripping from the first turn to the last.",
      "A deep yet approachable turn-based strategy game, perfect for long evenings when you tell yourself you'll play just one more turn.",
    ),
  },

  "clair-obscur-expedition-33": {
    ro: j(
      "În fiecare an, Pictorița se trezește și scrie un număr pe monolitul ei. Toți cei care au acea vârstă se transformă în fum și dispar. Anul acesta, numărul e 33. Din orașul Lumière pleacă o nouă expediție, cu o singură misiune: să o distrugă pe Pictoriță, ca să nu mai picteze niciodată moartea.",
      "Clair Obscur: Expedition 33 e un RPG cu o lume de o frumusețe rară, inspirată de Franța Belle Époque și de pictură: peisaje care par tablouri vii, creaturi stranii, orașe suspendate și o coloană sonoră memorabilă. Povestea e matură, emoționantă și plină de răsturnări de situație.",
      "Lupta combină sistemul clasic pe ture cu reacții în timp real: în tura inamicului poți eschiva, para sau sări la momentul potrivit, iar în tura ta poți ținti puncte slabe sau înlănțui atacuri. Fiecare membru al expediției are un stil de luptă complet diferit și o poveste proprie.",
      "Un joc care a surprins pe toată lumea și a devenit rapid unul dintre cele mai apreciate RPG-uri ale ultimilor ani.",
    ),
    ru: j(
      "Каждый год Художница просыпается и пишет число на своём монолите. Все, кому столько лет, обращаются в дым и исчезают. В этом году число — 33. Из города Люмьер отправляется новая экспедиция с единственной целью: уничтожить Художницу, чтобы она больше никогда не рисовала смерть.",
      "Clair Obscur: Expedition 33 — RPG с миром редкой красоты, вдохновлённым Францией Прекрасной эпохи и живописью: пейзажи, похожие на ожившие картины, странные существа, парящие города и незабываемый саундтрек. История взрослая, трогательная и полная неожиданных поворотов.",
      "Бои сочетают классическую пошаговую систему с реакцией в реальном времени: в ход врага можно увернуться, парировать или подпрыгнуть в нужный момент, а в свой ход — целиться в уязвимые места или связывать атаки в цепочки. У каждого участника экспедиции совершенно свой стиль боя и своя история.",
      "Игра, удивившая всех и быстро ставшая одной из самых любимых RPG последних лет.",
    ),
    en: j(
      "Every year, the Paintress wakes and paints a number on her monolith. Everyone of that age turns to smoke and fades away. This year, the number is 33. A new expedition sets out from the city of Lumière with a single mission: destroy the Paintress so she can never paint death again.",
      "Clair Obscur: Expedition 33 is an RPG with a world of rare beauty, inspired by Belle Époque France and by painting: landscapes like living canvases, strange creatures, floating cities and an unforgettable soundtrack. The story is mature, moving and full of twists.",
      "Combat blends classic turn-based battles with real-time reactions: on the enemy's turn you can dodge, parry or jump at the right moment, and on yours you can aim for weak points or chain attacks together. Every member of the expedition has a completely different fighting style and a story of their own.",
      "A game that surprised everyone and quickly became one of the most acclaimed RPGs of recent years.",
    ),
  },

  "doom-the-dark-ages": {
    ro: j(
      "Cu mult înainte de evenimentele pe care fanii le cunosc, Doom Slayer era deja o legendă — o armă vie, temută de demoni și folosită de zei. Doom: The Dark Ages spune povestea originilor lui, într-un război medieval întunecat între oameni, zei și legiunile Iadului.",
      "Lupta e mai grea și mai brutală ca niciodată. Pe lângă armele de foc clasice, Slayerul poartă un scut-fierăstrău pe care îl poate arunca, cu care poate para lovituri și cu care se poate năpusti asupra inamicilor, plus arme de corp la corp precum un buzdugan devastator. Nu fugi de demoni — stai în picioare și îi zdrobești.",
      "Câmpurile de luptă sunt uriașe: castele asediate, fortărețe demonice și tărâmuri distruse de război. Uneori pilotezi un mech gigantic, alteori zbori pe spatele unui dragon cibernetic, iar amploarea bătăliilor depășește tot ce a oferit seria până acum.",
      "Un shooter dark fantasy intens, cu o coloană sonoră de metal apăsătoare, perfect pentru cei care vor acțiune pură, fără compromisuri.",
    ),
    ru: j(
      "Задолго до событий, известных фанатам, Палач Рока уже был легендой — живым оружием, которого боялись демоны и которым пользовались боги. Doom: The Dark Ages рассказывает историю его происхождения на фоне мрачной средневековой войны людей, богов и легионов Ада.",
      "Бои тяжелее и жёстче, чем когда-либо. Помимо классического огнестрела у Палача есть щит-пила, который можно метать, которым можно парировать удары и с которым можно врываться в толпу врагов, а также оружие ближнего боя вроде сокрушительного кистеня. От демонов не бегают — их встречают лицом к лицу и крушат.",
      "Поля сражений огромны: осаждённые замки, демонические крепости и выжженные войной земли. Иногда ты пилотируешь гигантского меха, иногда летишь на спине кибердракона, а масштаб битв превосходит всё, что серия предлагала раньше.",
      "Напряжённый шутер в стиле тёмного фэнтези с тяжёлым металлическим саундтреком — для тех, кто хочет чистого экшена без компромиссов.",
    ),
    en: j(
      "Long before the events fans know, the Doom Slayer was already a legend — a living weapon feared by demons and wielded by gods. Doom: The Dark Ages tells the story of his origins, set in a dark medieval war between humans, gods and the legions of Hell.",
      "Combat is heavier and more brutal than ever. Alongside classic firearms, the Slayer carries a shield saw he can throw, parry with and charge into enemies with, plus melee weapons such as a devastating flail. You don't run from demons — you stand your ground and crush them.",
      "The battlefields are enormous: besieged castles, demonic fortresses and war-ravaged lands. Sometimes you pilot a giant mech, sometimes you fly on the back of a cyber-dragon, and the scale of the battles surpasses anything the series has offered before.",
      "An intense dark fantasy shooter with a crushing metal soundtrack, perfect for anyone who wants pure, uncompromising action.",
    ),
  },

  "resident-evil-requiem": {
    ro: j(
      "Resident Evil Requiem aduce seria înapoi la rădăcinile ei horror. Grace Ashcroft, o analistă FBI, investighează o serie de morți misterioase, iar firul anchetei o poartă spre un trecut pe care toată lumea ar fi vrut să-l uite — tragedia din Raccoon City.",
      "Grace nu e o eroină de acțiune. E vulnerabilă, speriată și nevoită să se bazeze pe inteligență mai mult decât pe arme. Fiecare cameră întunecată, fiecare zgomot din spatele ușii și fiecare glonț rămas în încărcător contează, iar tensiunea nu te lasă nicio clipă.",
      "Poți juca atât la persoana întâi, pentru o imersiune totală, cât și la persoana a treia, în stilul clasic al seriei. Explorarea, puzzle-urile și gestionarea resurselor se îmbină cu momente de groază pură, construite cu măiestria pentru care Capcom e celebru.",
      "Un nou capitol major al celei mai cunoscute serii survival horror, care promite să te țină cu sufletul la gură până la ultimul cadru.",
    ),
    ru: j(
      "Resident Evil Requiem возвращает серию к её хоррор-корням. Грейс Эшкрофт, аналитик ФБР, расследует череду загадочных смертей, и нити расследования ведут её к прошлому, которое все хотели бы забыть, — к трагедии Раккун-Сити.",
      "Грейс — не героиня боевиков. Она уязвима, напугана и вынуждена полагаться на ум больше, чем на оружие. Каждая тёмная комната, каждый шум за дверью и каждый оставшийся в магазине патрон имеют значение, а напряжение не отпускает ни на секунду.",
      "Играть можно и от первого лица для полного погружения, и от третьего — в классическом стиле серии. Исследование, головоломки и распределение ресурсов сочетаются с моментами чистого ужаса, выстроенными с мастерством, которым славится Capcom.",
      "Новая большая глава самой известной серии survival horror, которая обещает держать в напряжении до последнего кадра.",
    ),
    en: j(
      "Resident Evil Requiem takes the series back to its horror roots. Grace Ashcroft, an FBI analyst, is investigating a string of mysterious deaths, and the trail leads her towards a past everyone would rather forget — the tragedy of Raccoon City.",
      "Grace is no action heroine. She is vulnerable, frightened and forced to rely on her wits more than her weapons. Every dark room, every sound behind a door and every bullet left in the magazine matters, and the tension never lets up.",
      "You can play in first person for total immersion or in third person, in the series' classic style. Exploration, puzzles and resource management blend with moments of pure dread, crafted with the mastery Capcom is famous for.",
      "A major new chapter in the best-known survival horror series, one that promises to keep you on the edge of your seat until the final frame.",
    ),
  },

  "ghost-of-yotei": {
    ro: j(
      "Ezo, anul 1603, ținutul sălbatic din nordul Japoniei, aflat dincolo de controlul shogunatului. Atsu, o războinică singuratică, se întoarce pe meleagurile copilăriei cu o listă de nume: cei șase oameni care i-au ucis familia. Călătoria ei de răzbunare o poartă în jurul muntelui Yōtei, sub umbra căruia totul a început.",
      "Lumea e vastă și superbă: câmpii acoperite de flori, păduri înzăpezite, râuri, sate și tabere ale mercenarilor. Explorezi liber, călare, urmând vântul, fumul sau propriile instincte, iar fiecare colț al hărții ascunde povești, dueluri și secrete.",
      "Atsu folosește o gamă variată de arme — katana, două săbii, sulița yari, odachi-ul greu sau lanțul cu seceră — și alege stilul potrivit pentru fiecare inamic. Duelurile sunt cinematografice, iar libertatea de a aborda fiecare confruntare după bunul plac face lupta mereu proaspătă.",
      "Continuarea spirituală a lui Ghost of Tsushima, o poveste despre răzbunare, supraviețuire și găsirea unui loc în lume, spusă cu o frumusețe vizuală rară.",
    ),
    ru: j(
      "Эдзо, 1603 год, — дикие северные земли Японии за пределами власти сёгуната. Ацу, одинокая воительница, возвращается в края своего детства со списком имён: шестеро людей, убивших её семью. Её путь мести проходит вокруг горы Йотэй, в тени которой всё началось.",
      "Мир огромен и прекрасен: цветущие равнины, заснеженные леса, реки, деревни и лагеря наёмников. Ты свободно исследуешь его верхом, следуя за ветром, дымом или собственным чутьём, и в каждом уголке карты скрываются истории, дуэли и тайны.",
      "Ацу владеет разным оружием — катаной, парными мечами, копьём яри, тяжёлым одати и цепью с серпом — и подбирает стиль под каждого противника. Дуэли кинематографичны, а свобода подходить к каждой схватке по-своему делает бои всегда свежими.",
      "Духовный наследник Ghost of Tsushima — история о мести, выживании и поиске своего места в мире, рассказанная с редкой визуальной красотой.",
    ),
    en: j(
      "Ezo, 1603 — the wild northern lands of Japan, beyond the reach of the shogunate. Atsu, a lone warrior, returns to the lands of her childhood with a list of names: the six people who killed her family. Her path of vengeance winds around Mount Yōtei, in whose shadow it all began.",
      "The world is vast and beautiful: flower-covered plains, snowbound forests, rivers, villages and mercenary camps. You explore freely on horseback, following the wind, the smoke or your own instincts, and every corner of the map hides stories, duels and secrets.",
      "Atsu wields a range of weapons — katana, dual swords, the yari spear, the heavy odachi and the kusarigama — and chooses the right style for every enemy. Duels are cinematic, and the freedom to approach each encounter your own way keeps combat fresh.",
      "The spiritual successor to Ghost of Tsushima, a story of revenge, survival and finding your place in the world, told with rare visual beauty.",
    ),
  },

  "monster-hunter-wilds": {
    ro: j(
      "Ținuturile Interzise nu au fost niciodată cartografiate. Pustiuri de nisip, păduri scăldate de ploaie, câmpii de cristal și vulcani adormiți adăpostesc creaturi uriașe care au trăit neatinse de oameni. Ca vânător al Breslei, pornești într-o expediție pentru a le studia, a le înțelege și, uneori, a le înfrunta.",
      "Lumea e vie și imprevizibilă. Vremea se schimbă de la o clipă la alta, iar fiecare regiune trece prin perioade de liniște, furtună și abundență care modifică atât peisajul, cât și comportamentul monștrilor. O câmpie pașnică poate deveni în câteva minute scena unei vânători uriașe.",
      "Poți alege dintre paisprezece tipuri de arme, fiecare cu un stil complet diferit — de la sabia uriașă la arcul rapid sau lancea grea. Călătorești pe spatele unui Seikret, o creatură de călărie rapidă, poți schimba armele din mers și poți ținti rănile monștrilor pentru lovituri devastatoare.",
      "Vânătorile se joacă foarte bine alături de prieteni, iar fiecare monstru învins îți oferă materiale pentru echipament tot mai puternic. Una dintre cele mai de succes aventuri de acțiune ale anului.",
    ),
    ru: j(
      "Запретные земли никогда не наносились на карты. Песчаные пустоши, залитые дождём леса, кристальные равнины и спящие вулканы скрывают огромных существ, которых не касалась рука человека. Как охотник Гильдии, ты отправляешься в экспедицию, чтобы изучить их, понять и порой сразиться с ними.",
      "Мир живой и непредсказуемый. Погода меняется в любой момент, а каждый регион проходит периоды затишья, бурь и изобилия, которые меняют и ландшафт, и поведение монстров. Мирная равнина за несколько минут может стать ареной грандиозной охоты.",
      "На выбор четырнадцать типов оружия, у каждого совершенно свой стиль — от огромного меча до быстрого лука или тяжёлого копья. Ты передвигаешься на Сейкрете, быстром ездовом существе, можешь менять оружие на ходу и целиться в раны монстров для сокрушительных ударов.",
      "Охотиться особенно здорово с друзьями, а каждый побеждённый монстр даёт материалы для всё более мощного снаряжения. Одно из самых успешных экшен-приключений года.",
    ),
    en: j(
      "The Forbidden Lands have never been mapped. Sandy wastes, rain-soaked forests, crystal plains and dormant volcanoes are home to enormous creatures that have lived untouched by humankind. As a hunter of the Guild, you set out on an expedition to study them, understand them and, at times, face them.",
      "The world is alive and unpredictable. The weather can change in an instant, and every region passes through periods of calm, storms and plenty that transform both the landscape and the monsters' behaviour. A peaceful plain can become the stage of a colossal hunt within minutes.",
      "Choose from fourteen weapon types, each with a completely different style — from the great sword to the nimble bow or the heavy lance. You ride a Seikret, a swift mount, can switch weapons on the move and target a monster's wounds for devastating strikes.",
      "Hunts are especially good fun with friends, and every monster you defeat yields materials for ever more powerful gear. One of the year's most successful action adventures.",
    ),
  },
  "ninja-gaiden-4": {
    ro: j(
      "Seria de acțiune ninja revine cu un nou erou: Yakumo, un tânăr shinobi care își croiește drum printr-un oraș cuprins de un blestem. Legendarul Ryu Hayabusa apare și el în poveste și poate fi controlat în anumite momente.",
      "Jocul este creat împreună de Team Ninja și PlatinumGames și pune accentul pe lupte rapide și spectaculoase, în care ritmul, eschivele și combinațiile de lovituri contează la fiecare pas.",
    ),
    ru: j(
      "Серия ниндзя-экшенов возвращается с новым героем — Якумо, молодым синоби, который прокладывает путь через проклятый город. Легендарный Рю Хаябуса тоже появляется в истории, и в отдельных эпизодах им можно управлять.",
      "Игру совместно создали Team Ninja и PlatinumGames. В центре — быстрые и зрелищные бои, где на каждом шагу важны темп, уклонения и связки ударов.",
    ),
    en: j(
      "The ninja action series returns with a new hero: Yakumo, a young shinobi cutting his way through a city under a curse. The legendary Ryu Hayabusa also features in the story and is playable at certain points.",
      "Co-developed by Team Ninja and PlatinumGames, it is built around fast, spectacular combat where rhythm, evasion and combos matter at every step.",
    ),
  },
  "the-outer-worlds-2": {
    ro: j(
      "Continuarea RPG-ului science-fiction la persoana întâi de la Obsidian Entertainment te duce într-o nouă colonie spațială, sfâșiată de facțiuni cu interese proprii.",
      "Îți construiești personajul prin abilități, atuuri și defecte, îți alegi tovarășii de drum și iei decizii care schimbă felul în care se desfășoară povestea — totul cu umorul satiric al seriei.",
    ),
    ru: j(
      "Продолжение научно-фантастической RPG от первого лица от Obsidian Entertainment отправляет вас в новую космическую колонию, раздираемую фракциями со своими интересами.",
      "Вы развиваете героя через навыки, сильные стороны и недостатки, выбираете спутников и принимаете решения, которые меняют ход истории, — и всё это с фирменным сатирическим юмором серии.",
    ),
    en: j(
      "The sequel to Obsidian Entertainment's first-person science-fiction RPG takes you to a new space colony torn between factions with agendas of their own.",
      "Shape your character through skills, perks and flaws, pick your companions and make choices that change how the story plays out — all with the series' satirical humour.",
    ),
  },
  "little-nightmares-iii": {
    ro: j(
      "Low și Alone, doi prieteni nedespărțiți, caută o cale de ieșire din Nowhere, un tărâm de coșmar în care fiecare încăpere ascunde o amenințare.",
      "Aventura atmosferică se joacă în doi, în cooperare online, sau singur, alături de un partener controlat de calculator. Cei doi trebuie să rezolve împreună puzzle-uri și să supraviețuiască creaturilor care îi vânează.",
    ),
    ru: j(
      "Лоу и Элоун, двое неразлучных друзей, ищут выход из Нигде — кошмарного мира, где за каждой дверью скрывается угроза.",
      "В эту атмосферную приключенческую игру можно играть вдвоём в онлайн-кооперативе или в одиночку с напарником под управлением компьютера. Вместе героям предстоит решать головоломки и выживать среди охотящихся на них существ.",
    ),
    en: j(
      "Low and Alone, two inseparable friends, search for a way out of the Nowhere, a nightmarish realm where every room hides a threat.",
      "The atmospheric adventure can be played by two in online co-op, or solo alongside a computer-controlled partner. Together they must solve puzzles and survive the creatures hunting them.",
    ),
  },
  "nioh-3": {
    ro: j(
      "Al treilea joc din seria de acțiune și RPG cu samurai de la Team Ninja te aruncă din nou în lupte crâncene cu yokai, demonii folclorului japonez.",
      "Poți schimba oricând între stilul de luptă al samuraiului și cel al ninja, iar lumea se explorează acum pe zone deschise, pline de secrete și de adversari redutabili.",
    ),
    ru: j(
      "Третья игра в серии самурайских экшен-RPG от Team Ninja снова бросает вас в жестокие схватки с ёкаями — демонами японского фольклора.",
      "Между стилями боя самурая и ниндзя можно переключаться в любой момент, а мир теперь исследуется по открытым зонам, полным тайн и грозных противников.",
    ),
    en: j(
      "The third game in Team Ninja's dark samurai action RPG series sends you back into brutal battles with yokai, the demons of Japanese folklore.",
      "Switch at any moment between the Samurai and Ninja fighting styles, and explore a world now built from open fields full of secrets and formidable foes.",
    ),
  },
  "code-vein-ii": {
    ro: j(
      "Continuarea RPG-ului de acțiune de la Bandai Namco te poartă printr-o lume post-apocaliptică, într-o poveste care se întinde peste mai multe epoci.",
      "Explorezi alături de partenerii pe care ți-i alegi, înfrunți adversari puternici în lupte exigente și descoperi treptat misterul care leagă trecutul de prezent.",
    ),
    ru: j(
      "Продолжение экшен-RPG от Bandai Namco ведёт вас через постапокалиптический мир в истории, охватывающей несколько эпох.",
      "Вы исследуете мир вместе с выбранными напарниками, сражаетесь с сильными противниками в непростых боях и постепенно раскрываете тайну, связывающую прошлое и настоящее.",
    ),
    en: j(
      "The sequel to Bandai Namco's action RPG takes you through a post-apocalyptic world, in a story that spans more than one era.",
      "Explore alongside the partners you choose, face powerful enemies in demanding battles and gradually uncover the mystery that binds the past to the present.",
    ),
  },
  "dragon-quest-vii-reimagined": {
    ro: j(
      "O reinterpretare a clasicului Dragon Quest VII, lansat inițial în 2000. Pornești dintr-un mic regat aflat pe singura insulă rămasă pe lume și vrei să afli de ce restul lumii a dispărut.",
      "Îți aduni tovarășii și călătorești dincolo de țărmurile cunoscute, descoperind pas cu pas ținuturile pierdute ale trecutului, în stilul RPG-ului clasic pe ture al seriei.",
    ),
    ru: j(
      "Переосмысление классической Dragon Quest VII, впервые вышедшей в 2000 году. Путешествие начинается в маленьком королевстве на единственном уцелевшем острове в мире — и герои хотят узнать, куда исчез остальной мир.",
      "Вы собираете спутников и отправляетесь за пределы знакомых берегов, шаг за шагом открывая утраченные земли прошлого в духе классической пошаговой RPG серии.",
    ),
    en: j(
      "A reimagining of the classic Dragon Quest VII, first released in 2000. You set out from a small kingdom on the only island left in the world, determined to find out why everything else has vanished.",
      "Gather your companions and travel beyond familiar shores, uncovering the lost lands of the past one by one in the series' classic turn-based RPG style.",
    ),
  },
  "crimson-desert": {
    ro: j(
      "O aventură de acțiune în lume deschisă, pe continentul Pywel. Îl urmezi pe Kliff în încercarea de a reconstrui facțiunea Greymane și de a salva ținutul de o amenințare tot mai apropiată.",
      "De la sălbăticii întinse și orașe aglomerate la ruine și misteriosul Abyss, drumul se croiește prin lupte și descoperiri. Jocul este dezvoltat și publicat de Pearl Abyss.",
    ),
    ru: j(
      "Приключенческий экшен в открытом мире на континенте Пайвел. Вы сопровождаете Клиффа, который пытается возродить фракцию Грейменов и спасти земли от надвигающейся угрозы.",
      "От бескрайней дикой природы и шумных городов до руин и загадочной Бездны — путь прокладывается через сражения и открытия. Игру разработала и издала Pearl Abyss.",
    ),
    en: j(
      "An open-world action adventure set on the continent of Pywel. Follow Kliff as he sets out to rebuild the Greymane faction and save the land from a looming threat.",
      "From vast wilderness and busy cities to ruins and the mysterious Abyss, you forge your path through battles and discovery. Developed and published by Pearl Abyss.",
    ),
  },
  "octopath-traveler-0": {
    ro: j(
      "Cel mai nou joc din seria Octopath Traveler spune o poveste despre refacere și răzbunare în jurul inelelor divine, pe tărâmul Orsterra.",
      "Pentru prima dată în serie îți creezi propriul protagonist și îți reclădești orașul natal distrus, iar luptele pe ture și grafica HD-2D rămân semnătura seriei.",
    ),
    ru: j(
      "Новейшая игра серии Octopath Traveler рассказывает историю восстановления и возмездия вокруг божественных колец в мире Орстерры.",
      "Впервые в серии вы создаёте собственного главного героя и восстанавливаете разрушенный родной город, а пошаговые бои и графика HD-2D остаются визитной карточкой серии.",
    ),
    en: j(
      "The newest Octopath Traveler game tells a story of restoration and retribution over the divine rings, across the realm of Orsterra.",
      "For the first time in the series you create your own protagonist and rebuild your ruined home town, while turn-based battles and HD-2D visuals remain the series' signature.",
    ),
  },
  "lies-of-p": {
    ro: j(
      "Un souls-like care întoarce pe dos povestea lui Pinocchio și o mută în decorul elegant și sumbru al epocii Belle Époque, într-un oraș cuprins de nebunie.",
      "Ești o marionetă care trebuie să-și croiască drumul prin străzi pline de automate scăpate de sub control. Lupta este exigentă, iar armele se pot combina și personaliza.",
    ),
    ru: j(
      "Соулслайк, который переворачивает историю Пиноккио и переносит её в мрачно-элегантные декорации эпохи Прекрасной эпохи, в охваченный безумием город.",
      "Вы — марионетка, которой предстоит пробиться по улицам, полным вышедших из-под контроля автоматов. Бои требовательны, а оружие можно комбинировать и настраивать.",
    ),
    en: j(
      "A soulslike that turns the story of Pinocchio on its head and sets it against the darkly elegant backdrop of the Belle Époque, in a city gripped by madness.",
      "You are a puppet who must fight through streets full of automatons gone out of control. Combat is demanding, and weapons can be combined and customised.",
    ),
  },
  "cyberpunk-2077": {
    ro: j(
      "Un RPG de acțiune în lume deschisă, plasat în viitorul întunecat din Night City, o megalopolă obsedată de putere, glamour și modificări corporale.",
      "Joci în rolul lui V, un mercenar care își construiește drumul prin implanturi cibernetice, abilități și alegeri. Orașul se explorează liber, iar deciziile tale schimbă soarta celor din jur.",
    ),
    ru: j(
      "Экшен-RPG с открытым миром в мрачном будущем Найт-Сити — мегаполиса, одержимого властью, гламуром и модификациями тела.",
      "Вы играете за Ви, наёмника, чей путь определяют кибернетические импланты, навыки и выборы. Город можно свободно исследовать, а ваши решения меняют судьбы окружающих.",
    ),
    en: j(
      "An open-world action RPG set in the dark future of Night City, a megalopolis obsessed with power, glamour and body modification.",
      "You play as V, a mercenary whose path is shaped by cybernetic implants, skills and choices. The city is yours to explore, and your decisions change the fates of those around you.",
    ),
  },
  "god-of-war-ragnarok": {
    ro: j(
      "Kratos și fiul său Atreus pornesc într-o călătorie mitică prin cele Nouă Tărâmuri, în căutarea unor răspunsuri, înainte ca Ragnarök să se abată asupra lumii.",
      "Continuarea jocului God of War din 2018 îmbină lupte puternice cu toporul și cu lamele, explorarea unor tărâmuri nordice foarte diferite și o poveste despre tată și fiu.",
    ),
    ru: j(
      "Кратос и его сын Атрей отправляются в мифическое путешествие по Девяти мирам в поисках ответов, пока на мир не обрушился Рагнарёк.",
      "Продолжение God of War 2018 года сочетает мощные бои с топором и клинками, исследование совершенно непохожих друг на друга скандинавских миров и историю об отце и сыне.",
    ),
    en: j(
      "Kratos and his son Atreus set out on a mythic journey across the Nine Realms in search of answers before Ragnarök descends on the world.",
      "The sequel to 2018's God of War combines heavy-hitting axe and blade combat, exploration of very different Norse realms and a story of father and son.",
    ),
  },
  "dead-space": {
    ro: j(
      "Clasicul survival horror science-fiction din 2008, reconstruit complet. Inginerul Isaac Clarke urcă la bordul navei miniere USG Ishimura și descoperă că echipajul a fost transformat în necromorfi.",
      "Refacerea aduce grafică, sunet și gameplay îmbunătățite, dar păstrează viziunea originalului: resurse puține, coridoare întunecate și lupte în care fiecare membru tăiat contează.",
    ),
    ru: j(
      "Классический научно-фантастический survival horror 2008 года, полностью воссозданный заново. Инженер Айзек Кларк поднимается на борт горнодобывающего корабля USG «Ишимура» и обнаруживает, что экипаж превратился в некроморфов.",
      "Ремейк улучшает графику, звук и игровой процесс, но сохраняет замысел оригинала: мало ресурсов, тёмные коридоры и бои, где важна каждая отрубленная конечность.",
    ),
    en: j(
      "The 2008 science-fiction survival-horror classic, completely rebuilt. Engineer Isaac Clarke boards the mining ship USG Ishimura and finds its crew transformed into necromorphs.",
      "The remake improves visuals, audio and gameplay while staying faithful to the original's vision: scarce resources, dark corridors and fights where every severed limb counts.",
    ),
  },
  "frostpunk-2": {
    ro: j(
      "Un joc de supraviețuire a societății, plasat la 30 de ani după viscolul apocaliptic care a devastat Pământul. Îți dezvolți și extinzi orașul într-o iarnă care nu se mai termină.",
      "Pe lângă frig și lipsuri, trebuie să ții piept facțiunilor puternice care îți urmăresc fiecare pas în Sala Consiliului, unde legile se votează și se negociază.",
    ),
    ru: j(
      "Игра о выживании общества, действие которой происходит через 30 лет после апокалиптической метели, опустошившей Землю. Вы развиваете и расширяете город посреди нескончаемой зимы.",
      "Помимо холода и нехватки ресурсов, придётся противостоять влиятельным фракциям, которые следят за каждым вашим шагом в Зале совета, где законы голосуются и обсуждаются.",
    ),
    en: j(
      "A society survival game set 30 years after an apocalyptic blizzard ravaged the Earth. Develop, expand and advance your city through a winter that never ends.",
      "Beyond the cold and the shortages, you must face the powerful factions that watch your every step in the Council Hall, where laws are voted on and negotiated.",
    ),
  },
  "total-war-warhammer-iii": {
    ro: j(
      "Încheierea trilogiei Total War: Warhammer. Îți aduni armatele și pătrunzi în Tărâmul Haosului, o dimensiune a ororilor în care se decide soarta lumii.",
      "Campania pe ture, pe o hartă uriașă, se îmbină cu bătălii în timp real cu mii de soldați, iar facțiunile demonice pot fi înfrânte — sau conduse de tine.",
    ),
    ru: j(
      "Завершение трилогии Total War: Warhammer. Соберите войска и шагните в Царство Хаоса — измерение кошмаров, где решится судьба мира.",
      "Пошаговая кампания на огромной карте сочетается со сражениями в реальном времени с тысячами воинов, а демонические фракции можно победить — или возглавить.",
    ),
    en: j(
      "The conclusion of the Total War: Warhammer trilogy. Rally your forces and step into the Realm of Chaos, a dimension of horrors where the fate of the world will be decided.",
      "A turn-based campaign on a vast map meets real-time battles with thousands of soldiers, and the daemonic factions can be defeated — or led by you.",
    ),
  },
  "crusader-kings-iii": {
    ro: j(
      "Un joc de mare strategie despre Evul Mediu, în care conduci o dinastie de-a lungul generațiilor: iubești, lupți, urzești intrigi și revendici măreția.",
      "Moartea nu este sfârșitul, ci doar începutul: când un conducător moare, continui cu moștenitorul său, iar fiecare personaj are propria personalitate, ambiții și slăbiciuni.",
    ),
    ru: j(
      "Глобальная стратегия о Средневековье, в которой вы ведёте династию через поколения: любите, сражаетесь, плетёте интриги и добиваетесь величия.",
      "Смерть — лишь начало: когда правитель умирает, вы продолжаете за его наследника, а у каждого персонажа есть собственный характер, амбиции и слабости.",
    ),
    en: j(
      "A grand strategy game about the Middle Ages in which you guide a dynasty through the generations: love, fight, scheme and claim greatness.",
      "Death is only the beginning: when a ruler dies you carry on as their heir, and every character has their own personality, ambitions and weaknesses.",
    ),
  },
  "blasphemous-2": {
    ro: j(
      "Penitentul se trezește din nou pentru a continua lupta fără sfârșit împotriva Miracolului, într-o lume nouă și periculoasă, plină de mistere și secrete.",
      "O aventură de acțiune 2D în stil metroidvania, cu grafică pixel art lucrată manual și lupte brutale împotriva unor adversari monstruoși, până la ruperea ciclului.",
    ),
    ru: j(
      "Кающийся вновь пробуждается, чтобы продолжить бесконечную борьбу с Чудом, в новом опасном мире, полном тайн и секретов.",
      "Двухмерный приключенческий экшен в духе метроидвании с нарисованной вручную пиксельной графикой и жестокими боями с чудовищными противниками — вплоть до разрыва цикла.",
    ),
    en: j(
      "The Penitent One awakens once again to continue the endless struggle against The Miracle, in a perilous new world full of mysteries and secrets.",
      "A 2D metroidvania-style action adventure with hand-crafted pixel art and brutal combat against monstrous foes that stand between you and ending the cycle.",
    ),
  },
  "subnautica-2": {
    ro: j("Joc în Acces anticipat. Explorezi oceanul unei planete extraterestre noi, aduni resurse, îți construiești baze subacvatice și unelte și afli ce se ascunde în adâncuri. Se joacă singur sau în co-op cu până la patru jucători."),
    ru: j("Игра в раннем доступе. Исследуйте океан новой инопланетной планеты, добывайте ресурсы, стройте подводные базы и инструменты и узнайте, что скрывают глубины. Можно играть одному или в кооперативе до четырёх человек."),
    en: j("In Early Access. Explore the ocean of a new alien world, gather resources, build underwater bases and tools, and find out what lies in the depths. Play alone or in co-op with up to four players."),
  },
  "minecraft-dungeons-ii": {
    ro: j("Continuarea aventurii de acțiune din universul Minecraft. Lupți cu illagerii, explorezi Sift, o dimensiune nouă, și îți echipezi eroul cu arme, armuri și artefacte. Până la patru jucători, pe același ecran sau online."),
    ru: j("Продолжение приключенческого экшена во вселенной Minecraft. Сражайтесь с иллагерами, исследуйте новое измерение Сифт и собирайте героя из оружия, брони и артефактов. До четырёх игроков на одном экране или по сети."),
    en: j("The follow-up to the Minecraft action adventure. Fight the illagers, explore the Sift, a new dimension, and kit out your hero with weapons, armour and artifacts. Up to four players, on one screen or online."),
  },
  "lego-batman-legacy-of-the-dark-knight": {
    ro: j("Povestea lui Batman în varianta LEGO: lupte cu răufăcătorii celebri, gadgeturi și un Gotham City deschis pe care îl explorezi liber. Umorul specific LEGO face jocul potrivit pentru toată familia."),
    ru: j("История Бэтмена в версии LEGO: схватки с известными злодеями, гаджеты и открытый Готэм-Сити, который можно свободно исследовать. Фирменный юмор LEGO делает игру подходящей для всей семьи."),
    en: j("Batman's story told the LEGO way: fights with famous villains, gadgets and an open Gotham City to explore freely. The signature LEGO humour makes it a fit for the whole family."),
  },
  "hades-ii": {
    ro: j("Roguelike de acțiune de la Supergiant Games. Ca Melinoë, prințesa Lumii de Dincolo, folosești vrăjitoria și darurile zeilor ca să-l înfrunți pe Cronos, Titanul Timpului. Fiecare încercare aduce alte arme, puteri și dialoguri."),
    ru: j("Экшен-рогалик от Supergiant Games. В роли Мелинои, принцессы Подземного мира, вы используете колдовство и дары богов, чтобы бросить вызов Кроносу, титану времени. Каждый забег — новое оружие, силы и диалоги."),
    en: j("An action roguelike from Supergiant Games. As Melinoë, princess of the Underworld, you use sorcery and the gods' boons to take on Chronos, the Titan of Time. Every run brings different weapons, powers and dialogue."),
  },
  "spongebob-squarepants-titans-of-the-tide": {
    ro: j("Platformer 3D în care salvezi Bikini Bottom de fantome, după cearta dintre Olandezul Zburător și Regele Neptun. Treci oricând între SpongeBob și Patrick și le combini abilitățile ca să rezolvi niveluri și lupte."),
    ru: j("3D-платформер, в котором нужно спасти Бикини-Боттом от призраков после ссоры Летучего Голландца и царя Нептуна. Переключайтесь между Губкой Бобом и Патриком и сочетайте их умения в уровнях и боях."),
    en: j("A 3D platformer in which you save Bikini Bottom from ghosts after a clash between the Flying Dutchman and King Neptune. Switch between SpongeBob and Patrick at any time and combine their skills in levels and fights."),
  },
  "ea-sports-fc-26": {
    ro: j("Simulatorul de fotbal al EA, cu cluburi, ligi și jucători licențiați. Joci cariera de antrenor sau de jucător, Ultimate Team și meciuri online, plus un mod de turneu internațional cu 48 de echipe."),
    ru: j("Футбольный симулятор EA с лицензированными клубами, лигами и игроками. Карьера тренера или игрока, Ultimate Team и онлайн-матчи, а также режим международного турнира на 48 команд."),
    en: j("EA's football sim with licensed clubs, leagues and players. Play manager or player career, Ultimate Team and online matches, plus a 48-team international tournament mode."),
  },
  "nba-2k26": {
    ro: j("Simulatorul de baschet cu echipele și jucătorii NBA și WNBA. Îți construiești cariera în MyCAREER, conduci o franciză în MyNBA sau îți strângi echipa de cărți în MyTEAM și joci online."),
    ru: j("Баскетбольный симулятор с командами и игроками НБА и ЖНБА. Стройте карьеру в MyCAREER, руководите франшизой в MyNBA или собирайте состав в MyTEAM и играйте по сети."),
    en: j("The basketball sim with NBA and WNBA teams and players. Build a career in MyCAREER, run a franchise in MyNBA or collect a squad in MyTEAM, and play online."),
  },
  "sonic-racing-crossworlds": {
    ro: j("Curse arcade cu Sonic și personajele SEGA, pe uscat, pe apă și în aer. Inelele de călătorie te mută în mijlocul cursei pe alte trasee, iar mașina se configurează după stilul tău. Se joacă și pe ecran împărțit, și online."),
    ru: j("Аркадные гонки с Соником и героями SEGA по земле, воде и воздуху. Кольца перемещения посреди заезда переносят на другие трассы, а машину можно настроить под себя. Есть разделённый экран и онлайн."),
    en: j("Arcade racing with Sonic and SEGA characters on land, water and air. Travel Rings move the race to other tracks mid-lap, and you tune your car to your style. Split-screen and online play included."),
  },
  "assassins-creed-shadows": {
    ro: j("Japonia feudală, într-o lume deschisă cu anotimpuri care se schimbă. Joci alternativ cu Naoe, o shinobi care se strecoară neobservată, și cu Yasuke, un samurai care luptă deschis."),
    ru: j("Феодальная Япония в открытом мире со сменой времён года. Вы играете то за Наоэ, синоби, которая действует скрытно, то за Ясукэ, самурая, сражающегося в открытую."),
    en: j("Feudal Japan in an open world with changing seasons. You alternate between Naoe, a shinobi who moves unseen, and Yasuke, a samurai who fights in the open."),
  },
  "split-fiction": {
    ro: j("Aventură exclusiv în doi, de la creatorii lui It Takes Two. Două scriitoare prinse în propriile povești trec prin lumi SF și fantasy, fiecare cu alte mecanici. Se joacă pe ecran împărțit sau online, iar prietenul are nevoie doar de versiunea gratuită."),
    ru: j("Приключение строго для двоих от создателей It Takes Two. Две писательницы, запертые в собственных историях, проходят научно-фантастические и фэнтезийные миры, и в каждом свои механики. Разделённый экран или онлайн; другу хватит бесплатного пропуска."),
    en: j("A strictly two-player adventure from the makers of It Takes Two. Two writers trapped in their own stories cross sci-fi and fantasy worlds, each with its own mechanics. Split-screen or online; your friend only needs the free pass."),
  },
  "two-point-museum": {
    ro: j("Construiești și administrezi muzee, de la fosile la exponate cu stafii. Trimiți expediții după piese noi, aranjezi sălile, angajezi personal și ții vizitatorii mulțumiți, cu umorul cunoscut din Two Point Hospital."),
    ru: j("Стройте и ведите музеи — от окаменелостей до экспонатов с привидениями. Отправляйте экспедиции за находками, обустраивайте залы, нанимайте персонал и радуйте посетителей, с юмором в духе Two Point Hospital."),
    en: j("Build and run museums, from fossils to haunted exhibits. Send expeditions for new pieces, lay out the halls, hire staff and keep visitors happy, with the humour of Two Point Hospital."),
  },
  "the-last-of-us-part-ii-remastered": {
    ro: j("Povestea lui Ellie și a lui Abby într-o Americă distrusă de pandemie, cu supraviețuire, furișare și lupte dure. Versiunea remasterizată adaugă grafică îmbunătățită și modul roguelike No Return."),
    ru: j("История Элли и Эбби в Америке, разрушенной пандемией: выживание, скрытность и жёсткие бои. В ремастере улучшена графика и добавлен режим-рогалик «Без возврата»."),
    en: j("Ellie and Abby's story in a pandemic-ravaged America, with survival, stealth and brutal fights. The remaster adds improved visuals and the roguelike No Return mode."),
  },
  "microsoft-flight-simulator-2024": {
    ro: j("Simulator de zbor cu întreaga planetă redată din date reale. Pilotezi avioane, elicoptere și planoare și îți construiești o carieră: zboruri cu pasageri, stingerea incendiilor din aer, căutare și salvare și alte misiuni."),
    ru: j("Авиасимулятор, в котором вся планета воссоздана по реальным данным. Самолёты, вертолёты и планеры, а также карьера пилота: пассажирские рейсы, тушение пожаров с воздуха, поисково-спасательные операции и другие задания."),
    en: j("A flight simulator with the whole planet built from real-world data. Fly planes, helicopters and gliders and build a career: passenger flights, aerial firefighting, search and rescue and more."),
  },
  "lego-horizon-adventures": {
    ro: j("Povestea lui Aloy din Horizon, spusă în stil LEGO, pentru toată familia. Vânezi mașinării, îți decorezi satul Mother's Heart și joci singur sau în co-op, pe același ecran ori online."),
    ru: j("История Элой из Horizon в стиле LEGO для всей семьи. Охотьтесь на машины, украшайте деревню Сердце Матери и играйте в одиночку или вдвоём — на одном экране или по сети."),
    en: j("Aloy's Horizon story told in LEGO style for the whole family. Hunt machines, decorate the village of Mother's Heart and play solo or in co-op, on one screen or online."),
  },
  "planet-coaster-2": {
    ro: j("Construiești și administrezi un parc de distracții: montagne russe, tobogane cu apă, piscine și magazine. Proiectezi atracțiile piesă cu piesă, urmărești bugetul și fericirea vizitatorilor și îți împarți creațiile cu alți jucători."),
    ru: j("Стройте и ведите парк развлечений: американские горки, водные горки, бассейны и магазины. Проектируйте аттракционы по деталям, следите за бюджетом и настроением гостей и делитесь творениями с другими игроками."),
    en: j("Build and run a theme park: roller coasters, water slides, pools and shops. Design rides piece by piece, watch the budget and your guests' happiness, and share your creations with other players."),
  },
  "sonic-x-shadow-generations": {
    ro: j("Două jocuri într-unul: Sonic Generations, cu Sonic clasic și modern pe nivele de mare viteză, și Shadow Generations, o aventură nouă cu Shadow și puterile lui speciale."),
    ru: j("Две игры в одной: Sonic Generations с классическим и современным Соником на скоростных уровнях и Shadow Generations — новое приключение Шэдоу с его особыми способностями."),
    en: j("Two games in one: Sonic Generations, with Classic and Modern Sonic on high-speed stages, and Shadow Generations, a new adventure for Shadow and his special powers."),
  },
  "balatro": {
    ro: j("Roguelike cu cărți de joc construit pe mâinile de poker. Strângi jokeri care schimbă regulile, îți modifici pachetul și combini efecte ca să depășești scoruri tot mai mari."),
    ru: j("Карточный рогалик на основе покерных комбинаций. Собирайте джокеров, меняющих правила, улучшайте колоду и сочетайте эффекты, чтобы набирать всё более высокие очки."),
    en: j("A card roguelike built on poker hands. Collect jokers that bend the rules, change your deck and chain effects to beat ever higher scores."),
  },
  "disney-dreamlight-valley": {
    ro: j("Joc de viață liniștit cu personaje Disney și Pixar. Cultivi, gătești, pescuiești, îți decorezi casa și valea și îndeplinești misiuni alături de eroi precum Mickey, Moana sau WALL-E."),
    ru: j("Спокойный симулятор жизни с героями Disney и Pixar. Выращивайте урожай, готовьте, рыбачьте, обустраивайте дом и долину и выполняйте задания вместе с Микки, Моаной, ВАЛЛ-И и другими."),
    en: j("A relaxed life sim with Disney and Pixar characters. Farm, cook, fish, decorate your home and the valley, and take on quests with heroes such as Mickey, Moana and WALL-E."),
  },
  "bluey-the-videogame": {
    ro: j("Joc pentru copii mici după serialul Bluey: patru episoade jucabile, locuri cunoscute din desen și jocurile preferate ale lui Bluey și Bingo. Până la patru jucători pe același ecran."),
    ru: j("Игра для малышей по мультсериалу «Блуи»: четыре играбельные серии, знакомые места и любимые игры Блуи и Бинго. До четырёх игроков на одном экране."),
    en: j("A game for young children based on the Bluey show: four playable episodes, familiar places and Bluey and Bingo's favourite games. Up to four players on one screen."),
  },
  "cities-skylines-ii": {
    ro: j("Construcție de orașe la scară mare: zonare, drumuri, transport public, servicii și economie. Orașul are anotimpuri și cicluri zi-noapte, iar locuitorii reacționează la fiecare decizie a ta."),
    ru: j("Градостроительный симулятор большого масштаба: зонирование, дороги, общественный транспорт, службы и экономика. В городе сменяются времена года и день с ночью, а жители реагируют на каждое ваше решение."),
    en: j("City building on a large scale: zoning, roads, public transport, services and the economy. The city has seasons and day-night cycles, and residents react to each of your decisions."),
  },
  "hot-wheels-unleashed-2-turbocharged": {
    ro: j("Curse arcade cu peste 130 de mașinuțe Hot Wheels pe pistele portocalii celebre. Sari, derapezi și te lovești de adversari, iar în editor îți construiești propriile trasee. Ecran împărțit și online."),
    ru: j("Аркадные гонки на более чем 130 машинках Hot Wheels по знаменитым оранжевым трассам. Прыжки, заносы и тараны соперников, а в редакторе можно строить свои трассы. Разделённый экран и онлайн."),
    en: j("Arcade racing with more than 130 Hot Wheels cars on the famous orange tracks. Jump, drift and ram your rivals, and build your own tracks in the editor. Split-screen and online."),
  },
  "paw-patrol-world": {
    ro: j("Aventură 3D pentru copii cu cățeii din Patrula cățelușilor. Explorezi liber Adventure Bay, schimbi oricând între cățeii cu vehiculele lor și îl oprești pe primarul Humdinger."),
    ru: j("3D-приключение для детей со щенками из «Щенячьего патруля». Свободно исследуйте Бухту приключений, переключайтесь между щенками и их машинами и остановите мэра Хамдингера."),
    en: j("A 3D adventure for children with the PAW Patrol pups. Roam Adventure Bay freely, switch between the pups and their vehicles at any time, and stop Mayor Humdinger."),
  },
  "dave-the-diver": {
    ro: j("Ziua pescuiești și explorezi Blue Hole, o groapă oceanică misterioasă, iar seara conduci un restaurant de sushi cu ce ai prins. Un joc pixel-art relaxat, cu multe surprize pe parcurs."),
    ru: j("Днём вы ныряете и исследуете загадочную Голубую дыру, а вечером управляете суши-рестораном из своего улова. Неспешная пиксельная игра с множеством сюрпризов."),
    en: j("By day you dive and explore the mysterious Blue Hole; by night you run a sushi restaurant with your catch. A relaxed pixel-art game with plenty of surprises."),
  },
  "lego-star-wars-the-skywalker-saga": {
    ro: j("Toate cele nouă filme ale sagăi Skywalker în stil LEGO. Peste 300 de personaje jucabile, peste 100 de vehicule și 23 de planete de explorat, cu umor potrivit pentru toată familia."),
    ru: j("Все девять фильмов саги о Скайуокерах в стиле LEGO. Более 300 играбельных персонажей, свыше 100 транспортных средств и 23 планеты, а юмор подходит для всей семьи."),
    en: j("All nine Skywalker saga films in LEGO style. Over 300 playable characters, more than 100 vehicles and 23 planets to explore, with humour for the whole family."),
  },
  "powerwash-simulator": {
    ro: j("Cureți cu mașina de spălat cu presiune case, vehicule și locuri de joacă până strălucesc. Un joc liniștit, fără grabă, pe care îl poți juca și în co-op online."),
    ru: j("Отмывайте мойкой высокого давления дома, машины и детские площадки до блеска. Спокойная игра без спешки, в которую можно играть и в онлайн-кооперативе."),
    en: j("Clean houses, vehicles and playgrounds with a pressure washer until they shine. A calm, unhurried game you can also play in online co-op."),
  },
  "forza-horizon-5": {
    ro: j("Curse în lume deschisă prin Mexic, de la deșert și jungle la orașe și vulcani, cu sute de mașini reale. Participi la festivalul Horizon, concurezi online și îți construiești propriile curse și provocări."),
    ru: j("Гонки в открытом мире по Мексике — от пустынь и джунглей до городов и вулканов — на сотнях реальных машин. Участвуйте в фестивале Horizon, соревнуйтесь онлайн и создавайте свои заезды и испытания."),
    en: j("Open-world racing across Mexico, from desert and jungle to cities and volcanoes, in hundreds of real cars. Take part in the Horizon festival, race online and build your own events and challenges."),
  },
  "overcooked-all-you-can-eat": {
    ro: j("Overcooked! 1 și 2 remasterizate, cu peste 200 de nivele. Gătiți împreună în bucătării haotice, împărțiți sarcinile și serviți comenzile la timp. Până la patru jucători, pe același ecran sau online."),
    ru: j("Ремастер Overcooked! 1 и 2 с более чем 200 уровнями. Готовьте вместе на хаотичных кухнях, делите обязанности и успевайте выдавать заказы. До четырёх игроков на одном экране или по сети."),
    en: j("Overcooked! 1 and 2 remastered, with over 200 levels. Cook together in chaotic kitchens, split the jobs and serve orders on time. Up to four players, on one screen or online."),
  },
  "minecraft-dungeons": {
    ro: j("Joc de acțiune în stilul dungeon crawler-elor clasice, în universul Minecraft. Lupți cu monștri, strângi echipament și arme și îl înfrunți pe Arch-Illager, singur sau cu până la trei prieteni."),
    ru: j("Экшен в духе классических данжен-кроулеров во вселенной Minecraft. Сражайтесь с монстрами, собирайте снаряжение и оружие и бросьте вызов Архиразбойнику в одиночку или с тремя друзьями."),
    en: j("An action game in the style of classic dungeon crawlers, set in the Minecraft universe. Fight monsters, collect gear and weapons and take on the Arch-Illager alone or with up to three friends."),
  },
  "red-dead-redemption-2": {
    ro: j("Vestul Sălbatic în 1899, în rolul lui Arthur Morgan, membru al bandei Van der Linde aflate pe fugă. O lume deschisă uriașă, cu jafuri, vânătoare, călărie și o poveste lungă despre sfârșitul unei epoci."),
    ru: j("Дикий Запад 1899 года глазами Артура Моргана из банды Ван дер Линде, скрывающейся от закона. Огромный открытый мир с ограблениями, охотой, верховой ездой и длинной историей о конце эпохи."),
    en: j("The Wild West in 1899, as Arthur Morgan of the Van der Linde gang on the run. A huge open world with robberies, hunting, riding and a long story about the end of an era."),
  },
  "the-elder-scrolls-v-skyrim-special-edition": {
    ro: j("RPG clasic în lume deschisă: ești Dovahkiin și înfrunți dragonii care s-au întors în Skyrim. Ediția specială include jocul de bază și cele trei extinderi oficiale, cu grafică îmbunătățită."),
    ru: j("Классическая ролевая игра в открытом мире: вы Довакин и противостоите драконам, вернувшимся в Скайрим. Особое издание включает основную игру и три официальных дополнения с улучшенной графикой."),
    en: j("A classic open-world RPG: you are the Dragonborn, facing the dragons that have returned to Skyrim. The Special Edition includes the base game and its three official expansions with improved visuals."),
  },
  "stardew-valley": {
    ro: j("Moștenești ferma bunicului și o refaci de la zero: cultivi, crești animale, pescuiești, explorezi minele și te împrietenești cu locuitorii orașului. Se joacă singur sau în co-op, cu prietenii."),
    ru: j("Вы получаете в наследство дедушкину ферму и восстанавливаете её с нуля: выращивайте урожай, разводите животных, рыбачьте, исследуйте шахты и заводите друзей среди жителей. Можно играть одному или в кооперативе с друзьями."),
    en: j("You inherit your grandfather's farm and rebuild it from scratch: grow crops, raise animals, fish, explore the mines and befriend the townspeople. Play alone or in co-op with friends."),
  },
  "euro-truck-simulator-2": {
    ro: j("Conduci camioane prin zeci de orașe europene și livrezi marfă pe distanțe lungi. Câștigi bani, cumperi camioane și garaje, angajezi șoferi și îți extinzi propria firmă de transport."),
    ru: j("Водите грузовики по десяткам европейских городов и доставляйте грузы на большие расстояния. Зарабатывайте, покупайте грузовики и гаражи, нанимайте водителей и развивайте свою транспортную компанию."),
    en: j("Drive trucks through dozens of European cities and deliver cargo over long distances. Earn money, buy trucks and garages, hire drivers and grow your own haulage company."),
  },
  "tony-hawks-pro-skater-3-4": {
    ro: j("Remake-ul jocurilor de skateboarding Tony Hawk's Pro Skater 3 și 4. Combini trickuri în parcuri clasice și noi, cu skateri reali, editor de parcuri și multiplayer online."),
    ru: j("Ремейк скейтбордических Tony Hawk's Pro Skater 3 и 4. Связывайте трюки в комбо в классических и новых парках, со знаменитыми скейтерами, редактором парков и онлайн-мультиплеером."),
    en: j("The remake of the skateboarding games Tony Hawk's Pro Skater 3 and 4. Chain tricks into combos in classic and new parks, with real skaters, a park editor and online multiplayer."),
  },
};
