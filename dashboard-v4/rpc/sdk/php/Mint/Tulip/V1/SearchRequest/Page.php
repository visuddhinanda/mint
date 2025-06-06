<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: tulip.proto

namespace Mint\Tulip\V1\SearchRequest;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>mint.tulip.v1.SearchRequest.Page</code>
 */
class Page extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>int32 index = 1;</code>
     */
    protected $index = 0;
    /**
     * Generated from protobuf field <code>int32 size = 2;</code>
     */
    protected $size = 0;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type int $index
     *     @type int $size
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Tulip::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>int32 index = 1;</code>
     * @return int
     */
    public function getIndex()
    {
        return $this->index;
    }

    /**
     * Generated from protobuf field <code>int32 index = 1;</code>
     * @param int $var
     * @return $this
     */
    public function setIndex($var)
    {
        GPBUtil::checkInt32($var);
        $this->index = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>int32 size = 2;</code>
     * @return int
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Generated from protobuf field <code>int32 size = 2;</code>
     * @param int $var
     * @return $this
     */
    public function setSize($var)
    {
        GPBUtil::checkInt32($var);
        $this->size = $var;

        return $this;
    }

}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(Page::class, \Mint\Tulip\V1\SearchRequest_Page::class);

