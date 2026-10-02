import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const P=(name,country,desc,center,zoom=5.5)=>({name,country,desc,center,zoom});
const G=(id,name,icon,desc,places)=>({id,name,icon,desc,places});

const DISCOVER=[
 {
  id:'biomas',name:'Biomas',icon:'🌍',desc:'Grandes ambientes naturais da Terra e lugares onde eles aparecem com força.',children:[
   G('floresta-tropical','Floresta Tropical','🌳','Calor, umidade e biodiversidade extraordinária.',[
    P('Amazônia','Brasil e países vizinhos','Maior bloco contínuo de floresta tropical do planeta.',[-61.5,-4.5],4.2),
    P('Bacia do Congo','África Central','Imenso corredor de floresta equatorial africana.',[22.5,-1.5],4.5),
    P('Bornéu','Sudeste Asiático','Florestas tropicais antigas cobrindo grandes áreas da ilha.',[114.5,0.8],5)
   ]),
   G('desertos','Desertos','🏜️','Paisagens áridas moldadas por vento, rocha e extremos climáticos.',[
    P('Saara','Norte da África','Gigantesca faixa desértica cruzando o norte africano.',[13,23.5],4.1),
    P('Atacama','Chile','Deserto costeiro extremamente árido entre Andes e Pacífico.',[-69,-23],5.3),
    P('Deserto da Arábia','Península Arábica','Dunas e planícies áridas em enorme escala.',[45,23],4.4)
   ]),
   G('savanas','Savanas','🦁','Campos tropicais com árvores espaçadas e forte sazonalidade.',[
    P('Serengeti','Tanzânia','Savana célebre por grandes concentrações de herbívoros.',[34.8,-2.3],5.3),
    P('Cerrado','Brasil','Mosaico de campos, savanas e matas de enorme biodiversidade.',[-47,-15],4.7),
    P('Miombo','África Austral','Extensa formação de savana arborizada.',[28,-13],4.6)
   ]),
   G('tundras','Tundras','🧊','Vegetação baixa das altas latitudes e solos frios.',[
    P('Alasca Ártico','Estados Unidos','Tundra costeira e interior do extremo norte.',[-152,69],4.7),
    P('Sibéria Ártica','Rússia','Enormes extensões de tundra no norte da Ásia.',[110,71],4.2),
    P('Groenlândia costeira','Groenlândia','Tundra nas margens livres de gelo.',[-42,72],4.2)
   ]),
   G('temperadas','Florestas Temperadas','🍂','Florestas de clima moderado e estações bem marcadas.',[
    P('Apalaches','Estados Unidos','Grandes florestas temperadas do leste norte-americano.',[-81,37],5),
    P('Europa Central','Europa','Mosaico de florestas temperadas e paisagens culturais.',[12,49],4.7),
    P('Honshu','Japão','Florestas temperadas em relevo montanhoso.',[138,36],5)
   ]),
   G('taiga','Taiga','🌲','Floresta boreal de coníferas das altas latitudes.',[
    P('Taiga Canadense','Canadá','Uma das maiores faixas de floresta boreal do mundo.',[-105,57],4.2),
    P('Taiga Siberiana','Rússia','Imensa faixa de coníferas atravessando a Sibéria.',[95,60],4.1),
    P('Lapônia','Finlândia e Suécia','Florestas boreais próximas ao Círculo Polar Ártico.',[25,67],5)
   ]),
   G('mediterraneo','Mediterrâneo','🌿','Vegetação adaptada a verões quentes e secos.',[
    P('Bacia do Mediterrâneo','Sul da Europa','Paisagem clássica de matos e bosques mediterrâneos.',[15,39],4.8),
    P('Califórnia','Estados Unidos','Chaparral e vegetação mediterrânea da costa oeste.',[-120,36],5),
    P('Cabo Ocidental','África do Sul','Fynbos com riqueza excepcional de espécies.',[18.5,-34],5.4)
   ]),
   G('marinho','Biomas Marinhos','🌊','Recifes, ilhas oceânicas e mares de alta diversidade.',[
    P('Grande Barreira de Coral','Austrália','Extenso sistema de recifes do nordeste australiano.',[147.7,-18.28],5),
    P('Triângulo de Coral','Sudeste Asiático','Região marinha de altíssima diversidade de corais.',[122,-2],4.5),
    P('Galápagos','Equador','Ecossistemas marinhos influenciados por correntes oceânicas.',[-90.5,-0.8],5.4)
   ])
  ]
 },
 {
  id:'flora',name:'Flora',icon:'🌿',desc:'Tipos de vegetação e grandes áreas onde cada formação domina a paisagem.',children:[
   G('flora-tropical','Florestas tropicais','🌴','Copas fechadas, árvores altas e enorme variedade vegetal.',[
    P('Amazônia Central','Brasil','Grandes extensões contínuas de floresta úmida.',[-62,-3],5),
    P('Congo','República Democrática do Congo','Florestas equatoriais no coração da África.',[23,-1],5),
    P('Bornéu interior','Indonésia e Malásia','Florestas tropicais antigas e densas.',[114,1],5.4)
   ]),
   G('sequoias','Sequoias e árvores gigantes','🌲','Algumas das árvores mais altas e volumosas do planeta.',[
    P('Redwood National and State Parks','Califórnia, EUA','Bosques costeiros de sequoias-vermelhas muito altas.',[-124.02,41.4],7),
    P('Sequoia National Park','Califórnia, EUA','Grandes bosques de sequoias-gigantes na Sierra Nevada.',[-118.565,36.486],7),
    P('Giant Forest','Califórnia, EUA','Concentração famosa de sequoias-gigantes.',[-118.75,36.56],8)
   ]),
   G('manguezais','Manguezais','🌱','Florestas costeiras adaptadas à água salgada e marés.',[
    P('Sundarbans','Bangladesh e Índia','Vasta paisagem deltaica coberta por manguezais.',[89.1,21.9],5.6),
    P('Delta do Mekong','Vietnã','Manguezais e planícies úmidas no grande delta.',[105.8,9.8],6),
    P('Costa do Amapá e Guianas','Brasil e Guianas','Longas faixas de manguezal na costa equatorial atlântica.',[-51,2],5.2)
   ]),
   G('bambu','Bambuzais','🎋','Regiões onde bambus formam manchas extensas ou paisagens marcantes.',[
    P('Sichuan','China','Montanhas e vales com extensas formações de bambu.',[103.1,30.8],5.7),
    P('Arunachal Pradesh','Índia','Nordeste indiano com grande diversidade de bambus.',[94.7,28.1],5.3),
    P('Arashiyama','Kyoto, Japão','Bosque de bambu emblemático próximo a Kyoto.',[135.67,35.02],9)
   ]),
   G('coniferas','Coníferas boreais','🌲','Pinheiros, abetos e outras coníferas dominando regiões frias.',[
    P('Escudo Canadense','Canadá','Faixa boreal de coníferas em escala continental.',[-105,57],4.4),
    P('Sibéria Central','Rússia','Taiga dominando uma enorme parte do interior asiático.',[95,60],4.4),
    P('Escandinávia','Suécia e Finlândia','Bosques boreais entre lagos e planaltos.',[20,64],5)
   ]),
   G('cactos','Cactáceas e vegetação xerófita','🌵','Plantas especializadas em sobreviver com pouca água.',[
    P('Deserto de Sonora','México e EUA','Paisagem de cactos colunares e arbustos desérticos.',[-112,32],5.4),
    P('Caatinga','Brasil','Vegetação semiárida com cactáceas e arbustos adaptados.',[-39,-8],5),
    P('Namibe','Namíbia','Plantas extremamente adaptadas à aridez costeira.',[15,-24],5.2)
   ]),
   G('fynbos','Fynbos e vegetação mediterrânea','🌺','Arbustos e flores adaptados a clima seco sazonal.',[
    P('Região Floral do Cabo','África do Sul','Hotspot botânico marcado pelo fynbos.',[18.5,-34],6),
    P('Chaparral da Califórnia','Estados Unidos','Matos mediterrâneos em colinas costeiras.',[-119,35],5.4),
    P('Mediterrâneo Oriental','Grécia e Turquia','Mosaico de maquis, bosques e vegetação seca.',[27,38],5)
   ]),
   G('flores','Campos floridos sazonais','🌼','Paisagens que ficam cobertas por florações concentradas em certas épocas.',[
    P('Namaqualand','África do Sul','Floração sazonal transforma áreas semiáridas em tapetes coloridos.',[17.9,-29.4],6),
    P('Vale das Flores','Índia','Vale alpino famoso pela diversidade de flores de altitude.',[79.6,30.73],7),
    P('Carlsbad Flower Fields','Califórnia, EUA','Campos cultivados com grandes faixas de flores coloridas.',[-117.32,33.16],9)
   ]),
   G('palmeiras','Palmeirais e florestas de palmeiras','🌴','Paisagens onde palmeiras aparecem em alta concentração.',[
    P('Vale do Cocora','Colômbia','Palmeiras-de-cera altas espalhadas pelas montanhas.',[-75.48,4.64],8),
    P('Delta do Orinoco','Venezuela','Planícies úmidas e florestas ricas em palmeiras.',[-61.1,8.7],5.5),
    P('Lençóis Maranhenses e entorno','Brasil','Restingas, buritizais e vegetação costeira associada.',[-43.1,-2.55],6.5)
   ])
  ]
 },
 {
  id:'maravilhas',name:'Maravilhas do Mundo',icon:'🏛️',desc:'Monumentos, pirâmides, templos e obras humanas extraordinárias.',children:[
   G('sete-maravilhas','Sete Maravilhas Modernas','✨','Os sete locais escolhidos na lista popularizada em 2007.',[
    P('Grande Muralha da China','China','Longo sistema histórico de muralhas e fortificações.',[116.57,40.43],7),
    P('Petra','Jordânia','Cidade histórica esculpida em rocha.',[35.444,30.328],9),
    P('Cristo Redentor','Rio de Janeiro, Brasil','Monumento no topo do Corcovado.',[-43.21,-22.951],10),
    P('Machu Picchu','Peru','Conjunto inca em altitude nos Andes.',[-72.545,-13.163],9),
    P('Chichén Itzá','México','Grande centro maia da Península de Yucatán.',[-88.568,20.684],9),
    P('Coliseu','Roma, Itália','Anfiteatro monumental da Roma antiga.',[12.492,41.89],11),
    P('Taj Mahal','Agra, Índia','Complexo monumental em mármore branco.',[78.042,27.175],10)
   ]),
   G('piramides','Pirâmides','🔺','Complexos piramidais de diferentes civilizações.',[
    P('Pirâmides de Gizé','Egito','Complexo que inclui a Grande Pirâmide e a Esfinge.',[31.134,29.979],10),
    P('Teotihuacán','México','Cidade antiga com as pirâmides do Sol e da Lua.',[-98.843,19.692],9),
    P('Pirâmides de Meroé','Sudão','Necrópoles núbias com dezenas de pirâmides.',[33.75,16.94],9),
    P('Chichén Itzá','México','Templo piramidal de Kukulcán no sítio maia.',[-88.568,20.684],10)
   ]),
   G('monumentos','Monumentos icônicos','🗿','Estruturas reconhecidas mundialmente por história ou simbolismo.',[
    P('Torre Eiffel','Paris, França','Marco metálico construído para a Exposição de 1889.',[2.2945,48.8584],11),
    P('Estátua da Liberdade','Nova York, EUA','Monumento na entrada do porto de Nova York.',[-74.0445,40.6892],11),
    P('Moais de Rano Raraku','Ilha de Páscoa, Chile','Concentração de esculturas monumentais do povo Rapa Nui.',[-109.286,-27.125],9),
    P('Ópera de Sydney','Sydney, Austrália','Conjunto arquitetônico à beira do porto.',[151.215,-33.857],11)
   ]),
   G('templos','Templos e santuários','⛩️','Grandes complexos religiosos e cerimoniais.',[
    P('Angkor Wat','Camboja','Vasto complexo de templos Khmer.',[103.867,13.412],9),
    P('Borobudur','Indonésia','Monumento budista em níveis concêntricos.',[110.203,-7.608],10),
    P('Abu Simbel','Egito','Templos escavados na rocha junto ao Nilo.',[31.625,22.337],10),
    P('Partenon','Atenas, Grécia','Templo clássico no topo da Acrópole.',[23.726,37.972],11)
   ]),
   G('cidades-antigas','Cidades antigas','🏺','Ruínas urbanas que preservam grandes capítulos da história.',[
    P('Pompeia','Itália','Cidade romana soterrada pela erupção do Vesúvio.',[14.486,40.75],10),
    P('Éfeso','Turquia','Ruínas de uma importante cidade greco-romana.',[27.341,37.94],10),
    P('Persépolis','Irã','Complexo palaciano do Império Aquemênida.',[52.891,29.935],10),
    P('Tikal','Guatemala','Grande cidade maia cercada por floresta tropical.',[-89.623,17.222],9)
   ]),
   G('megalitos','Megalitos e mistérios antigos','🪨','Estruturas de pedra de sociedades pré-históricas e antigas.',[
    P('Stonehenge','Inglaterra','Círculo megalítico construído em várias fases.',[-1.826,51.179],11),
    P('Alinhamentos de Carnac','França','Milhares de pedras erguidas em extensas fileiras.',[-3.078,47.584],10),
    P('Newgrange','Irlanda','Túmulo de passagem neolítico alinhado ao solstício.',[-6.475,53.694],11)
   ]),
   G('engenharia-maravilhas','Grandes obras de engenharia','⚙️','Infraestruturas que transformaram transporte e paisagens.',[
    P('Canal do Panamá','Panamá','Canal interoceânico atravessando o istmo.',[-79.9,9.08],7),
    P('Canal de Suez','Egito','Ligação marítima entre Mediterrâneo e Mar Vermelho.',[32.55,30.5],7),
    P('Golden Gate Bridge','São Francisco, EUA','Ponte suspensa sobre o estreito Golden Gate.',[-122.478,37.82],11),
    P('Barragem das Três Gargantas','China','Grande barragem no rio Yangtzé.',[111,30.82],9)
   ])
  ]
 },
 {
  id:'relevo',name:'Montanhas & Relevo',icon:'🏔️',desc:'Picos, cânions, planaltos, cavernas e formações rochosas.',children:[
   G('grandes-picos','Grandes picos','🏔️','Algumas das montanhas mais marcantes da Terra.',[
    P('Monte Everest','Nepal e China','Ponto mais alto da superfície terrestre acima do nível do mar.',[86.925,27.988],8),
    P('K2','Paquistão e China','Grande pico do Karakoram.',[76.514,35.88],8),
    P('Aconcágua','Argentina','Pico mais alto dos Andes.',[-70.01,-32.653],8),
    P('Denali','Alasca, EUA','Montanha dominante da cordilheira do Alasca.',[-151.007,63.069],8)
   ]),
   G('canions','Cânions','🏜️','Vales profundos esculpidos por rios e erosão.',[
    P('Grand Canyon','Arizona, EUA','Imenso cânion escavado pelo rio Colorado.',[-112.112,36.106],7),
    P('Fish River Canyon','Namíbia','Grande sistema de cânions no sul africano.',[17.58,-27.6],7),
    P('Cânion do Colca','Peru','Vale profundo atravessando os Andes.',[-71.98,-15.61],7)
   ]),
   G('planaltos','Planaltos','⛰️','Grandes superfícies elevadas em escala regional.',[
    P('Planalto Tibetano','Ásia Central','Extensa região de grande altitude entre grandes cadeias montanhosas.',[88,32],4.7),
    P('Altiplano Andino','Bolívia e Peru','Planalto elevado entre cadeias dos Andes.',[-68,-18],5.2),
    P('Planalto Etíope','Etiópia','Terras altas recortadas por vales e escarpas.',[39.5,9],5.3)
   ]),
   G('rochas','Formações rochosas','🪨','Paisagens moldadas em formas geológicas extraordinárias.',[
    P('Uluru','Austrália','Grande monólito de arenito no centro australiano.',[131.036,-25.344],9),
    P('Zhangjiajie','China','Pilares de arenito elevando-se sobre vales florestados.',[110.48,29.35],8),
    P('Meteora','Grécia','Torres rochosas com mosteiros construídos no topo.',[21.631,39.721],9),
    P('Calçada dos Gigantes','Irlanda do Norte','Colunas basálticas junto ao Atlântico.',[-6.511,55.24],10)
   ]),
   G('cavernas','Cavernas e carste','🕳️','Mundos subterrâneos e paisagens dissolvidas pela água.',[
    P('Son Doong','Vietnã','Sistema de caverna de dimensões excepcionais.',[106.287,17.456],9),
    P('Mammoth Cave','Kentucky, EUA','Extenso sistema subterrâneo conhecido por centenas de quilômetros de passagens.',[-86.1,37.19],8),
    P('Carste de Guilin','China','Torres calcárias recortando rios e planícies.',[110.29,25.27],7),
    P('Waitomo','Nova Zelândia','Cavernas calcárias conhecidas por seus glowworms.',[175.104,-38.26],9)
   ]),
   G('dunas','Grandes campos de dunas','🏜️','Areia moldada pelo vento em padrões gigantescos.',[
    P('Sossusvlei','Namíbia','Dunas altas em torno de depressões claras.',[15.29,-24.73],8),
    P('Lençóis Maranhenses','Brasil','Dunas costeiras intercaladas por lagoas sazonais.',[-43.1,-2.55],7),
    P('Rub al Khali','Península Arábica','Imenso mar de areia no interior da Arábia.',[50,20],5),
    P('Badain Jaran','China','Dunas muito altas entre lagos do deserto.',[102.5,40],6)
   ])
  ]
 },
 {
  id:'oceanos',name:'Oceanos & Mares',icon:'🌊',desc:'Recifes, fossas, buracos azuis, fiordes e mares especiais.',children:[
   G('recifes','Grandes recifes','🐠','Ecossistemas de coral que formam estruturas gigantescas.',[
    P('Grande Barreira de Coral','Austrália','Extenso mosaico de recifes no Mar de Coral.',[147.7,-18.28],5.8),
    P('Barreira de Belize','Belize','Grande sistema recifal do Caribe.',[-87.6,17.3],6),
    P('Recifes da Nova Caledônia','Nova Caledônia','Lagoas e recifes envolvendo grande parte do arquipélago.',[166.8,-21.5],5.6),
    P('Triângulo de Coral','Sudeste Asiático','Zona de enorme diversidade marinha.',[122,-2],4.8)
   ]),
   G('fossas','Fossas oceânicas','⬇️','Regiões profundas associadas a zonas de subducção.',[
    P('Fossa das Marianas','Pacífico Ocidental','Abriga o Challenger Deep, uma das regiões mais profundas conhecidas.',[142.2,11.35],5.5),
    P('Fossa de Tonga','Pacífico Sul','Profunda zona de subducção próxima ao arquipélago de Tonga.',[-174,-23],5),
    P('Fossa Peru-Chile','Pacífico Sudeste','Longa depressão oceânica junto à margem andina.',[-72,-25],4.7),
    P('Fossa de Porto Rico','Atlântico','Grande depressão ao norte de Porto Rico.',[-66,-19.5],5.2)
   ]),
   G('blue-holes','Buracos azuis','🔵','Cavidades submarinas profundas visíveis como manchas azul-escuras.',[
    P('Great Blue Hole','Belize','Grande dolina marinha circular em um atol.',[-87.535,17.316],10),
    P('Dean’s Blue Hole','Bahamas','Buraco azul profundo próximo à costa de Long Island.',[-75.008,23.106],10),
    P('Blue Hole de Dahab','Egito','Cavidade submarina junto à costa do Mar Vermelho.',[34.537,28.572],10)
   ]),
   G('fiordes','Fiordes','🏞️','Vales glaciais inundados pelo mar.',[
    P('Geirangerfjord','Noruega','Fiorde estreito cercado por montanhas íngremes.',[7.2,62.1],8),
    P('Milford Sound','Nova Zelândia','Fiorde de paredes abruptas no sudoeste da Ilha Sul.',[167.897,-44.641],8),
    P('Scoresby Sund','Groenlândia','Um dos maiores sistemas de fiordes do planeta.',[-22,70],5.8)
   ]),
   G('mares-especiais','Mares e ambientes especiais','🧭','Águas com características físicas ou ecológicas muito particulares.',[
    P('Mar Morto','Israel e Jordânia','Lago hipersalino em depressão abaixo do nível do mar.',[35.5,31.5],7),
    P('Mar Vermelho','África e Arábia','Mar estreito com recifes e águas quentes.',[38,20],4.6),
    P('Mar dos Sargaços','Atlântico Norte','Região oceânica definida por correntes e grandes massas de sargaço.',[-60,28],4),
    P('Mar de Wadden','Países Baixos, Alemanha e Dinamarca','Planícies de maré extensas na costa do Mar do Norte.',[7.5,53.5],6.5)
   ])
  ]
 },
 {
  id:'agua-gelo',name:'Água & Gelo',icon:'💧',desc:'Cachoeiras, lagos, deltas, geleiras, gêiseres e salares.',children:[
   G('cachoeiras','Grandes cachoeiras','💦','Quedas d’água de escala e paisagem impressionantes.',[
    P('Salto Ángel','Venezuela','Queda d’água muito alta no planalto das Guianas.',[-62.535,5.967],8),
    P('Cataratas do Iguaçu','Brasil e Argentina','Sistema de numerosas quedas no rio Iguaçu.',[-54.436,-25.686],9),
    P('Victoria Falls','Zâmbia e Zimbábue','Larga cortina de água no rio Zambeze.',[25.857,-17.924],9),
    P('Niagara Falls','Canadá e EUA','Conjunto de grandes quedas entre dois grandes lagos.',[-79.075,43.079],10)
   ]),
   G('lagos','Lagos extraordinários','🏞️','Grandes lagos, lagos de altitude e águas incomuns.',[
    P('Lago Baikal','Rússia','Lago tectônico profundo e muito antigo.',[107.6,53.5],5.5),
    P('Lago Titicaca','Peru e Bolívia','Grande lago navegável em altitude no Altiplano.',[-69.4,-15.8],6),
    P('Lago Superior','Canadá e EUA','Maior dos Grandes Lagos por área.',[-87.5,47.7],5.5),
    P('Lago Natron','Tanzânia','Lago alcalino de cores intensas e ambiente extremo.',[36,-2.4],7)
   ]),
   G('deltas','Rios e deltas gigantes','🌀','Onde grandes rios moldam extensas planícies e costas.',[
    P('Foz do Amazonas','Brasil','Gigantesca descarga fluvial no Atlântico.',[-49.2,0.2],5),
    P('Delta do Nilo','Egito','Leque agrícola no encontro do Nilo com o Mediterrâneo.',[31.2,31.1],5.5),
    P('Delta Ganges-Brahmaputra','Bangladesh','Enorme delta tropical e região dos Sundarbans.',[90.4,22.3],5.2),
    P('Delta do Okavango','Botsuana','Grande delta interior espalhando água pelo Kalahari.',[22.9,-19.3],6)
   ]),
   G('geleiras','Geleiras e mantos de gelo','🧊','Grandes reservas de gelo continental e alpino.',[
    P('Manto de gelo da Groenlândia','Groenlândia','Imensa cobertura de gelo sobre a maior parte da ilha.',[-42,72],4.2),
    P('Antártida','Polo Sul','Maior massa de gelo terrestre.',[0,-80],3.5),
    P('Perito Moreno','Argentina','Geleira patagônica chegando a um grande lago.',[-73.05,-50.5],8),
    P('Vatnajökull','Islândia','Grande capa de gelo cobrindo vulcões e planaltos.',[-16.8,64.4],7)
   ]),
   G('geiseres','Gêiseres e fontes termais','♨️','Áreas geotérmicas onde água quente chega à superfície.',[
    P('Yellowstone','Wyoming, EUA','Grande concentração de gêiseres e fontes termais.',[-110.828,44.46],7),
    P('Geysir','Islândia','Campo geotérmico que deu nome ao fenômeno.',[-20.3,64.31],9),
    P('Rotorua','Nova Zelândia','Paisagem geotérmica com fontes, lama e vapor.',[176.25,-38.14],8)
   ]),
   G('salares','Salares e planícies salinas','🧂','Superfícies brancas formadas pela evaporação de lagos e bacias.',[
    P('Salar de Uyuni','Bolívia','Imensa planície salina no Altiplano.',[-67.49,-20.13],7),
    P('Bonneville Salt Flats','Utah, EUA','Planície salina muito plana no Great Salt Lake Desert.',[-113.8,40.76],8),
    P('Etosha Pan','Namíbia','Grande depressão salina sazonal.',[16.1,-18.9],6.5)
   ])
  ]
 },
 {
  id:'vulcoes',name:'Vulcões & Tectônica',icon:'🌋',desc:'Vulcões, caldeiras, riftes, crateras e campos geotérmicos.',children:[
   G('vulcoes-iconicos','Vulcões icônicos','🌋','Cones e sistemas vulcânicos marcantes em diferentes continentes.',[
    P('Etna','Sicília, Itália','Grande vulcão ativo dominando a paisagem oriental da ilha.',[15,37.75],8),
    P('Kīlauea','Havaí, EUA','Sistema vulcânico muito ativo na ilha do Havaí.',[-155.29,19.42],8),
    P('Monte Fuji','Japão','Estratovulcão simétrico próximo a Tóquio.',[138.727,35.36],8),
    P('Popocatépetl','México','Vulcão ativo entre grandes áreas urbanas mexicanas.',[-98.62,19.02],8)
   ]),
   G('caldeiras','Grandes caldeiras','⭕','Depressões vulcânicas formadas por grandes episódios eruptivos.',[
    P('Yellowstone','Estados Unidos','Sistema de caldeira e grande atividade geotérmica.',[-110.7,44.6],6.5),
    P('Lago Toba','Indonésia','Grande lago preenchendo uma extensa caldeira vulcânica.',[98.88,2.68],7),
    P('Santorini','Grécia','Arquipélago em torno de uma caldeira inundada.',[25.4,36.4],8),
    P('Ngorongoro','Tanzânia','Grande caldeira ocupada por ecossistemas de savana.',[35.58,-3.16],8)
   ]),
   G('riftes','Riftes e placas tectônicas','↔️','Lugares onde a crosta está se abrindo ou placas se encontram.',[
    P('Thingvellir','Islândia','Vale associado à dorsal Mesoatlântica.',[-21.13,64.26],9),
    P('Depressão de Afar','Etiópia','Região onde sistemas de rifte se encontram.',[40.5,11.5],6),
    P('Rifte da África Oriental','Quênia e Tanzânia','Grande sistema tectônico atravessando o leste africano.',[36,-1],5),
    P('Rifte do Mar Vermelho','Mar Vermelho','Zona de separação entre África e Arábia.',[39,20],4.8)
   ]),
   G('crateras','Crateras de impacto','☄️','Marcas deixadas por grandes impactos extraterrestres.',[
    P('Meteor Crater','Arizona, EUA','Cratera de impacto muito bem preservada.',[-111.022,35.027],10),
    P('Chicxulub','Yucatán, México','Estrutura de impacto enterrada sob a Península de Yucatán.',[-89.5,21.3],6),
    P('Vredefort','África do Sul','Estrutura de impacto profundamente erodida.',[27.4,-27],6.5),
    P('Bosumtwi','Gana','Lago ocupando uma cratera de impacto.',[-1.4,6.5],8)
   ]),
   G('geotermia','Paisagens geotérmicas','🔥','Cores, minerais, vapor e água aquecida pelo interior da Terra.',[
    P('Dallol','Etiópia','Fontes hidrotermais coloridas na Depressão de Danakil.',[40.3,14.24],8),
    P('Wai-O-Tapu','Nova Zelândia','Área geotérmica de lagos coloridos e fumarolas.',[176.37,-38.36],9),
    P('Hverir','Islândia','Campo de lama fervente e fumarolas no norte islandês.',[-16.81,65.64],9)
   ])
  ]
 },
 {
  id:'ilhas',name:'Ilhas & Arquipélagos',icon:'🏝️',desc:'Ilhas vulcânicas, atóis, arquipélagos remotos e terras polares.',children:[
   G('ilhas-vulcanicas','Ilhas vulcânicas','🌋','Terras construídas ou profundamente moldadas pelo vulcanismo.',[
    P('Havaí','Estados Unidos','Cadeia de ilhas vulcânicas no Pacífico central.',[-155.5,19.6],5),
    P('Islândia','Atlântico Norte','Ilha sobre a dorsal Mesoatlântica.',[-19,65],5),
    P('Galápagos','Equador','Arquipélago vulcânico com fauna e flora endêmicas.',[-90.5,-0.8],5.5),
    P('Açores','Portugal','Arquipélago vulcânico no Atlântico Norte.',[-25.5,37.8],5.5)
   ]),
   G('atois','Atóis e ilhas de coral','🪸','Anéis de recife e ilhas baixas formadas por corais.',[
    P('Maldivas','Oceano Índico','Longas cadeias de atóis e ilhas coralinas.',[73.5,3.2],5),
    P('Tuamotu','Polinésia Francesa','Grande arquipélago dominado por atóis.',[-145,-17],4.8),
    P('Bikini Atoll','Ilhas Marshall','Atol do Pacífico central.',[165.38,11.6],7),
    P('Aldabra','Seychelles','Grande atol elevado e importante reserva natural.',[46.33,-9.42],7)
   ]),
   G('remotas','Ilhas remotas','🧭','Terras muito afastadas de grandes massas continentais.',[
    P('Ilha de Páscoa','Chile','Ilha polinésia famosa pelos moais.',[-109.35,-27.11],7),
    P('Tristan da Cunha','Atlântico Sul','Arquipélago extremamente isolado.',[-12.28,-37.1],7),
    P('Pitcairn','Pacífico Sul','Pequena ilha isolada na Polinésia.',[-130.1,-25.07],7),
    P('Santa Helena','Atlântico Sul','Ilha vulcânica isolada entre África e América do Sul.',[-5.7,-15.95],7)
   ]),
   G('grandes-arquipelagos','Grandes arquipélagos','🗺️','Conjuntos de milhares ou centenas de ilhas em escala regional.',[
    P('Indonésia','Sudeste Asiático','Enorme país-arquipélago entre Índico e Pacífico.',[118,-2],3.8),
    P('Filipinas','Sudeste Asiático','Arquipélago tropical com milhares de ilhas.',[122,12],4),
    P('Japão','Ásia Oriental','Arco de ilhas vulcânicas no Pacífico.',[138,37],4),
    P('Caribe','Américas','Grandes e Pequenas Antilhas formando um amplo arco insular.',[-72,18],4)
   ]),
   G('ilhas-polares','Ilhas polares','❄️','Ilhas dominadas por gelo, tundra e mares frios.',[
    P('Svalbard','Noruega','Arquipélago ártico de geleiras e montanhas.',[15.6,78.2],5.5),
    P('Groenlândia','Reino da Dinamarca','Maior ilha do mundo, coberta em grande parte por gelo.',[-42,72],3.8),
    P('Geórgia do Sul','Atlântico Sul','Ilha subantártica montanhosa e glaciada.',[-36.6,-54.3],6),
    P('Ellesmere','Canadá','Grande ilha do Alto Ártico canadense.',[-79,79],4.8)
   ])
  ]
 },
 {
  id:'fauna',name:'Vida Selvagem',icon:'🦋',desc:'Grandes concentrações, migrações e habitats de animais marcantes.',children:[
   G('migracoes','Grandes migrações','🦓','Regiões famosas por deslocamentos sazonais de grandes animais.',[
    P('Serengeti','Tanzânia','Rotas de gnus, zebras e outros herbívoros.',[34.8,-2.3],5.8),
    P('Masai Mara','Quênia','Continuação setentrional do ecossistema Serengeti-Mara.',[35,-1.5],6),
    P('Delta do Okavango','Botsuana','Concentração de fauna acompanhando as águas sazonais.',[22.9,-19.3],6)
   ]),
   G('gigantes-marinhos','Gigantes marinhos','🐋','Áreas conhecidas por baleias, tubarões e outros grandes animais marinhos.',[
    P('Baja California','México','Lagoas e costas usadas por diferentes espécies de baleias.',[-113,27],5.5),
    P('Tonga','Pacífico Sul','Águas visitadas por baleias-jubarte.',[-175.2,-21.2],5.5),
    P('Hermanus','África do Sul','Costa famosa pela observação de baleias.',[19.24,-34.42],8)
   ]),
   G('aves','Grandes áreas de aves','🦩','Zonas úmidas, ilhas e deltas com enormes concentrações de aves.',[
    P('Pantanal','Brasil','Planície alagável de altíssima diversidade de aves.',[-56.5,-17.5],5.5),
    P('Delta do Danúbio','Romênia e Ucrânia','Grande zona úmida e rota de aves migratórias.',[29.1,45.1],6.5),
    P('Lago Nakuru','Quênia','Lago do Vale do Rift associado a grandes concentrações de aves.',[36.08,-0.36],8),
    P('Galápagos','Equador','Aves marinhas e terrestres com elevado endemismo.',[-90.5,-0.8],5.8)
   ]),
   G('primatas','Primatas','🐒','Florestas onde grandes primatas e outras espécies encontram refúgio.',[
    P('Bwindi','Uganda','Floresta montana associada aos gorilas-das-montanhas.',[29.72,-1.05],8),
    P('Bornéu','Indonésia e Malásia','Habitat de orangotangos e muitos outros primatas.',[114.5,0.8],5.5),
    P('Bacia do Congo','África Central','Florestas de gorilas, chimpanzés e outros primatas.',[22.5,-1.5],5)
   ]),
   G('fauna-polar','Fauna polar','🐻‍❄️','Regiões frias com grandes populações adaptadas ao gelo e mares polares.',[
    P('Svalbard','Noruega','Ecossistemas árticos com ursos-polares e mamíferos marinhos.',[15.6,78.2],5.5),
    P('Churchill','Canadá','Área conhecida pela passagem sazonal de ursos-polares.',[-94.17,58.77],7),
    P('Geórgia do Sul','Atlântico Sul','Grandes colônias de pinguins e focas.',[-36.6,-54.3],6)
   ]),
   G('endemicos','Ilhas de espécies únicas','🦎','Isolamento geográfico produzindo fauna muito particular.',[
    P('Madagascar','África','Grande centro de endemismo com lêmures e muitos outros grupos.',[46.7,-19],4.6),
    P('Komodo','Indonésia','Ilhas onde vive o dragão-de-komodo.',[119.5,-8.55],7),
    P('Tasmânia','Austrália','Ilha com fauna distinta do continente australiano.',[146.8,-42],5.5),
    P('Socotra','Iêmen','Ilha isolada com flora e fauna muito particulares.',[54,12.5],6)
   ])
  ]
 },
 {
  id:'historia',name:'Civilizações & História',icon:'🏺',desc:'Cidades antigas, fortalezas, rotas históricas, lugares sagrados e arte rupestre.',children:[
   G('arqueologia','Grandes sítios arqueológicos','🏺','Ruínas que revelam antigas sociedades urbanas.',[
    P('Pompeia','Itália','Cidade romana preservada por depósitos vulcânicos.',[14.486,40.75],10),
    P('Tikal','Guatemala','Centro maia monumental em meio à floresta.',[-89.623,17.222],9),
    P('Éfeso','Turquia','Grande cidade greco-romana da Anatólia.',[27.341,37.94],10),
    P('Grande Zimbabwe','Zimbábue','Complexo de pedra associado a um importante reino africano.',[30.93,-20.27],9)
   ]),
   G('fortalezas','Castelos e fortalezas','🏰','Arquitetura defensiva em montanhas, cidades e costas.',[
    P('Neuschwanstein','Alemanha','Castelo do século XIX nos Alpes Bávaros.',[10.749,47.557],10),
    P('Castelo de Edimburgo','Escócia','Fortaleza sobre uma antiga formação vulcânica.',[-3.188,55.949],11),
    P('Castelo de Himeji','Japão','Grande castelo feudal preservado.',[134.694,34.839],11),
    P('Mont-Saint-Michel','França','Complexo fortificado e religioso em ilha de maré.',[-1.511,48.636],11)
   ]),
   G('sagrados','Lugares sagrados','🕍','Centros religiosos de enorme importância histórica e cultural.',[
    P('Cidade do Vaticano','Roma','Centro da Igreja Católica e conjunto monumental.',[12.453,41.902],12),
    P('Meca','Arábia Saudita','Cidade sagrada central para o Islã.',[39.826,21.422],10),
    P('Varanasi','Índia','Cidade religiosa às margens do Ganges.',[83,25.31],9),
    P('Jerusalém','Israel / Palestina','Cidade sagrada para múltiplas tradições religiosas.',[35.213,31.778],10)
   ]),
   G('arte-rupestre','Arte rupestre','🎨','Paisagens que preservam pinturas e gravuras antigas.',[
    P('Lascaux','França','Região da célebre caverna paleolítica.',[1.17,45.05],10),
    P('Serra da Capivara','Brasil','Grande concentração de sítios de arte rupestre.',[-42.55,-8.8],7),
    P('Kakadu','Austrália','Paisagens com longa tradição de arte rupestre aborígene.',[132.4,-12.7],6),
    P('Tassili n’Ajjer','Argélia','Planaltos do Saara com numerosos painéis rupestres.',[9.5,25.5],6)
   ]),
   G('rotas','Rotas históricas','🐫','Pontos de antigas redes de comércio e circulação cultural.',[
    P('Samarcanda','Uzbequistão','Grande cidade da Rota da Seda.',[66.96,39.65],9),
    P('Timbuktu','Mali','Centro histórico de comércio e conhecimento no Sahel.',[-3,16.77],9),
    P('Petra','Jordânia','Nó caravanista entre Arábia e Mediterrâneo.',[35.444,30.328],9),
    P('Stone Town','Zanzibar, Tanzânia','Porto histórico do Oceano Índico.',[39.19,-6.16],10)
   ]),
   G('engenharia-antiga','Engenharia antiga','🧱','Obras que mostram conhecimento técnico de antigas civilizações.',[
    P('Aqueduto de Segóvia','Espanha','Aqueduto romano monumental atravessando a cidade.',[-4.12,40.95],11),
    P('Linhas de Nazca','Peru','Grandes geoglifos desenhados no deserto.',[-75.13,-14.74],8),
    P('Terraços de Banaue','Filipinas','Paisagem agrícola de terraços em montanhas.',[121.06,16.92],8),
    P('Grande Zimbabwe','Zimbábue','Arquitetura monumental de pedra seca.',[30.93,-20.27],9)
   ])
  ]
 },
 {
  id:'cidades',name:'Cidades & Engenharia',icon:'🏙️',desc:'Megacidades, arquitetura, pontes, canais, portos e infraestrutura monumental.',children:[
   G('megacidades','Megacidades','🌆','Algumas das maiores paisagens urbanas do planeta.',[
    P('Tóquio','Japão','Extensa metrópole japonesa.',[139.69,35.68],7),
    P('São Paulo','Brasil','Grande metrópole da América do Sul.',[-46.63,-23.55],7),
    P('Nova York','Estados Unidos','Metrópole global na costa atlântica.',[-74.006,40.713],8),
    P('Xangai','China','Grande metrópole no delta do Yangtzé.',[121.47,31.23],8),
    P('Delhi','Índia','Gigantesca área urbana do norte indiano.',[77.21,28.61],7)
   ]),
   G('planejadas','Cidades planejadas e futuristas','📐','Cidades marcadas por planejamento urbano deliberado.',[
    P('Brasília','Brasil','Capital planejada com forte identidade modernista.',[-47.88,-15.79],8),
    P('Canberra','Austrália','Capital projetada em torno de eixos e lagos.',[149.13,-35.28],8),
    P('Singapura','Singapura','Cidade-estado de alta densidade e infraestrutura integrada.',[103.82,1.35],8),
    P('Dubai','Emirados Árabes Unidos','Paisagem urbana de rápido crescimento no deserto.',[55.27,25.2],8)
   ]),
   G('arranha-ceus','Arranha-céus','🏢','Marcos verticais da engenharia e arquitetura moderna.',[
    P('Burj Khalifa','Dubai','Arranha-céu de altura excepcional.',[55.274,25.197],12),
    P('Taipei 101','Taiwan','Marco urbano da capital taiwanesa.',[121.564,25.034],12),
    P('Shanghai Tower','Xangai','Torre muito alta no distrito de Pudong.',[121.506,31.234],12),
    P('One World Trade Center','Nova York','Torre dominante no sul de Manhattan.',[-74.014,40.713],12)
   ]),
   G('pontes','Pontes extraordinárias','🌉','Travessias que vencem grandes estreitos, vales e rios.',[
    P('Golden Gate','Estados Unidos','Ponte suspensa ligando São Francisco ao norte da baía.',[-122.478,37.82],11),
    P('Akashi Kaikyō','Japão','Grande ponte suspensa ligando Honshu e Awaji.',[135.021,34.617],11),
    P('Viaduto de Millau','França','Viaduto muito alto atravessando o vale do Tarn.',[3.022,44.079],11),
    P('Ponte Rio–Niterói','Brasil','Grande travessia sobre a Baía de Guanabara.',[-43.14,-22.87],10)
   ]),
   G('portos-canais','Portos e canais','⚓','Nós de transporte que conectam oceanos e redes econômicas.',[
    P('Canal do Panamá','Panamá','Travessia artificial entre Atlântico e Pacífico.',[-79.9,9.08],7),
    P('Canal de Suez','Egito','Canal entre Mediterrâneo e Mar Vermelho.',[32.55,30.5],7),
    P('Porto de Rotterdam','Países Baixos','Grande complexo portuário europeu.',[4.1,51.95],9),
    P('Porto de Singapura','Singapura','Um dos grandes nós marítimos do Sudeste Asiático.',[103.75,1.25],9)
   ]),
   G('transportes','Obras de transporte','🚄','Túneis e ferrovias vencendo mares e grandes altitudes.',[
    P('Túnel de Base de São Gotardo','Suíça','Longo túnel ferroviário sob os Alpes.',[8.6,46.6],8),
    P('Eurotúnel','França e Reino Unido','Ligação ferroviária sob o Canal da Mancha.',[1.3,51],7),
    P('Ferrovia Qinghai–Tibete','China','Linha ferroviária atravessando o planalto tibetano.',[91.1,30],5.5)
   ])
  ]
 },
 {
  id:'extremos',name:'Lugares Extremos',icon:'⚡',desc:'Calor, frio, altitude, aridez, depressões e isolamento em escala planetária.',children:[
   G('calor','Calor extremo','🔥','Regiões conhecidas por condições térmicas severas.',[
    P('Depressão de Danakil','Etiópia','Área baixa, árida e geotermicamente ativa.',[40.3,14.2],6.5),
    P('Death Valley','Califórnia, EUA','Bacia desértica muito quente e abaixo do nível do mar.',[-116.82,36.24],7),
    P('Deserto de Lut','Irã','Grande deserto de sal e areia no interior iraniano.',[58.5,30.6],6)
   ]),
   G('frio','Frio extremo','🥶','Regiões onde o inverno ou o clima polar alcançam extremos.',[
    P('Estação Vostok','Antártida','Base de pesquisa no interior do planalto antártico.',[106.84,-78.46],6),
    P('Oymyakon','Rússia','Localidade do interior siberiano conhecida por invernos extremos.',[142.78,63.46],8),
    P('Interior da Groenlândia','Groenlândia','Planície de gelo de grande altitude e clima polar.',[-40,72],5)
   ]),
   G('aridez','Aridez extrema','☀️','Lugares onde a disponibilidade de água é excepcionalmente baixa.',[
    P('Atacama','Chile','Deserto costeiro hiperárido.',[-69,-23],5.5),
    P('Vales Secos de McMurdo','Antártida','Vales polares com pouca neve e gelo superficial.',[162.3,-77.5],6),
    P('Saara Central','África','Interior extremamente árido do grande deserto.',[13,23.5],4.8)
   ]),
   G('altitude','Altitudes extremas','⬆️','Paisagens onde a vida e a ocupação chegam a grandes altitudes.',[
    P('Everest','Nepal e China','Pico mais alto acima do nível do mar.',[86.925,27.988],8),
    P('La Rinconada','Peru','Assentamento permanente em altitude muito elevada.',[-70.63,-14.63],9),
    P('Altiplano','Bolívia e Peru','Grande planalto habitado em elevadas altitudes.',[-68,-18],5.4)
   ]),
   G('depressao','Terras abaixo do nível do mar','⬇️','Depressões continentais profundas.',[
    P('Mar Morto','Israel e Jordânia','Margens localizadas muito abaixo do nível médio do mar.',[35.5,31.5],7),
    P('Depressão de Qattara','Egito','Grande depressão desértica do norte africano.',[28.6,30.5],6.5),
    P('Bacia de Turpan','China','Depressão árida no noroeste chinês.',[89.2,42.95],7),
    P('Danakil','Etiópia','Depressão tectônica baixa e quente.',[40.3,14.2],6.5)
   ]),
   G('isolamento','Isolamento extremo','🧭','Pontos e ilhas muito distantes de grandes centros populacionais.',[
    P('Point Nemo','Pacífico Sul','Ponto oceânico de máxima distância de terras emergidas.',[-123.39,-48.88],3.8),
    P('Tristan da Cunha','Atlântico Sul','Comunidade insular muito isolada.',[-12.28,-37.1],7),
    P('Polo Sul','Antártida','Extremo geográfico no coração do continente gelado.',[0,-89.9],5)
   ])
  ]
 }
];

const sheet=document.querySelector('#discoverSheet');
const backdrop=document.querySelector('#discoverBackdrop');
const closeBtn=document.querySelector('#discoverClose');
const backBtn=document.querySelector('#discoverBack');
const list=document.querySelector('#discoverList');
const step=document.querySelector('#discoverStep');
const title=document.querySelector('#discoverTitle');
const actions=document.querySelector('.discover-actions');
const infoSheet=document.querySelector('#sheet');
const locateBtn=document.querySelector('#locate');

let trail=[];
let currentPlace=null;
let terraMap=null;

function countPlaces(node){
 if(node.places)return node.places.length;
 return (node.children||[]).reduce((n,c)=>n+countPlaces(c),0);
}

function flattenPlaces(){
 const out=[];
 const walk=(nodes,path=[])=>{
  for(const n of nodes){
   const next=[...path,n.name];
   if(n.places){
    n.places.forEach(p=>out.push({...p,icon:n.icon,path:next.join(' › '),kind:n.name}));
   }
   if(n.children)walk(n.children,next);
  }
 };
 walk(DISCOVER);
 return out;
}
const ALL_PLACES=flattenPlaces();

function ensureSearch(){
 if(document.querySelector('#discoverSearch'))return;
 const wrap=document.createElement('div');
 wrap.className='discover-search-wrap';
 wrap.innerHTML='<span>⌕</span><input id="discoverSearch" type="search" autocomplete="off" placeholder="Buscar lugar, monumento, flora...">';
 actions.appendChild(wrap);
 const input=wrap.querySelector('input');
 input.addEventListener('input',()=>{
  const q=input.value.trim().toLocaleLowerCase('pt-BR');
  if(q.length<2){renderCurrent();return}
  const matches=ALL_PLACES.filter(p=>(p.name+' '+p.country+' '+p.desc+' '+p.path).toLocaleLowerCase('pt-BR').includes(q)).slice(0,40);
  renderSearch(matches,q);
 });
}

function openDiscover(){
 document.querySelector('#liveSheet')?.classList.remove('open');
 infoSheet?.classList.remove('open');
 trail=[];
 sheet.classList.add('open');
 sheet.setAttribute('aria-hidden','false');
 ensureSearch();
 const input=document.querySelector('#discoverSearch');
 if(input)input.value='';
 renderCurrent();
}

function closeDiscover(){
 sheet.classList.remove('open');
 sheet.setAttribute('aria-hidden','true');
 trail=[];
}

function currentNodes(){
 if(!trail.length)return DISCOVER;
 return trail[trail.length-1].children||[];
}

function renderCurrent(){
 const input=document.querySelector('#discoverSearch');
 if(input&&input.value.trim().length>=2)return;
 const nodes=currentNodes();
 const parent=trail[trail.length-1];
 step.textContent=trail.length?'SUBCATEGORIAS':'CATEGORIAS';
 title.textContent=parent?parent.name:'Descubra a Terra';
 backBtn.classList.toggle('show',trail.length>0);
 backBtn.textContent=trail.length>1?'← Voltar':'← Todas as categorias';
 list.className='discover-list '+(trail.length===0?'discover-root-grid':'discover-sub-grid');
 list.innerHTML=nodes.map(n=>{
  const total=countPlaces(n);
  return `<button class="discover-item discover-category" data-node="${n.id}">
    <div class="top"><div class="icon">${n.icon}</div><b>${n.name}</b></div>
    <p>${n.desc}</p>
    <div class="meta"><span>${total} ${total===1?'lugar':'lugares'}</span><span>Ver opções ›</span></div>
  </button>`;
 }).join('');
 list.querySelectorAll('[data-node]').forEach(btn=>{
  btn.onclick=()=>{
   const node=nodes.find(n=>n.id===btn.dataset.node);
   if(!node)return;
   if(node.places)renderPlaces(node);
   else{trail.push(node);renderCurrent()}
  };
 });
}

function renderPlaces(group){
 step.textContent='LUGARES';
 title.textContent=group.name;
 backBtn.classList.add('show');
 backBtn.textContent='← Voltar';
 list.className='discover-list discover-place-grid';
 list.innerHTML=group.places.map((p,i)=>`<button class="discover-item discover-place" data-place="${i}">
   <div class="top"><div class="icon">${group.icon}</div><b>${p.name}</b></div>
   <p>${p.desc}</p>
   <div class="meta"><span>${p.country}</span><span>Localizar no globo ›</span></div>
  </button>`).join('');
 list.querySelectorAll('[data-place]').forEach(btn=>{
  btn.onclick=()=>goToPlace({...group.places[Number(btn.dataset.place)],icon:group.icon,kind:group.name});
 });
 backBtn.onclick=()=>renderCurrent();
}

function renderSearch(matches,q){
 step.textContent='BUSCA';
 title.textContent=matches.length?`${matches.length} resultados`:'Nenhum resultado';
 backBtn.classList.toggle('show',trail.length>0);
 list.className='discover-list discover-place-grid';
 list.innerHTML=matches.map((p,i)=>`<button class="discover-item discover-place" data-search-place="${i}">
   <div class="top"><div class="icon">${p.icon}</div><b>${p.name}</b></div>
   <p>${p.desc}</p>
   <div class="meta"><span>${p.country}</span><span>${p.path}</span></div>
  </button>`).join('') || `<div class="discover-empty">Nenhum lugar encontrado para “${q.replace(/[<>]/g,'')}”.</div>`;
 list.querySelectorAll('[data-search-place]').forEach(btn=>{
  btn.onclick=()=>goToPlace(matches[Number(btn.dataset.searchPlace)]);
 });
}

async function captureMap(){
 if(terraMap)return terraMap;
 const proto=maplibregl.Map.prototype;
 const original=proto.resize;
 let restored=false;
 const wrapped=function(...args){
  terraMap=this;
  return original.apply(this,args);
 };
 proto.resize=wrapped;
 window.dispatchEvent(new Event('resize'));
 await new Promise(r=>setTimeout(r,120));
 if(proto.resize===wrapped){proto.resize=original;restored=true}
 return terraMap;
}

async function goToPlace(p){
 currentPlace=p;
 closeDiscover();
 const map=await captureMap();
 if(map){
  const targetZoom=Math.min(14,(p.zoom||5.5)+2.6);
  const pitch=targetZoom>=9?58:targetZoom>=7?38:15;
  map.resize();
  map.flyTo({center:p.center,zoom:targetZoom,pitch,bearing:0,duration:2200,essential:true});
 }
 setTimeout(()=>showPlaceCard(p),1050);
}

function showPlaceCard(p){
 document.querySelector('#sheetIcon').textContent=p.icon||'📍';
 document.querySelector('#sheetKind').textContent=(p.kind||'DESCOBRIR').toUpperCase();
 document.querySelector('#sheetTitle').textContent=p.name;
 document.querySelector('#sheetText').textContent=p.desc+' • '+p.country;
 infoSheet.classList.add('open');
 infoSheet.setAttribute('aria-hidden','false');
}

function setup(){
 const discoverBtn=document.querySelector('[data-action="discover"]');
 if(discoverBtn)discoverBtn.onclick=openDiscover;
 backdrop.onclick=closeDiscover;
 closeBtn.onclick=closeDiscover;
 backBtn.onclick=()=>{
  const input=document.querySelector('#discoverSearch');
  if(input&&input.value){input.value='';renderCurrent();return}
  if(trail.length)trail.pop();
  renderCurrent();
 };
 locateBtn.onclick=()=>{if(currentPlace)goToPlace(currentPlace)};
 ensureSearch();
 captureMap();
}

if(document.readyState==='complete')setup();
else window.addEventListener('load',setup,{once:true});
