<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: lily.proto

namespace GPBMetadata;

class Lily
{
    public static $is_initialized = false;

    public static function initOnce() {
        $pool = \Google\Protobuf\Internal\DescriptorPool::getGeneratedPool();

        if (static::$is_initialized == true) {
          return;
        }
        $pool->internalAddGeneratedFile(
            '
�

lily.protopalm.lily.v1"C
File
content_type (	H �
payload (B
_content_type"�

ExcelModel.
sheets (2.palm.lily.v1.ExcelModel.Sheetx
Sheet
name (	2
cells (2#.palm.lily.v1.ExcelModel.Sheet.Cell-
Cell
row (
col (
val (	"r
TexToRequest4
files (2%.palm.lily.v1.TexToRequest.FilesEntry,

FilesEntry
key (	
value (:8"
EpubBuildRequest2|
Excel7
Parse.palm.lily.v1.File.palm.lily.v1.ExcelModel" :
Generate.palm.lily.v1.ExcelModel.palm.lily.v1.File" 2|
Tex9
ToPdf.palm.lily.v1.TexToRequest.palm.lily.v1.File" :
ToWord.palm.lily.v1.TexToRequest.palm.lily.v1.File" 2E
Epub=
Build.palm.lily.v1.EpubBuildRequest.palm.lily.v1.File" B.
*com.github.saturn_xiv.palm.plugins.lily.v1Pbproto3'
        , true);

        static::$is_initialized = true;
    }
}

