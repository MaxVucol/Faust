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
};
