const char_roman_to_myn = [
  { id: "ggho", value: "ဂ္ဃေါ" },
  { id: "gghā", value: "ဂ္ဃါ" },

  { id: "ddho", value: "ဒ္ဓေါ" },
  { id: "ddhā", value: "ဒ္ဓါ" },

  { id: "ndho", value: "န္ဓော" }, //
  { id: "ndo", value: "န္ဒော" }, //
  { id: "ndā", value: "န္ဒာ" }, //
  { id: "ndhā", value: "န္ဓာ" }, //

  { id: "kho", value: "ခေါ" }, //
  { id: "khā", value: "ခါ" }, //
  { id: "kkho", value: "က္ခော" }, //
  { id: "kkhā", value: "က္ခာ" }, //
  { id: "go", value: "ဂေါ" }, //
  { id: "ṅo", value: "ငေါ" }, //
  { id: "dho", value: "ဓေါ" }, //
  { id: "do", value: "ဒေါ" }, //
  { id: "po", value: "ပေါ" }, //
  { id: "vo", value: "ဝေါ" }, //
  { id: "gā", value: "ဂါ" }, //
  { id: "ṅā", value: "ငါ" }, //
  { id: "dā", value: "ဒါ" }, //
  { id: "dhā", value: "ဓါ" }, //
  { id: "pā", value: "ပါ" }, //
  { id: "dvā", value: "ဒွါ" }, //
  { id: "tvā", value: "တွာ" }, //
  { id: "vā", value: "ဝါ" }, //

  //{ id: "ppho", value: "ပ္ဖေါ" },
  //{ id: "pphā", value: "ပ္ဖါ" },

  { id: "ss", value: "ဿ္" },

  { id: "vh", value: "ဝှ္" },
  { id: "vy", value: "ဝျ္" },
  { id: "vr", value: "ဝြ္" },

  { id: "yh", value: "ယှ္" },
  { id: "yy", value: "ယျ္" },
  { id: "yr", value: "ယြ္" },
  { id: "yv", value: "ယွ္" },

  { id: "hy", value: "ဟျ္" },
  { id: "hr", value: "ဟြ္" },
  { id: "hv", value: "ဟွ္" },

  { id: "rv", value: "ရွ္" },
  { id: "rh", value: "ရှ္" },
  { id: "ry", value: "ရျ္" },

  { id: "kh", value: "ခ္" },
  { id: "gh", value: "ဃ္" },
  { id: "ch", value: "ဆ္" },
  { id: "jh", value: "ဈ္" },
  { id: "ññ", value: "ည္" },
  { id: "ṭh", value: "ဌ္" },
  { id: "ḍh", value: "ဎ္" },
  { id: "th", value: "ထ္" },
  { id: "dh", value: "ဓ္" },
  { id: "ph", value: "ဖ္" },
  { id: "bh", value: "ဘ္" },
  { id: "k", value: "က္" },
  { id: "g", value: "ဂ္" },
  { id: "c", value: "စ္" },
  { id: "j", value: "ဇ္" },
  { id: "ñ", value: "ဉ္" },
  { id: "ḷ", value: "ဠ္" },
  { id: "ṭ", value: "ဋ္" },
  { id: "ḍ", value: "ဍ္" },
  { id: "ṇ", value: "ဏ္" },
  { id: "t", value: "တ္" },
  { id: "d", value: "ဒ္" },
  { id: "n", value: "န္" },
  { id: "p", value: "ပ္" },
  { id: "b", value: "ဗ္" },
  { id: "m", value: "မ္" },
  { id: "l", value: "လ္" },
  { id: "s", value: "သ္" },
  { id: "ṅ", value: "င်္" },

  { id: "္h", value: "ှ္" },
  { id: "h", value: "ဟ္" },
  { id: "္y", value: "ျ္" },
  { id: "y", value: "ယ္" },
  { id: "္r", value: "ြ္" },
  { id: "r", value: "ရ္" },
  { id: "္v", value: "ွ္" },
  { id: "v", value: "ဝ္" },
  { id: "္aṃ", value: "ံ" },
  { id: "္iṃ", value: "ိံ" },
  { id: "္uṃ", value: "ုံ" },
  { id: "္ā", value: "ာ" },
  { id: "္i", value: "ိ" },
  { id: "္ī", value: "ီ" },
  { id: "္u", value: "ု" },
  { id: "္ū", value: "ူ" },
  { id: "္e", value: "ေ" },
  { id: "္o", value: "ော" },
  { id: "aṃ", value: "အံ" },
  { id: "iṃ", value: "ဣံ" },
  { id: "uṃ", value: "ဥံ" },
  { id: "a", value: "အ" },
  { id: "ā", value: "အာ" },
  { id: "i", value: "ဣ" },
  { id: "ī", value: "ဤ" },
  { id: "u", value: "ဥ" },
  { id: "ū", value: "ဦ" },
  { id: "e", value: "ဧ" },
  { id: "o", value: "ဩ" },
  { id: "်္အ", value: "" },
  { id: "္အ", value: "" },
  { id: "1", value: "၁" }, //新增数字
  { id: "2", value: "၂" },
  { id: "3", value: "၃" },
  { id: "4", value: "၄" },
  { id: "5", value: "၅" },
  { id: "6", value: "၆" },
  { id: "7", value: "၇" },
  { id: "8", value: "၈" },
  { id: "9", value: "၉" },
  { id: "0", value: "၀" },
  { id: "ခော", value: "ခေါ" }, //矫正缅文转码错误
  { id: "ခာ", value: "ခါ" }, //kh
  { id: "က္ခေါ", value: "က္ခော" }, //kkho
  { id: "က္ခါ", value: "က္ခာ" }, //kkhā
  { id: "ဂော", value: "ဂေါ" }, //go
  { id: "ငော", value: "ငေါ" }, //ṅo
  { id: "ဓော", value: "ဓေါ" }, //dho
  { id: "ဒော", value: "ဒေါ" }, //do
  { id: "ပော", value: "ပေါ" }, //po
  { id: "ဝော", value: "ဝေါ" }, //vo
  { id: "ဂာ", value: "ဂါ" }, //gā
  { id: "ငာ", value: "ငါ" }, //ṅā
  { id: "ဒာ", value: "ဒါ" }, //dā
  { id: "ဓာ", value: "ဓါ" }, //dhā
  { id: "ပာ", value: "ပါ" }, //pā
  { id: "ဝာ", value: "ဝါ" }, //vā
  { id: "ဒွာ", value: "ဒွါ" }, //dvā
];

const char_myn_to_roman_1 = [
  { id: "ႁႏၵ", value: "ndra" }, //後加
  { id: "ခ္", value: "kh" },
  { id: "ဃ္", value: "gh" },
  { id: "ဆ္", value: "ch" },
  { id: "ဈ္", value: "jh" },
  { id: "ည္", value: "ññ" },
  { id: "ဌ္", value: "ṭh" },
  { id: "ဎ္", value: "ḍh" },
  { id: "ထ္", value: "th" },
  { id: "ဓ္", value: "dh" },
  { id: "ဖ္", value: "ph" },
  { id: "ဘ္", value: "bh" },
  { id: "က္", value: "k" },
  { id: "ဂ္", value: "g" },
  { id: "စ္", value: "c" },
  { id: "ဇ္", value: "j" },
  { id: "ဉ္", value: "ñ" },
  { id: "ဠ္", value: "ḷ" },
  { id: "ဋ္", value: "ṭ" },
  { id: "ဍ္", value: "ḍ" },
  { id: "ဏ္", value: "ṇ" },
  { id: "တ္", value: "t" },
  { id: "ဒ္", value: "d" },
  { id: "န္", value: "n" },
  { id: "ဟ္", value: "h" },
  { id: "ပ္", value: "p" },
  { id: "ဗ္", value: "b" },
  { id: "မ္", value: "m" },
  { id: "ယ္", value: "y" },
  { id: "ရ္", value: "r" },
  { id: "လ္", value: "l" },
  { id: "ဝ္", value: "v" },
  { id: "သ္", value: "s" },
  { id: "င္", value: "ṅ" },
  { id: "င်္", value: "ṅ" },
  { id: "ဿ", value: "ssa" },
  { id: "ခ", value: "kha" },
  { id: "ဃ", value: "gha" },
  { id: "ဆ", value: "cha" },
  { id: "ဈ", value: "jha" },
  { id: "စျ", value: "jha" },
  { id: "ည", value: "ñña" },
  { id: "ဌ", value: "ṭha" },
  { id: "ဎ", value: "ḍha" },
  { id: "ထ", value: "tha" },
  { id: "ဓ", value: "dha" },
  { id: "ဖ", value: "pha" },
  { id: "ဘ", value: "bha" },
  { id: "က", value: "ka" },
  { id: "ဂ", value: "ga" },
  { id: "စ", value: "ca" },
  { id: "ဇ", value: "ja" },
  { id: "ဉ", value: "ña" },
  { id: "ဠ", value: "ḷa" },
  { id: "ဋ", value: "ṭa" },
  { id: "ဍ", value: "ḍa" },
  { id: "ဏ", value: "ṇa" },
  { id: "တ", value: "ta" },
  { id: "ဒ", value: "da" },
  { id: "န", value: "na" },
  { id: "ဟ", value: "ha" },
  { id: "ပ", value: "pa" },
  { id: "ဗ", value: "ba" },
  { id: "မ", value: "ma" },
  { id: "ယ", value: "ya" },
  { id: "ရ", value: "ra" },
  { id: "႐", value: "ra" }, //后加
  { id: "လ", value: "la" },
  { id: "ဝ", value: "va" },
  { id: "သ", value: "sa" },
  { id: "aျ္", value: "ya" },
  { id: "aွ္", value: "va" },
  { id: "aြ္", value: "ra" },
  { id: "aြ", value: "ra" },

  { id: "ၱ", value: "္ta" }, //后加
  { id: "ၳ", value: "္tha" }, //后加
  { id: "ၵ", value: "္da" }, //后加
  { id: "ၶ", value: "္dha" }, //后加

  { id: "ၬ", value: "္ṭa" }, //后加
  { id: "ၭ", value: "္ṭha" }, //后加

  { id: "ၠ", value: "္ka" }, //后加
  { id: "ၡ", value: "္kha" }, //后加
  { id: "ၢ", value: "္ga" }, //后加
  { id: "ၣ", value: "္gha" }, //后加

  { id: "ၸ", value: "္pa" }, //后加
  { id: "ၹ", value: "္pha" }, //后加
  { id: "ၺ", value: "္ba" }, //后加
  { id: "႓", value: "္bha" }, //后加

  { id: "ၥ", value: "္ca" }, //后加
  { id: "ၧ", value: "္cha" }, //后加
  { id: "ၨ", value: "္ja" }, //后加
  { id: "ၩ", value: "္jha" }, //后加

  { id: "်", value: "္a" }, //后加
  { id: "ျ", value: "္ya" }, //后加
  { id: "ႅ", value: "္la" }, //后加
  { id: "ၼ", value: "္ma" }, //后加
  { id: "ွ", value: "္va" }, //后加
  { id: "ႇ", value: "္ha" }, //后加
  { id: "ႆ", value: "ssa" }, //后加
  { id: "ၷ", value: "na" }, //后加
  { id: "ၲ", value: "ta" }, //后加

  { id: "႒", value: "ṭṭha" }, //后加
  { id: "႗", value: "ṭṭa" }, //后加
  { id: "ၯ", value: "ḍḍha" }, //后加
  { id: "ၮ", value: "ḍḍa" }, //后加
  { id: "႑", value: "ṇḍa" }, //后加

  { id: "kaၤ", value: "ṅka" }, //后加
  { id: "gaၤ", value: "ṅga" }, //后加
  { id: "khaၤ", value: "ṅkha" }, //后加
  { id: "ghaၤ", value: "ṅgha" }, //后加

  { id: "aှ", value: "ha" },
  { id: "aိံ", value: "iṃ" },
  { id: "aုံ", value: "uṃ" },
  { id: "aော", value: "o" },
  { id: "aေါ", value: "o" },
  { id: "aအံ", value: "aṃ" },
  { id: "aဣံ", value: "iṃ" },
  { id: "aဥံ", value: "uṃ" },
  { id: "aံ", value: "aṃ" },
  { id: "aာ", value: "ā" },
  { id: "aါ", value: "ā" },
  { id: "aိ", value: "i" },
  { id: "aီ", value: "ī" },
  { id: "aု", value: "u" },
  { id: "aဳ", value: "u" }, //後加
  { id: "aူ", value: "ū" },
  { id: "aေ", value: "e" },
  { id: "အါ", value: "ā" },
  { id: "အာ", value: "ā" },
  { id: "အ", value: "a" },
  { id: "ဣ", value: "i" },
  { id: "ဤ", value: "ī" },
  { id: "ဥ", value: "u" },
  { id: "ဦ", value: "ū" },
  { id: "ဧ", value: "e" },
  { id: "ဩ", value: "o" },
  { id: "ႏ", value: "n" }, //後加
  { id: "ၪ", value: "ñ" }, //後加
  { id: "a္", value: "" }, //後加
  { id: "္", value: "" }, //後加
  { id: "aံ", value: "aṃ" },

  { id: "ေss", value: "sse" }, //后加
  { id: "ေkh", value: "khe" }, //后加
  { id: "ေgh", value: "ghe" }, //后加
  { id: "ေch", value: "che" }, //后加
  { id: "ေjh", value: "jhe" }, //后加
  { id: "ေññ", value: "ññe" }, //后加
  { id: "ေṭh", value: "ṭhe" }, //后加
  { id: "ေḍh", value: "ḍhe" }, //后加
  { id: "ေth", value: "the" }, //后加
  { id: "ေdh", value: "dhe" }, //后加
  { id: "ေph", value: "phe" }, //后加
  { id: "ေbh", value: "bhe" }, //后加
  { id: "ေk", value: "ke" }, //后加
  { id: "ေg", value: "ge" }, //后加
  { id: "ေc", value: "ce" }, //后加
  { id: "ေj", value: "je" }, //后加
  { id: "ေñ", value: "ñe" }, //后加
  { id: "ေḷ", value: "ḷe" }, //后加
  { id: "ေṭ", value: "ṭe" }, //后加
  { id: "ေḍ", value: "ḍe" }, //后加
  { id: "ေṇ", value: "ṇe" }, //后加
  { id: "ေt", value: "te" }, //后加
  { id: "ေd", value: "de" }, //后加
  { id: "ေn", value: "ne" }, //后加
  { id: "ေh", value: "he" }, //后加
  { id: "ေp", value: "pe" }, //后加
  { id: "ေb", value: "be" }, //后加
  { id: "ေm", value: "me" }, //后加
  { id: "ေy", value: "ye" }, //后加
  { id: "ေr", value: "re" }, //后加
  { id: "ေl", value: "le" }, //后加
  { id: "ေv", value: "ve" }, //后加
  { id: "ေs", value: "se" }, //后加
  { id: "ေy", value: "ye" }, //后加
  { id: "ေv", value: "ve" }, //后加
  { id: "ေr", value: "re" }, //后加

  { id: "ea", value: "e" }, //后加
  { id: "eā", value: "o" }, //后加

  { id: "၁", value: "1" },
  { id: "၂", value: "2" },
  { id: "၃", value: "3" },
  { id: "၄", value: "4" },
  { id: "၅", value: "5" },
  { id: "၆", value: "6" },
  { id: "၇", value: "7" },
  { id: "၈", value: "8" },
  { id: "၉", value: "9" },
  { id: "၀", value: "0" },
  { id: "း", value: "”" },
  { id: "့", value: "’" },
  { id: "။", value: "．" },
  { id: "၊", value: "，" },
];

export const roman_to_my = (input: string | undefined): string | undefined => {
  if (typeof input === "undefined") {
    return input;
  }
  let txt = input.toLowerCase();

  try {
    for (const iterator of char_roman_to_myn) {
      txt = txt.replaceAll(iterator.id, iterator.value);
    }
  } catch (err) {
    //error
    console.error(err);
  }
  return txt;
};

export const my_to_roman = (input: string | undefined): string | undefined => {
  if (typeof input === "undefined") {
    return input;
  }
  let txt = input.toLowerCase();

  try {
    for (const iterator of char_myn_to_roman_1) {
      txt = txt.replaceAll(iterator.id, iterator.value);
    }
  } catch (err) {
    //error
    console.error(err);
  }
  return txt;
};
