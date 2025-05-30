<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: lily.proto

namespace Palm\Lily\V1;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>palm.lily.v1.TeXLiveRequest</code>
 */
class TeXLiveRequest extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>string name = 1;</code>
     */
    protected $name = '';
    /**
     * Generated from protobuf field <code>.palm.lily.v1.Style style = 2;</code>
     */
    protected $style = 0;
    /**
     * Generated from protobuf field <code>.palm.lily.v1.TeXLiveTask.Output.Format format = 3;</code>
     */
    protected $format = 0;
    /**
     * Generated from protobuf field <code>.google.protobuf.Duration ttl = 9;</code>
     */
    protected $ttl = null;
    /**
     * Generated from protobuf field <code>bytes entry = 98;</code>
     */
    protected $entry = '';
    /**
     * Generated from protobuf field <code>map<string, bytes> attachments = 99;</code>
     */
    private $attachments;
    protected $Payload;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type string $name
     *     @type int $style
     *     @type int $format
     *     @type \Google\Protobuf\Duration $ttl
     *     @type \Palm\Lily\V1\Book $book
     *     @type \Palm\Lily\V1\Article $article
     *     @type \Palm\Lily\V1\Slideshow $slideshow
     *     @type string $entry
     *     @type array|\Google\Protobuf\Internal\MapField $attachments
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Lily::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>string name = 1;</code>
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Generated from protobuf field <code>string name = 1;</code>
     * @param string $var
     * @return $this
     */
    public function setName($var)
    {
        GPBUtil::checkString($var, True);
        $this->name = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Style style = 2;</code>
     * @return int
     */
    public function getStyle()
    {
        return $this->style;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Style style = 2;</code>
     * @param int $var
     * @return $this
     */
    public function setStyle($var)
    {
        GPBUtil::checkEnum($var, \Palm\Lily\V1\Style::class);
        $this->style = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.TeXLiveTask.Output.Format format = 3;</code>
     * @return int
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.TeXLiveTask.Output.Format format = 3;</code>
     * @param int $var
     * @return $this
     */
    public function setFormat($var)
    {
        GPBUtil::checkEnum($var, \Palm\Lily\V1\TeXLiveTask\Output\Format::class);
        $this->format = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Duration ttl = 9;</code>
     * @return \Google\Protobuf\Duration|null
     */
    public function getTtl()
    {
        return $this->ttl;
    }

    public function hasTtl()
    {
        return isset($this->ttl);
    }

    public function clearTtl()
    {
        unset($this->ttl);
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Duration ttl = 9;</code>
     * @param \Google\Protobuf\Duration $var
     * @return $this
     */
    public function setTtl($var)
    {
        GPBUtil::checkMessage($var, \Google\Protobuf\Duration::class);
        $this->ttl = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Book book = 11;</code>
     * @return \Palm\Lily\V1\Book|null
     */
    public function getBook()
    {
        return $this->readOneof(11);
    }

    public function hasBook()
    {
        return $this->hasOneof(11);
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Book book = 11;</code>
     * @param \Palm\Lily\V1\Book $var
     * @return $this
     */
    public function setBook($var)
    {
        GPBUtil::checkMessage($var, \Palm\Lily\V1\Book::class);
        $this->writeOneof(11, $var);

        return $this;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Article article = 12;</code>
     * @return \Palm\Lily\V1\Article|null
     */
    public function getArticle()
    {
        return $this->readOneof(12);
    }

    public function hasArticle()
    {
        return $this->hasOneof(12);
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Article article = 12;</code>
     * @param \Palm\Lily\V1\Article $var
     * @return $this
     */
    public function setArticle($var)
    {
        GPBUtil::checkMessage($var, \Palm\Lily\V1\Article::class);
        $this->writeOneof(12, $var);

        return $this;
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Slideshow slideshow = 13;</code>
     * @return \Palm\Lily\V1\Slideshow|null
     */
    public function getSlideshow()
    {
        return $this->readOneof(13);
    }

    public function hasSlideshow()
    {
        return $this->hasOneof(13);
    }

    /**
     * Generated from protobuf field <code>.palm.lily.v1.Slideshow slideshow = 13;</code>
     * @param \Palm\Lily\V1\Slideshow $var
     * @return $this
     */
    public function setSlideshow($var)
    {
        GPBUtil::checkMessage($var, \Palm\Lily\V1\Slideshow::class);
        $this->writeOneof(13, $var);

        return $this;
    }

    /**
     * Generated from protobuf field <code>bytes entry = 98;</code>
     * @return string
     */
    public function getEntry()
    {
        return $this->entry;
    }

    /**
     * Generated from protobuf field <code>bytes entry = 98;</code>
     * @param string $var
     * @return $this
     */
    public function setEntry($var)
    {
        GPBUtil::checkString($var, False);
        $this->entry = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>map<string, bytes> attachments = 99;</code>
     * @return \Google\Protobuf\Internal\MapField
     */
    public function getAttachments()
    {
        return $this->attachments;
    }

    /**
     * Generated from protobuf field <code>map<string, bytes> attachments = 99;</code>
     * @param array|\Google\Protobuf\Internal\MapField $var
     * @return $this
     */
    public function setAttachments($var)
    {
        $arr = GPBUtil::checkMapField($var, \Google\Protobuf\Internal\GPBType::STRING, \Google\Protobuf\Internal\GPBType::BYTES);
        $this->attachments = $arr;

        return $this;
    }

    /**
     * @return string
     */
    public function getPayload()
    {
        return $this->whichOneof("Payload");
    }

}

