// Generated by the gRPC C++ plugin.
// If you make any local change, they will be lost.
// source: morus.proto

#include "morus.pb.h"
#include "morus.grpc.pb.h"

#include <functional>
#include <grpcpp/support/async_stream.h>
#include <grpcpp/support/async_unary_call.h>
#include <grpcpp/impl/channel_interface.h>
#include <grpcpp/impl/client_unary_call.h>
#include <grpcpp/support/client_callback.h>
#include <grpcpp/support/message_allocator.h>
#include <grpcpp/support/method_handler.h>
#include <grpcpp/impl/rpc_service_method.h>
#include <grpcpp/support/server_callback.h>
#include <grpcpp/impl/server_callback_handlers.h>
#include <grpcpp/server_context.h>
#include <grpcpp/impl/service_type.h>
#include <grpcpp/support/sync_stream.h>
namespace mint {
namespace morus {
namespace v1 {

static const char* Markdown_method_names[] = {
  "/mint.morus.v1.Markdown/ToHtml",
};

std::unique_ptr< Markdown::Stub> Markdown::NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options) {
  (void)options;
  std::unique_ptr< Markdown::Stub> stub(new Markdown::Stub(channel, options));
  return stub;
}

Markdown::Stub::Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options)
  : channel_(channel), rpcmethod_ToHtml_(Markdown_method_names[0], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  {}

::grpc::Status Markdown::Stub::ToHtml(::grpc::ClientContext* context, const ::mint::morus::v1::MarkdownToHtmlRequest& request, ::mint::morus::v1::MarkdownToHtmlResponse* response) {
  return ::grpc::internal::BlockingUnaryCall< ::mint::morus::v1::MarkdownToHtmlRequest, ::mint::morus::v1::MarkdownToHtmlResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_ToHtml_, context, request, response);
}

void Markdown::Stub::async::ToHtml(::grpc::ClientContext* context, const ::mint::morus::v1::MarkdownToHtmlRequest* request, ::mint::morus::v1::MarkdownToHtmlResponse* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::mint::morus::v1::MarkdownToHtmlRequest, ::mint::morus::v1::MarkdownToHtmlResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_ToHtml_, context, request, response, std::move(f));
}

void Markdown::Stub::async::ToHtml(::grpc::ClientContext* context, const ::mint::morus::v1::MarkdownToHtmlRequest* request, ::mint::morus::v1::MarkdownToHtmlResponse* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_ToHtml_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::mint::morus::v1::MarkdownToHtmlResponse>* Markdown::Stub::PrepareAsyncToHtmlRaw(::grpc::ClientContext* context, const ::mint::morus::v1::MarkdownToHtmlRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::mint::morus::v1::MarkdownToHtmlResponse, ::mint::morus::v1::MarkdownToHtmlRequest, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_ToHtml_, context, request);
}

::grpc::ClientAsyncResponseReader< ::mint::morus::v1::MarkdownToHtmlResponse>* Markdown::Stub::AsyncToHtmlRaw(::grpc::ClientContext* context, const ::mint::morus::v1::MarkdownToHtmlRequest& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncToHtmlRaw(context, request, cq);
  result->StartCall();
  return result;
}

Markdown::Service::Service() {
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      Markdown_method_names[0],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< Markdown::Service, ::mint::morus::v1::MarkdownToHtmlRequest, ::mint::morus::v1::MarkdownToHtmlResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](Markdown::Service* service,
             ::grpc::ServerContext* ctx,
             const ::mint::morus::v1::MarkdownToHtmlRequest* req,
             ::mint::morus::v1::MarkdownToHtmlResponse* resp) {
               return service->ToHtml(ctx, req, resp);
             }, this)));
}

Markdown::Service::~Service() {
}

::grpc::Status Markdown::Service::ToHtml(::grpc::ServerContext* context, const ::mint::morus::v1::MarkdownToHtmlRequest* request, ::mint::morus::v1::MarkdownToHtmlResponse* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}


}  // namespace mint
}  // namespace morus
}  // namespace v1

