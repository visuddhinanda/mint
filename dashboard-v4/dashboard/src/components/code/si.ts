const char_unicode_to_si = [
  { id: "bbhr", value: "බ්භ්ර්" },
  { id: "bbhv", value: "බ්භ්ව්" },
  { id: "bbhy", value: "බ්භ්ය්" },
  { id: "cchr", value: "ච්ඡ්ර්" },
  { id: "cchv", value: "ච්ඡ්ව්" },
  { id: "cchy", value: "ච්ඡ්ය්" },
  { id: "ddhr", value: "ද්ධ්ර්" },
  { id: "ddhv", value: "ද්ධ්ව්" },
  { id: "ddhy", value: "ද්ධ්ය්" },
  { id: "ḍḍhr", value: "ඩ්ඪ්ර්" },
  { id: "ḍḍhv", value: "ඩ්ඪ්ව්" },
  { id: "ḍḍhy", value: "ඩ්ඪ්ය්" },
  { id: "gghr", value: "ග්ඝ්ර්" },
  { id: "gghv", value: "ග්ඝ්ව්" },
  { id: "gghy", value: "ග්ඝ්ය්" },
  { id: "ṅkhr", value: "ඞ්ඛ්ර්" },
  { id: "ṅkhv", value: "ඞ්ඛ්ව්" },
  { id: "ṅkhy", value: "ඞ්ඛ්ය්" },
  { id: "ṅghr", value: "ඞ්ඝ්ර්" },
  { id: "ṅghv", value: "ඞ්ඝ්ව්" },
  { id: "ṅghy", value: "ඞ්ඝ්ය්" },
  { id: "jjhr", value: "ජ්ඣ්ර්" },
  { id: "jjhv", value: "ජ්ඣ්ව්" },
  { id: "jjhy", value: "ජ්ඣ්ය්" },
  { id: "kkhr", value: "ක්ඛ්ර්" },
  { id: "kkhv", value: "ක්ඛ්ව්" },
  { id: "kkhy", value: "ක්ඛ්ය්" },
  { id: "ñchr", value: "ඤ්ඡ්ර්" },
  { id: "ñchv", value: "ඤ්ඡ්ව්" },
  { id: "ñchy", value: "ඤ්ඡ්ය්" },
  { id: "ñjhr", value: "ඤ්ඣ්ර්" },
  { id: "ñjhv", value: "ඤ්ඣ්ව්" },
  { id: "ñjhy", value: "ඤ්ඣ්ය්" },
  { id: "ṇṭhr", value: "ණ්ඨ්ර්" },
  { id: "ṇṭhv", value: "ණ්ඨ්ව්" },
  { id: "ṇṭhy", value: "ණ්ඨ්ය්" },
  { id: "ṇḍhr", value: "ණ්ඪ්ර්" },
  { id: "ṇḍhv", value: "ණ්ඪ්ව්" },
  { id: "ṇḍhy", value: "ණ්ඪ්ය්" },
  { id: "nthr", value: "න්ථ්ර්" },
  { id: "nthv", value: "න්ථ්ව්" },
  { id: "nthy", value: "න්ථ්ය්" },
  { id: "ndhr", value: "න්ධ්ර්" },
  { id: "ndhv", value: "න්ධ්ව්" },
  { id: "ndhy", value: "න්ධ්ය්" },
  { id: "pphr", value: "ප්ඵ්ර්" },
  { id: "pphv", value: "ප්ඵ්ව්" },
  { id: "pphy", value: "ප්ඵ්ය්" },
  { id: "mphr", value: "ම්ඵ්ර්" },
  { id: "mphv", value: "ම්ඵ්ව්" },
  { id: "mphy", value: "ම්ඵ්ය්" },
  { id: "mbhr", value: "ම්භ්ර්" },
  { id: "mbhv", value: "ම්භ්ව්" },
  { id: "mbhy", value: "ම්භ්ය්" },
  { id: "tthr", value: "ත්ථ්ර්" },
  { id: "tthv", value: "ත්ථ්ව්" },
  { id: "tthy", value: "ත්ථ්ය්" },
  { id: "ṭṭhr", value: "ට්ඨ්ර්" },
  { id: "ṭṭhv", value: "ට්ඨ්ව්" },
  { id: "ṭṭhy", value: "ට්ඨ්ය්" },
  { id: "bbr", value: "බ්බ්ර්" },
  { id: "bbv", value: "බ්බ්ව්" },
  { id: "bby", value: "බ්බ්ය්" },
  { id: "ccr", value: "ච්ච්ර්" },
  { id: "ccv", value: "ච්ච්ව්" },
  { id: "ccy", value: "ච්ච්ය්" },
  { id: "ddr", value: "ද්ද්ර්" },
  { id: "ddv", value: "ද්ද්ව්" },
  { id: "ddy", value: "ද්ද්ය්" },
  { id: "ḍḍr", value: "ඩ්ඩ්ර්" },
  { id: "ḍḍv", value: "ඩ්ඩ්ව්" },
  { id: "ḍḍy", value: "ඩ්ඩ්ය්" },
  { id: "ggr", value: "ග්ග්ර්" },
  { id: "ggv", value: "ග්ග්ව්" },
  { id: "ggy", value: "ග්ග්ය්" },
  { id: "jjr", value: "ජ්ජ්ර්" },
  { id: "jjv", value: "ජ්ජ්ව්" },
  { id: "jjy", value: "ජ්ජ්ය්" },
  { id: "ṅkr", value: "ඞ්ක්ර්" },
  { id: "ṅkv", value: "ඞ්ක්ව්" },
  { id: "ṅky", value: "ඞ්ක්ය්" },
  { id: "ṅgr", value: "ඞ්ග්ර්" },
  { id: "ṅgv", value: "ඞ්ග්ව්" },
  { id: "ṅgy", value: "ඞ්ග්ය්" },
  { id: "kkr", value: "ක්ක්ර්" },
  { id: "kkv", value: "ක්ක්ව්" },
  { id: "kky", value: "ක්ක්ය්" },
  { id: "ñcr", value: "ඤ්ච්ර්" },
  { id: "ñcv", value: "ඤ්ච්ව්" },
  { id: "ñcy", value: "ඤ්ච්ය්" },
  { id: "ñjr", value: "ඤ්ජ්ර්" },
  { id: "ñjv", value: "ඤ්ජ්ව්" },
  { id: "ñjy", value: "ඤ්ජ්ය්" },
  { id: "mmr", value: "ම්ම්ර්" },
  { id: "mmv", value: "ම්ම්ව්" },
  { id: "mmy", value: "ම්ම්ය්" },
  { id: "nnr", value: "න්න්ර්" },
  { id: "nnv", value: "න්න්ව්" },
  { id: "nny", value: "න්න්ය්" },
  { id: "ṇṭr", value: "ණ්ට්ර්" },
  { id: "ṇṭv", value: "ණ්ට්ව්" },
  { id: "ṇṭy", value: "ණ්ට්ය්" },
  { id: "ṇḍr", value: "ණ්ඩ්ර්" },
  { id: "ṇḍv", value: "ණ්ඩ්ව්" },
  { id: "ṇḍy", value: "ණ්ඩ්ය්" },
  { id: "ññr", value: "ඤ්ඤ්ර්" },
  { id: "ññv", value: "ඤ්ඤ්ව්" },
  { id: "ññy", value: "ඤ්ඤ්ය්" },
  { id: "ṇṇr", value: "ණ්ණ්ර්" },
  { id: "ṇṇv", value: "ණ්ණ්ව්" },
  { id: "ṇṇy", value: "ණ්ණ්ය්" },
  { id: "ppr", value: "ප්ප්ර්" },
  { id: "ppv", value: "ප්ප්ව්" },
  { id: "ppy", value: "ප්ප්ය්" },
  { id: "ntr", value: "න්ත්ර්" },
  { id: "ntv", value: "න්ත්ව්" },
  { id: "nty", value: "න්ත්ය්" },
  { id: "ndr", value: "න්ද්ර්" },
  { id: "ndv", value: "න්ද්ව්" },
  { id: "ndy", value: "න්ද්ය්" },
  { id: "ttr", value: "ත්ත්ර්" },
  { id: "ttv", value: "ත්ත්ව්" },
  { id: "tty", value: "ත්ත්ය්" },
  { id: "mpr", value: "ම්ප්ර්" },
  { id: "mpv", value: "ම්ප්ව්" },
  { id: "mpy", value: "ම්ප්ය්" },
  { id: "mbr", value: "ම්බ්ර්" },
  { id: "mbv", value: "ම්බ්ව්" },
  { id: "mby", value: "ම්බ්ය්" },
  { id: "ṭṭr", value: "ට්ට්ර්" },
  { id: "ṭṭv", value: "ට්ට්ව්" },
  { id: "ṭṭy", value: "ට්ට්ය්" },
  { id: "llr", value: "ල්ල්ර්" },
  { id: "llv", value: "ල්ල්ව්" },
  { id: "lly", value: "ල්ල්ය්" },
  { id: "ssr", value: "ස්ස්ර්" },
  { id: "ssv", value: "ස්ස්ව්" },
  { id: "ssy", value: "ස්ස්ය්" },
  { id: "yyr", value: "ය්ය්ර්" },
  { id: "yyv", value: "ය්ය්ව්" },
  { id: "yyy", value: "ය්ය්ය්" },
  { id: "bbh", value: "බ්භ්" },
  { id: "cch", value: "ච්ඡ්" },
  { id: "ddh", value: "ද්ධ්" },
  { id: "ḍḍh", value: "ඩ්ඪ්" },
  { id: "ggh", value: "ග්ඝ්" },
  { id: "jjh", value: "ජ්ඣ්" },
  { id: "kkh", value: "ක්ඛ්" },
  { id: "mbh", value: "ම්භ්" },
  { id: "mph", value: "ම්ඵ්" },
  { id: "ñch", value: "ඤ්ඡ්" },
  { id: "bhr", value: "භ්ර්" },
  { id: "bhv", value: "භ්ව්" },
  { id: "bhy", value: "භ්ය්" },
  { id: "chr", value: "ඡ්ර්" },
  { id: "chv", value: "ඡ්ව්" },
  { id: "chy", value: "ඡ්ය්" },
  { id: "dhr", value: "ධ්ර්" },
  { id: "dhv", value: "ධ්ව්" },
  { id: "dhy", value: "ධ්ය්" },
  { id: "ḍhr", value: "ඪ්ර්" },
  { id: "ḍhv", value: "ඪ්ව්" },
  { id: "ḍhy", value: "ඪ්ය්" },
  { id: "ghr", value: "ඝ්ර්" },
  { id: "ghv", value: "ඝ්ව්" },
  { id: "ghy", value: "ඝ්ය්" },
  { id: "jhr", value: "ඣ්ර්" },
  { id: "jhv", value: "ඣ්ව්" },
  { id: "jhy", value: "ඣ්ය්" },
  { id: "khr", value: "ඛ්ර්" },
  { id: "khv", value: "ඛ්ව්" },
  { id: "khy", value: "ඛ්ය්" },
  { id: "phr", value: "ඵ්ර්" },
  { id: "phv", value: "ඵ්ව්" },
  { id: "phy", value: "ඵ්ය්" },
  { id: "thr", value: "ථ්ර්" },
  { id: "thv", value: "ථ්ව්" },
  { id: "thy", value: "ථ්ය්" },
  { id: "ṭhr", value: "ඨ්ර්" },
  { id: "ṭhv", value: "ඨ්ව්" },
  { id: "ṭhy", value: "ඨ්ය්" },
  { id: "ndh", value: "න්ධ්" },
  { id: "ṇḍh", value: "ණ්ඪ්" },
  { id: "ṅgh", value: "ඞ්ඝ්" },
  { id: "ñjh", value: "ඤ්ඣ්" },
  { id: "ṅkh", value: "ඞ්ඛ්" },
  { id: "nth", value: "න්ථ්" },
  { id: "ṇṭh", value: "ණ්ඨ්" },
  { id: "pph", value: "ප්ඵ්" },
  { id: "tth", value: "ත්ථ්" },
  { id: "ṭṭh", value: "ට්ඨ්" },
  { id: "bb", value: "බ්බ්" },
  { id: "bh", value: "භ්" },
  { id: "cc", value: "ච්ච්" },
  { id: "ch", value: "ඡ්" },
  { id: "dd", value: "ද්ද්" },
  { id: "ḍḍ", value: "ඩ්ඩ්" },
  { id: "dh", value: "ධ්" },
  { id: "ḍh", value: "ඪ්" },
  { id: "gg", value: "ග්ග්" },
  { id: "gh", value: "ඝ්" },
  { id: "jh", value: "ඣ්" },
  { id: "jj", value: "ජ්ජ්" },
  { id: "kh", value: "ඛ්" },
  { id: "kk", value: "ක්ක්" },
  { id: "ll", value: "ල්ල්" },
  { id: "mb", value: "ම්බ්" },
  { id: "mm", value: "ම්ම්" },
  { id: "mp", value: "ම්ප්" },
  { id: "ñc", value: "ඤ්ච්" },
  { id: "nd", value: "න්ද්" },
  { id: "ṇḍ", value: "ණ්ඩ්" },
  { id: "ṅg", value: "ඞ්ග්" },
  { id: "ñj", value: "ඤ්ජ්" },
  { id: "ṅk", value: "ඞ්ක්" },
  { id: "nn", value: "න්න්" },
  { id: "ññ", value: "ඤ්ඤ්" },
  { id: "ṇṇ", value: "ණ්ණ්" },
  { id: "nt", value: "න්ත්" },
  { id: "br", value: "බ්ර්" },
  { id: "bv", value: "බ්ව්" },
  { id: "by", value: "බ්ය්" },
  { id: "cr", value: "ච්ර්" },
  { id: "cv", value: "ච්ව්" },
  { id: "cy", value: "ච්ය්" },
  { id: "dr", value: "ද්ර්" },
  { id: "dv", value: "ද්ව්" },
  { id: "dy", value: "ද්ය්" },
  { id: "ḍr", value: "ඩ්ර්" },
  { id: "ḍv", value: "ඩ්ව්" },
  { id: "ḍy", value: "ඩ්ය්" },
  { id: "gr", value: "ග්ර්" },
  { id: "gv", value: "ග්ව්" },
  { id: "gy", value: "ග්ය්" },
  { id: "jr", value: "ජ්ර්" },
  { id: "jv", value: "ජ්ව්" },
  { id: "jy", value: "ජ්ය්" },
  { id: "kr", value: "ක්ර්" },
  { id: "kv", value: "ක්ව්" },
  { id: "ky", value: "ක්ය්" },
  { id: "pr", value: "ප්ර්" },
  { id: "pv", value: "ප්ව්" },
  { id: "py", value: "ප්ය්" },
  { id: "tr", value: "ත්ර්" },
  { id: "tv", value: "ත්ව්" },
  { id: "ty", value: "ත්ය්" },
  { id: "ṭr", value: "ට්ර්" },
  { id: "ṭv", value: "ට්ව්" },
  { id: "ṭy", value: "ට්ය්" },
  { id: "ñh", value: "ඤ්හ්" },
  { id: "ṇh", value: "ණ්හ්" },
  { id: "nh", value: "න්හ්" },
  { id: "mh", value: "ම්හ්" },
  { id: "yh", value: "ය්හ්" },
  { id: "ly", value: "ල්ය්" },
  { id: "lh", value: "ල්හ්" },
  { id: "vh", value: "ව්හ්" },
  { id: "sm", value: "ස්ම්" },
  { id: "sv", value: "ස්ව්" },
  { id: "hm", value: "හ්ම්" },
  { id: "hv", value: "හ්ව්" },
  { id: "ḷh", value: "ළ්හ්" },
  { id: "ṇṭ", value: "ණ්ට්" },
  { id: "ph", value: "ඵ්" },
  { id: "pp", value: "ප්ප්" },
  { id: "ss", value: "ස්ස්" },
  { id: "th", value: "ථ්" },
  { id: "ṭh", value: "ඨ්" },
  { id: "tt", value: "ත්ත්" },
  { id: "ṭṭ", value: "ට්ට්" },
  { id: "yy", value: "ය්ය්" },
  { id: "b", value: "බ්" },
  { id: "c", value: "ච්" },
  { id: "d", value: "ද්" },
  { id: "ḍ", value: "ඩ්" },
  { id: "g", value: "ග්" },
  { id: "h", value: "හ්" },
  { id: "j", value: "ජ්" },
  { id: "k", value: "ක්" },
  { id: "l", value: "ල්" },
  { id: "ḷ", value: "ළ්" },
  { id: "m", value: "ම්" },
  { id: "n", value: "න්" },
  { id: "ṅ", value: "ඞ්" },
  { id: "ñ", value: "ඤ්" },
  { id: "ṇ", value: "ණ්" },
  { id: "p", value: "ප්" },
  { id: "r", value: "‍ර්" },
  { id: "s", value: "ස්" },
  { id: "t", value: "ත්" },
  { id: "ṭ", value: "ට්" },
  { id: "v", value: "ව්" },
  { id: "y", value: "‍ය්" },
  { id: "්iṃ", value: "ිං" },
  { id: "්uṃ", value: "ුං" },
  { id: "්aṃ", value: "ං" },
  { id: "්ā", value: "ා" },
  { id: "්i", value: "ි" },
  { id: "්ī", value: "ී" },
  { id: "්u", value: "ු" },
  { id: "්ū", value: "ූ" },
  { id: "්e", value: "ෙ" },
  { id: "්ē", value: "ේ" },
  { id: "්o", value: "ො" },
  { id: "්ō", value: "ෝ" },
  { id: "්", value: "්" },
  { id: "aṃ", value: "අං" },
  { id: "iṃ", value: "ඉං" },
  { id: "uṃ", value: "උං" },
  { id: "්a", value: "" },
  { id: "a", value: "අ" },
  { id: "ā", value: "ආ" },
  { id: "i", value: "ඉ" },
  { id: "ī", value: "ඊ" },
  { id: "u", value: "උ" },
  { id: "ū", value: "ඌ" },
  { id: "e", value: "එ" },
  { id: "o", value: "ඔ" },
];

export const roman_to_si = (input: string | undefined): string | undefined => {
  if (typeof input === "undefined") {
    return input;
  }
  let txt = input.toLowerCase();

  try {
    for (const iterator of char_unicode_to_si) {
      txt = txt.replaceAll(iterator.id, iterator.value);
    }
  } catch (err) {
    //error
    console.error(err);
  }
  return txt;
};
