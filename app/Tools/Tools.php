<?php
namespace App\Tools;

class Tools{

    public static function getWordEn($strIn)
        {
            $out = str_replace(["ā","ī","ū","ṅ","ñ","ṭ","ḍ","ṇ","ḷ","ṃ"],
                            ["a","i","u","n","n","t","d","n","l","m"], $strIn);
            return ($out);
        }
    public static function PaliReal($inStr): string {
        if (!is_string($inStr)) {
            return "";
        }
        $paliLetter = "abcdefghijklmnoprstuvyāīūṅñṭḍṇḷṃ";
        $output = [];
        $inStr = strtolower($inStr);
        for ($i=0; $i < mb_strlen($inStr,"UTF-8"); $i++) {
            # code...
            if(strstr($paliLetter,$inStr[$i]) !==FALSE){
                $output[] = $inStr[$i];
            }
        }
        return implode('',$output);
    }
    private static function convert($array,$xml){
        foreach ($array as $key => $line) {
            # code...
            if(!is_array($line)){
                $data = $xml->addChild($key,$line);
            }else{
                if(isset($line['value'])){
                    $value = $line['value'];
                    unset($line['value']);
                }else{
                    $value = "";
                }
                $obj = $xml->addChild($key,$value);
                if(isset($line['status'])){
                    $obj->addAttribute('status',$line['status']);
                    unset($line['status']);
                }
                Tools::convert($line,$obj);
            }
        }
        return $xml;
    }
    public static function JsonToXml($inArray){
        $xmlObj = simplexml_load_string("<word></word>");
        $xmlDoc = Tools::convert($inArray,$xmlObj);
        return $xmlDoc->asXml();
    }
}