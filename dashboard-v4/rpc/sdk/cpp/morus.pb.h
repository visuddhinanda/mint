// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: morus.proto

#ifndef GOOGLE_PROTOBUF_INCLUDED_morus_2eproto_2epb_2eh
#define GOOGLE_PROTOBUF_INCLUDED_morus_2eproto_2epb_2eh

#include <limits>
#include <string>
#include <type_traits>

#include "google/protobuf/port_def.inc"
#if PROTOBUF_VERSION < 4024000
#error "This file was generated by a newer version of protoc which is"
#error "incompatible with your Protocol Buffer headers. Please update"
#error "your headers."
#endif  // PROTOBUF_VERSION

#if 4024003 < PROTOBUF_MIN_PROTOC_VERSION
#error "This file was generated by an older version of protoc which is"
#error "incompatible with your Protocol Buffer headers. Please"
#error "regenerate this file with a newer version of protoc."
#endif  // PROTOBUF_MIN_PROTOC_VERSION
#include "google/protobuf/port_undef.inc"
#include "google/protobuf/io/coded_stream.h"
#include "google/protobuf/arena.h"
#include "google/protobuf/arenastring.h"
#include "google/protobuf/generated_message_tctable_decl.h"
#include "google/protobuf/generated_message_util.h"
#include "google/protobuf/metadata_lite.h"
#include "google/protobuf/generated_message_reflection.h"
#include "google/protobuf/message.h"
#include "google/protobuf/repeated_field.h"  // IWYU pragma: export
#include "google/protobuf/extension_set.h"  // IWYU pragma: export
#include "google/protobuf/unknown_field_set.h"
// @@protoc_insertion_point(includes)

// Must be included last.
#include "google/protobuf/port_def.inc"

#define PROTOBUF_INTERNAL_EXPORT_morus_2eproto

namespace google {
namespace protobuf {
namespace internal {
class AnyMetadata;
}  // namespace internal
}  // namespace protobuf
}  // namespace google

// Internal implementation detail -- do not use these members.
struct TableStruct_morus_2eproto {
  static const ::uint32_t offsets[];
};
extern const ::google::protobuf::internal::DescriptorTable
    descriptor_table_morus_2eproto;
namespace mint {
namespace morus {
namespace v1 {
class MarkdownToHtmlRequest;
struct MarkdownToHtmlRequestDefaultTypeInternal;
extern MarkdownToHtmlRequestDefaultTypeInternal _MarkdownToHtmlRequest_default_instance_;
class MarkdownToHtmlResponse;
struct MarkdownToHtmlResponseDefaultTypeInternal;
extern MarkdownToHtmlResponseDefaultTypeInternal _MarkdownToHtmlResponse_default_instance_;
}  // namespace v1
}  // namespace morus
}  // namespace mint
namespace google {
namespace protobuf {
}  // namespace protobuf
}  // namespace google

namespace mint {
namespace morus {
namespace v1 {

// ===================================================================


// -------------------------------------------------------------------

class MarkdownToHtmlRequest final :
    public ::google::protobuf::Message /* @@protoc_insertion_point(class_definition:mint.morus.v1.MarkdownToHtmlRequest) */ {
 public:
  inline MarkdownToHtmlRequest() : MarkdownToHtmlRequest(nullptr) {}
  ~MarkdownToHtmlRequest() override;
  template<typename = void>
  explicit PROTOBUF_CONSTEXPR MarkdownToHtmlRequest(::google::protobuf::internal::ConstantInitialized);

  MarkdownToHtmlRequest(const MarkdownToHtmlRequest& from);
  MarkdownToHtmlRequest(MarkdownToHtmlRequest&& from) noexcept
    : MarkdownToHtmlRequest() {
    *this = ::std::move(from);
  }

  inline MarkdownToHtmlRequest& operator=(const MarkdownToHtmlRequest& from) {
    CopyFrom(from);
    return *this;
  }
  inline MarkdownToHtmlRequest& operator=(MarkdownToHtmlRequest&& from) noexcept {
    if (this == &from) return *this;
    if (GetOwningArena() == from.GetOwningArena()
  #ifdef PROTOBUF_FORCE_COPY_IN_MOVE
        && GetOwningArena() != nullptr
  #endif  // !PROTOBUF_FORCE_COPY_IN_MOVE
    ) {
      InternalSwap(&from);
    } else {
      CopyFrom(from);
    }
    return *this;
  }

  inline const ::google::protobuf::UnknownFieldSet& unknown_fields() const {
    return _internal_metadata_.unknown_fields<::google::protobuf::UnknownFieldSet>(::google::protobuf::UnknownFieldSet::default_instance);
  }
  inline ::google::protobuf::UnknownFieldSet* mutable_unknown_fields() {
    return _internal_metadata_.mutable_unknown_fields<::google::protobuf::UnknownFieldSet>();
  }

  static const ::google::protobuf::Descriptor* descriptor() {
    return GetDescriptor();
  }
  static const ::google::protobuf::Descriptor* GetDescriptor() {
    return default_instance().GetMetadata().descriptor;
  }
  static const ::google::protobuf::Reflection* GetReflection() {
    return default_instance().GetMetadata().reflection;
  }
  static const MarkdownToHtmlRequest& default_instance() {
    return *internal_default_instance();
  }
  static inline const MarkdownToHtmlRequest* internal_default_instance() {
    return reinterpret_cast<const MarkdownToHtmlRequest*>(
               &_MarkdownToHtmlRequest_default_instance_);
  }
  static constexpr int kIndexInFileMessages =
    0;

  friend void swap(MarkdownToHtmlRequest& a, MarkdownToHtmlRequest& b) {
    a.Swap(&b);
  }
  inline void Swap(MarkdownToHtmlRequest* other) {
    if (other == this) return;
  #ifdef PROTOBUF_FORCE_COPY_IN_SWAP
    if (GetOwningArena() != nullptr &&
        GetOwningArena() == other->GetOwningArena()) {
   #else  // PROTOBUF_FORCE_COPY_IN_SWAP
    if (GetOwningArena() == other->GetOwningArena()) {
  #endif  // !PROTOBUF_FORCE_COPY_IN_SWAP
      InternalSwap(other);
    } else {
      ::google::protobuf::internal::GenericSwap(this, other);
    }
  }
  void UnsafeArenaSwap(MarkdownToHtmlRequest* other) {
    if (other == this) return;
    ABSL_DCHECK(GetOwningArena() == other->GetOwningArena());
    InternalSwap(other);
  }

  // implements Message ----------------------------------------------

  MarkdownToHtmlRequest* New(::google::protobuf::Arena* arena = nullptr) const final {
    return CreateMaybeMessage<MarkdownToHtmlRequest>(arena);
  }
  using ::google::protobuf::Message::CopyFrom;
  void CopyFrom(const MarkdownToHtmlRequest& from);
  using ::google::protobuf::Message::MergeFrom;
  void MergeFrom( const MarkdownToHtmlRequest& from) {
    MarkdownToHtmlRequest::MergeImpl(*this, from);
  }
  private:
  static void MergeImpl(::google::protobuf::Message& to_msg, const ::google::protobuf::Message& from_msg);
  public:
  PROTOBUF_ATTRIBUTE_REINITIALIZES void Clear() final;
  bool IsInitialized() const final;

  ::size_t ByteSizeLong() const final;
  const char* _InternalParse(const char* ptr, ::google::protobuf::internal::ParseContext* ctx) final;
  ::uint8_t* _InternalSerialize(
      ::uint8_t* target, ::google::protobuf::io::EpsCopyOutputStream* stream) const final;
  int GetCachedSize() const final { return _impl_._cached_size_.Get(); }

  private:
  void SharedCtor(::google::protobuf::Arena* arena);
  void SharedDtor();
  void SetCachedSize(int size) const final;
  void InternalSwap(MarkdownToHtmlRequest* other);

  private:
  friend class ::google::protobuf::internal::AnyMetadata;
  static ::absl::string_view FullMessageName() {
    return "mint.morus.v1.MarkdownToHtmlRequest";
  }
  protected:
  explicit MarkdownToHtmlRequest(::google::protobuf::Arena* arena);
  public:

  static const ClassData _class_data_;
  const ::google::protobuf::Message::ClassData*GetClassData() const final;

  ::google::protobuf::Metadata GetMetadata() const final;

  // nested types ----------------------------------------------------

  // accessors -------------------------------------------------------

  enum : int {
    kPayloadFieldNumber = 1,
    kSanitizeFieldNumber = 2,
  };
  // string payload = 1;
  void clear_payload() ;
  const std::string& payload() const;
  template <typename Arg_ = const std::string&, typename... Args_>
  void set_payload(Arg_&& arg, Args_... args);
  std::string* mutable_payload();
  PROTOBUF_NODISCARD std::string* release_payload();
  void set_allocated_payload(std::string* ptr);

  private:
  const std::string& _internal_payload() const;
  inline PROTOBUF_ALWAYS_INLINE void _internal_set_payload(
      const std::string& value);
  std::string* _internal_mutable_payload();

  public:
  // bool sanitize = 2;
  void clear_sanitize() ;
  bool sanitize() const;
  void set_sanitize(bool value);

  private:
  bool _internal_sanitize() const;
  void _internal_set_sanitize(bool value);

  public:
  // @@protoc_insertion_point(class_scope:mint.morus.v1.MarkdownToHtmlRequest)
 private:
  class _Internal;

  friend class ::google::protobuf::internal::TcParser;
  static const ::google::protobuf::internal::TcParseTable<1, 2, 0, 51, 2> _table_;
  template <typename T> friend class ::google::protobuf::Arena::InternalHelper;
  typedef void InternalArenaConstructable_;
  typedef void DestructorSkippable_;
  struct Impl_ {
    ::google::protobuf::internal::ArenaStringPtr payload_;
    bool sanitize_;
    mutable ::google::protobuf::internal::CachedSize _cached_size_;
    PROTOBUF_TSAN_DECLARE_MEMBER
  };
  union { Impl_ _impl_; };
  friend struct ::TableStruct_morus_2eproto;
};// -------------------------------------------------------------------

class MarkdownToHtmlResponse final :
    public ::google::protobuf::Message /* @@protoc_insertion_point(class_definition:mint.morus.v1.MarkdownToHtmlResponse) */ {
 public:
  inline MarkdownToHtmlResponse() : MarkdownToHtmlResponse(nullptr) {}
  ~MarkdownToHtmlResponse() override;
  template<typename = void>
  explicit PROTOBUF_CONSTEXPR MarkdownToHtmlResponse(::google::protobuf::internal::ConstantInitialized);

  MarkdownToHtmlResponse(const MarkdownToHtmlResponse& from);
  MarkdownToHtmlResponse(MarkdownToHtmlResponse&& from) noexcept
    : MarkdownToHtmlResponse() {
    *this = ::std::move(from);
  }

  inline MarkdownToHtmlResponse& operator=(const MarkdownToHtmlResponse& from) {
    CopyFrom(from);
    return *this;
  }
  inline MarkdownToHtmlResponse& operator=(MarkdownToHtmlResponse&& from) noexcept {
    if (this == &from) return *this;
    if (GetOwningArena() == from.GetOwningArena()
  #ifdef PROTOBUF_FORCE_COPY_IN_MOVE
        && GetOwningArena() != nullptr
  #endif  // !PROTOBUF_FORCE_COPY_IN_MOVE
    ) {
      InternalSwap(&from);
    } else {
      CopyFrom(from);
    }
    return *this;
  }

  inline const ::google::protobuf::UnknownFieldSet& unknown_fields() const {
    return _internal_metadata_.unknown_fields<::google::protobuf::UnknownFieldSet>(::google::protobuf::UnknownFieldSet::default_instance);
  }
  inline ::google::protobuf::UnknownFieldSet* mutable_unknown_fields() {
    return _internal_metadata_.mutable_unknown_fields<::google::protobuf::UnknownFieldSet>();
  }

  static const ::google::protobuf::Descriptor* descriptor() {
    return GetDescriptor();
  }
  static const ::google::protobuf::Descriptor* GetDescriptor() {
    return default_instance().GetMetadata().descriptor;
  }
  static const ::google::protobuf::Reflection* GetReflection() {
    return default_instance().GetMetadata().reflection;
  }
  static const MarkdownToHtmlResponse& default_instance() {
    return *internal_default_instance();
  }
  static inline const MarkdownToHtmlResponse* internal_default_instance() {
    return reinterpret_cast<const MarkdownToHtmlResponse*>(
               &_MarkdownToHtmlResponse_default_instance_);
  }
  static constexpr int kIndexInFileMessages =
    1;

  friend void swap(MarkdownToHtmlResponse& a, MarkdownToHtmlResponse& b) {
    a.Swap(&b);
  }
  inline void Swap(MarkdownToHtmlResponse* other) {
    if (other == this) return;
  #ifdef PROTOBUF_FORCE_COPY_IN_SWAP
    if (GetOwningArena() != nullptr &&
        GetOwningArena() == other->GetOwningArena()) {
   #else  // PROTOBUF_FORCE_COPY_IN_SWAP
    if (GetOwningArena() == other->GetOwningArena()) {
  #endif  // !PROTOBUF_FORCE_COPY_IN_SWAP
      InternalSwap(other);
    } else {
      ::google::protobuf::internal::GenericSwap(this, other);
    }
  }
  void UnsafeArenaSwap(MarkdownToHtmlResponse* other) {
    if (other == this) return;
    ABSL_DCHECK(GetOwningArena() == other->GetOwningArena());
    InternalSwap(other);
  }

  // implements Message ----------------------------------------------

  MarkdownToHtmlResponse* New(::google::protobuf::Arena* arena = nullptr) const final {
    return CreateMaybeMessage<MarkdownToHtmlResponse>(arena);
  }
  using ::google::protobuf::Message::CopyFrom;
  void CopyFrom(const MarkdownToHtmlResponse& from);
  using ::google::protobuf::Message::MergeFrom;
  void MergeFrom( const MarkdownToHtmlResponse& from) {
    MarkdownToHtmlResponse::MergeImpl(*this, from);
  }
  private:
  static void MergeImpl(::google::protobuf::Message& to_msg, const ::google::protobuf::Message& from_msg);
  public:
  PROTOBUF_ATTRIBUTE_REINITIALIZES void Clear() final;
  bool IsInitialized() const final;

  ::size_t ByteSizeLong() const final;
  const char* _InternalParse(const char* ptr, ::google::protobuf::internal::ParseContext* ctx) final;
  ::uint8_t* _InternalSerialize(
      ::uint8_t* target, ::google::protobuf::io::EpsCopyOutputStream* stream) const final;
  int GetCachedSize() const final { return _impl_._cached_size_.Get(); }

  private:
  void SharedCtor(::google::protobuf::Arena* arena);
  void SharedDtor();
  void SetCachedSize(int size) const final;
  void InternalSwap(MarkdownToHtmlResponse* other);

  private:
  friend class ::google::protobuf::internal::AnyMetadata;
  static ::absl::string_view FullMessageName() {
    return "mint.morus.v1.MarkdownToHtmlResponse";
  }
  protected:
  explicit MarkdownToHtmlResponse(::google::protobuf::Arena* arena);
  public:

  static const ClassData _class_data_;
  const ::google::protobuf::Message::ClassData*GetClassData() const final;

  ::google::protobuf::Metadata GetMetadata() const final;

  // nested types ----------------------------------------------------

  // accessors -------------------------------------------------------

  enum : int {
    kPayloadFieldNumber = 1,
  };
  // string payload = 1;
  void clear_payload() ;
  const std::string& payload() const;
  template <typename Arg_ = const std::string&, typename... Args_>
  void set_payload(Arg_&& arg, Args_... args);
  std::string* mutable_payload();
  PROTOBUF_NODISCARD std::string* release_payload();
  void set_allocated_payload(std::string* ptr);

  private:
  const std::string& _internal_payload() const;
  inline PROTOBUF_ALWAYS_INLINE void _internal_set_payload(
      const std::string& value);
  std::string* _internal_mutable_payload();

  public:
  // @@protoc_insertion_point(class_scope:mint.morus.v1.MarkdownToHtmlResponse)
 private:
  class _Internal;

  friend class ::google::protobuf::internal::TcParser;
  static const ::google::protobuf::internal::TcParseTable<0, 1, 0, 52, 2> _table_;
  template <typename T> friend class ::google::protobuf::Arena::InternalHelper;
  typedef void InternalArenaConstructable_;
  typedef void DestructorSkippable_;
  struct Impl_ {
    ::google::protobuf::internal::ArenaStringPtr payload_;
    mutable ::google::protobuf::internal::CachedSize _cached_size_;
    PROTOBUF_TSAN_DECLARE_MEMBER
  };
  union { Impl_ _impl_; };
  friend struct ::TableStruct_morus_2eproto;
};

// ===================================================================




// ===================================================================


#ifdef __GNUC__
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wstrict-aliasing"
#endif  // __GNUC__
// -------------------------------------------------------------------

// MarkdownToHtmlRequest

// string payload = 1;
inline void MarkdownToHtmlRequest::clear_payload() {
  _impl_.payload_.ClearToEmpty();
}
inline const std::string& MarkdownToHtmlRequest::payload() const {
  // @@protoc_insertion_point(field_get:mint.morus.v1.MarkdownToHtmlRequest.payload)
  return _internal_payload();
}
template <typename Arg_, typename... Args_>
inline PROTOBUF_ALWAYS_INLINE void MarkdownToHtmlRequest::set_payload(Arg_&& arg,
                                                     Args_... args) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  _impl_.payload_.Set(static_cast<Arg_&&>(arg), args..., GetArenaForAllocation());
  // @@protoc_insertion_point(field_set:mint.morus.v1.MarkdownToHtmlRequest.payload)
}
inline std::string* MarkdownToHtmlRequest::mutable_payload() {
  std::string* _s = _internal_mutable_payload();
  // @@protoc_insertion_point(field_mutable:mint.morus.v1.MarkdownToHtmlRequest.payload)
  return _s;
}
inline const std::string& MarkdownToHtmlRequest::_internal_payload() const {
  PROTOBUF_TSAN_READ(&_impl_._tsan_detect_race);
  return _impl_.payload_.Get();
}
inline void MarkdownToHtmlRequest::_internal_set_payload(const std::string& value) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  _impl_.payload_.Set(value, GetArenaForAllocation());
}
inline std::string* MarkdownToHtmlRequest::_internal_mutable_payload() {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  return _impl_.payload_.Mutable( GetArenaForAllocation());
}
inline std::string* MarkdownToHtmlRequest::release_payload() {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  // @@protoc_insertion_point(field_release:mint.morus.v1.MarkdownToHtmlRequest.payload)
  return _impl_.payload_.Release();
}
inline void MarkdownToHtmlRequest::set_allocated_payload(std::string* value) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  _impl_.payload_.SetAllocated(value, GetArenaForAllocation());
  #ifdef PROTOBUF_FORCE_COPY_DEFAULT_STRING
        if (_impl_.payload_.IsDefault()) {
          _impl_.payload_.Set("", GetArenaForAllocation());
        }
  #endif  // PROTOBUF_FORCE_COPY_DEFAULT_STRING
  // @@protoc_insertion_point(field_set_allocated:mint.morus.v1.MarkdownToHtmlRequest.payload)
}

// bool sanitize = 2;
inline void MarkdownToHtmlRequest::clear_sanitize() {
  _impl_.sanitize_ = false;
}
inline bool MarkdownToHtmlRequest::sanitize() const {
  // @@protoc_insertion_point(field_get:mint.morus.v1.MarkdownToHtmlRequest.sanitize)
  return _internal_sanitize();
}
inline void MarkdownToHtmlRequest::set_sanitize(bool value) {
  _internal_set_sanitize(value);
  // @@protoc_insertion_point(field_set:mint.morus.v1.MarkdownToHtmlRequest.sanitize)
}
inline bool MarkdownToHtmlRequest::_internal_sanitize() const {
  PROTOBUF_TSAN_READ(&_impl_._tsan_detect_race);
  return _impl_.sanitize_;
}
inline void MarkdownToHtmlRequest::_internal_set_sanitize(bool value) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  _impl_.sanitize_ = value;
}

// -------------------------------------------------------------------

// MarkdownToHtmlResponse

// string payload = 1;
inline void MarkdownToHtmlResponse::clear_payload() {
  _impl_.payload_.ClearToEmpty();
}
inline const std::string& MarkdownToHtmlResponse::payload() const {
  // @@protoc_insertion_point(field_get:mint.morus.v1.MarkdownToHtmlResponse.payload)
  return _internal_payload();
}
template <typename Arg_, typename... Args_>
inline PROTOBUF_ALWAYS_INLINE void MarkdownToHtmlResponse::set_payload(Arg_&& arg,
                                                     Args_... args) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  _impl_.payload_.Set(static_cast<Arg_&&>(arg), args..., GetArenaForAllocation());
  // @@protoc_insertion_point(field_set:mint.morus.v1.MarkdownToHtmlResponse.payload)
}
inline std::string* MarkdownToHtmlResponse::mutable_payload() {
  std::string* _s = _internal_mutable_payload();
  // @@protoc_insertion_point(field_mutable:mint.morus.v1.MarkdownToHtmlResponse.payload)
  return _s;
}
inline const std::string& MarkdownToHtmlResponse::_internal_payload() const {
  PROTOBUF_TSAN_READ(&_impl_._tsan_detect_race);
  return _impl_.payload_.Get();
}
inline void MarkdownToHtmlResponse::_internal_set_payload(const std::string& value) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  _impl_.payload_.Set(value, GetArenaForAllocation());
}
inline std::string* MarkdownToHtmlResponse::_internal_mutable_payload() {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  ;
  return _impl_.payload_.Mutable( GetArenaForAllocation());
}
inline std::string* MarkdownToHtmlResponse::release_payload() {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  // @@protoc_insertion_point(field_release:mint.morus.v1.MarkdownToHtmlResponse.payload)
  return _impl_.payload_.Release();
}
inline void MarkdownToHtmlResponse::set_allocated_payload(std::string* value) {
  PROTOBUF_TSAN_WRITE(&_impl_._tsan_detect_race);
  _impl_.payload_.SetAllocated(value, GetArenaForAllocation());
  #ifdef PROTOBUF_FORCE_COPY_DEFAULT_STRING
        if (_impl_.payload_.IsDefault()) {
          _impl_.payload_.Set("", GetArenaForAllocation());
        }
  #endif  // PROTOBUF_FORCE_COPY_DEFAULT_STRING
  // @@protoc_insertion_point(field_set_allocated:mint.morus.v1.MarkdownToHtmlResponse.payload)
}

#ifdef __GNUC__
#pragma GCC diagnostic pop
#endif  // __GNUC__

// @@protoc_insertion_point(namespace_scope)
}  // namespace v1
}  // namespace morus
}  // namespace mint


// @@protoc_insertion_point(global_scope)

#include "google/protobuf/port_undef.inc"

#endif  // GOOGLE_PROTOBUF_INCLUDED_morus_2eproto_2epb_2eh
