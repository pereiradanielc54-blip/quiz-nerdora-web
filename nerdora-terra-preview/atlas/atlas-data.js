// Nerdora Atlas 1.0 — canonical structured place records shared by Discover, 3D and Terra IA.
// A place can belong to many themes without being duplicated in the data model.

const A=(id,name,country,category,subcategory,description,center,zoom,tags=[],extra={})=>({id,name,country,category,subcategory,description,center,zoom,tags,...extra});

export const ATLAS_PLACES=[
 A('amazonia','Amazônia','Brasil e países vizinhos','Natureza','Flora','Maior bloco contínuo de floresta tropical do planeta.',[-61.5,-4.5],5,['floresta tropical','biodiversidade','rio','bioma','flora','fauna','brasil']),
 A('cerrado','Cerrado','Brasil','Natureza','Bioma','Grande savana tropical sul-americana com flora altamente diversa.',[-47,-15],5,['savana','flora','bioma','brasil','biodiversidade']),
 A('pantanal','Pantanal','Brasil, Bolívia e Paraguai','Natureza','Áreas úmidas','Uma das maiores planícies alagáveis tropicais do mundo.',[-57,-17.5],5,['alagado','fauna','aves','brasil','wetland']),
 A('caatinga','Caatinga','Brasil','Natureza','Flora','Bioma semiárido de vegetação xerófita e cactáceas.',[-39,-8],5,['cactos','semiárido','flora','brasil']),
 A('serengeti','Serengeti','Tanzânia e Quênia','Natureza','Savana','Savana famosa por grandes migrações de herbívoros.',[34.8,-2.3],6,['savana','fauna','migração','leões']),
 A('congo','Bacia do Congo','África Central','Natureza','Flora','Segundo maior grande bloco de floresta tropical do planeta.',[22.5,-1.5],5,['floresta tropical','flora','fauna','áfrica']),
 A('redwood','Redwood National and State Parks','Estados Unidos','Natureza','Flora','Bosques costeiros com algumas das árvores mais altas da Terra.',[-124.02,41.4],8,['sequoia','árvores gigantes','floresta','califórnia']),
 A('sequoia','Sequoia National Park','Estados Unidos','Natureza','Flora','Bosques de sequoias-gigantes na Sierra Nevada.',[-118.565,36.486],8,['sequoia','árvores gigantes','floresta','califórnia']),
 A('sundarbans','Sundarbans','Bangladesh e Índia','Natureza','Flora','Grande região deltaica coberta por manguezais.',[89.1,21.9],6,['manguezal','delta','flora','tigre']),
 A('arashiyama','Arashiyama','Kyoto, Japão','Natureza','Flora','Bosque de bambu emblemático de Kyoto.',[135.67,35.02],11,['bambu','bosque','japão','kyoto']),
 A('namaqualand','Namaqualand','África do Sul','Natureza','Flora','Região semiárida famosa por florações sazonais espetaculares.',[17.9,-29.4],7,['flores','floração','flora','fynbos']),
 A('everest','Monte Everest','Nepal e China','Relevo','Montanha','Ponto mais alto da superfície terrestre acima do nível do mar.',[86.925,27.988],11,['montanha','himalaias','altitude','extremo']),
 A('aconcagua','Aconcágua','Argentina','Relevo','Montanha','Ponto culminante dos Andes e das Américas.',[-70.011,-32.653],10,['andes','montanha','argentina','altitude']),
 A('grand-canyon','Grand Canyon','Estados Unidos','Relevo','Cânion','Grande cânion escavado pelo rio Colorado.',[-112.14,36.06],10,['cânion','geologia','rio','erosão']),
 A('marianas','Fossa das Marianas','Pacífico Ocidental','Oceanos','Profundidade','Região oceânica que contém o Challenger Deep.',[142.2,11.35],6,['oceano','profundidade','fossa','extremo']),
 A('great-barrier','Grande Barreira de Coral','Austrália','Oceanos','Recife','Maior sistema de recifes de coral do planeta.',[147.7,-18.28],7,['coral','recife','marinho','fauna']),
 A('galapagos','Galápagos','Equador','Natureza','Ilhas','Arquipélago vulcânico conhecido pela evolução e biodiversidade.',[-90.5,-0.8],7,['ilhas','evolução','fauna','vulcão']),
 A('yellowstone','Yellowstone','Estados Unidos','Geologia','Vulcanismo','Grande sistema vulcânico e hidrotermal da América do Norte.',[-110.5,44.6],8,['vulcão','geiser','geologia','caldeira']),
 A('fuji','Monte Fuji','Japão','Geologia','Vulcão','Estratovulcão icônico da ilha de Honshu.',[138.727,35.361],10,['vulcão','japão','montanha']),
 A('kilimanjaro','Kilimanjaro','Tanzânia','Geologia','Vulcão','Grande maciço vulcânico isolado no leste da África.',[37.355,-3.067],10,['vulcão','montanha','áfrica']),
 A('giza','Pirâmides de Gizé','Egito','História','Pirâmides','Complexo monumental que inclui a Grande Pirâmide, Quéfren, Miquerinos e a Esfinge.',[31.1342,29.9792],17,['pirâmide','egito','monumento','arqueologia','maravilha'],{model3d:{kind:'giza',scale:1}}),
 A('eiffel','Torre Eiffel','França','História','Monumentos','Torre metálica construída para a Exposição Universal de 1889.',[2.2945,48.8584],18,['paris','monumento','frança','torre','engenharia'],{model3d:{kind:'eiffel',scale:1}}),
 A('cristo','Cristo Redentor','Brasil','História','Monumentos','Monumento no topo do Corcovado com vista para o Rio de Janeiro.',[-43.2105,-22.9519],18,['rio de janeiro','brasil','monumento','corcovado','maravilha'],{model3d:{kind:'cristo',scale:1}}),
 A('taj-mahal','Taj Mahal','Índia','História','Monumentos','Complexo monumental de mármore branco em Agra.',[78.0421,27.1751],18,['índia','monumento','mausoléu','maravilha'],{model3d:{kind:'taj',scale:1}}),
 A('coliseu','Coliseu','Itália','História','Monumentos','Grande anfiteatro da Roma antiga.',[12.4922,41.8902],18,['roma','itália','monumento','anfiteatro','maravilha']),
 A('machu-picchu','Machu Picchu','Peru','História','Cidade antiga','Conjunto inca em altitude nos Andes.',[-72.545,-13.1631],17,['inca','peru','arqueologia','andes','maravilha']),
 A('petra','Petra','Jordânia','História','Cidade antiga','Cidade histórica com arquitetura esculpida em rocha.',[35.4444,30.3285],17,['jordânia','arqueologia','rocha','maravilha']),
 A('angkor','Angkor Wat','Camboja','História','Templos','Grande complexo religioso da civilização Khmer.',[103.8669,13.4125],17,['templo','camboja','khmer','arqueologia']),
 A('stonehenge','Stonehenge','Reino Unido','História','Megálitos','Círculo pré-histórico de grandes blocos de pedra.',[-1.8262,51.1789],18,['megálito','arqueologia','reino unido','pré-história'],{model3d:{kind:'stonehenge',scale:1}}),
 A('moai','Rano Raraku e Moais','Ilha de Páscoa, Chile','História','Monumentos','Paisagem cultural com grande concentração de esculturas Rapa Nui.',[-109.286,-27.125],17,['moai','rapa nui','chile','ilha de páscoa','arqueologia'],{model3d:{kind:'moai',scale:1}}),
 A('great-wall','Grande Muralha da China','China','História','Engenharia','Longo sistema histórico de muralhas e fortificações.',[116.57,40.43],12,['china','muralha','engenharia','maravilha']),
 A('panama-canal','Canal do Panamá','Panamá','Engenharia','Canal','Travessia artificial que conecta Atlântico e Pacífico.',[-79.9,9.08],10,['canal','engenharia','navios','panamá']),
 A('suez','Canal de Suez','Egito','Engenharia','Canal','Canal entre o Mediterrâneo e o Mar Vermelho.',[32.55,30.5],10,['canal','engenharia','egito','navios']),
 A('burj-khalifa','Burj Khalifa','Emirados Árabes Unidos','Engenharia','Arranha-céus','Arranha-céu de altura excepcional em Dubai.',[55.2744,25.1972],18,['dubai','arranha-céu','engenharia','edifício']),
 A('tokyo','Tóquio','Japão','Cidades','Megacidade','Grande metrópole japonesa e uma das maiores regiões urbanas do planeta.',[139.6917,35.6895],14,['cidade','japão','metrópole','urbano']),
 A('sao-paulo','São Paulo','Brasil','Cidades','Megacidade','Maior metrópole do Brasil e grande centro urbano sul-americano.',[-46.6333,-23.5505],14,['cidade','brasil','metrópole','urbano']),
 A('new-york','Nova York','Estados Unidos','Cidades','Megacidade','Metrópole global na costa atlântica norte-americana.',[-74.006,40.7128],14,['cidade','manhattan','arranha-céu','urbano']),
 A('brasilia','Brasília','Brasil','Cidades','Planejamento','Capital brasileira marcada por urbanismo planejado e arquitetura modernista.',[-47.8825,-15.7942],14,['cidade','brasil','arquitetura','planejada']),
 A('dubai','Dubai','Emirados Árabes Unidos','Cidades','Engenharia','Paisagem urbana de rápido crescimento no deserto.',[55.2708,25.2048],14,['cidade','arranha-céu','deserto','urbano']),
 A('death-valley','Death Valley','Estados Unidos','Extremos','Calor','Bacia desértica muito quente e abaixo do nível do mar.',[-116.82,36.24],8,['calor','deserto','extremo','depressão']),
 A('atacama','Deserto do Atacama','Chile','Extremos','Aridez','Uma das regiões não polares mais secas do planeta.',[-69,-23],7,['deserto','aridez','chile','extremo']),
 A('danakil','Depressão de Danakil','Etiópia','Extremos','Calor e geologia','Região baixa, árida e geotermicamente ativa.',[40.3,14.2],8,['calor','depressão','geologia','extremo']),
 A('vostok','Estação Vostok','Antártida','Extremos','Frio','Base de pesquisa no interior do planalto antártico.',[106.84,-78.46],8,['antártida','frio','extremo','gelo']),
 A('point-nemo','Point Nemo','Pacífico Sul','Extremos','Isolamento','Ponto oceânico conhecido por ser extremamente distante de terras emergidas.',[-123.39,-48.88],5,['oceano','isolamento','extremo']),
 A('south-pole','Polo Sul','Antártida','Extremos','Geografia','Extremo geográfico no coração da Antártida.',[0,-89.9],7,['antártida','polo','gelo','extremo'])
];

export const LANDMARKS_3D=ATLAS_PLACES.filter(p=>p.model3d);
