# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import tulip_pb2 as tulip__pb2


class SearchStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Pali = channel.unary_unary(
                '/mint.tulip.v1.Search/Pali',
                request_serializer=tulip__pb2.SearchRequest.SerializeToString,
                response_deserializer=tulip__pb2.SearchResponse.FromString,
                )


class SearchServicer(object):
    """Missing associated documentation comment in .proto file."""

    def Pali(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_SearchServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Pali': grpc.unary_unary_rpc_method_handler(
                    servicer.Pali,
                    request_deserializer=tulip__pb2.SearchRequest.FromString,
                    response_serializer=tulip__pb2.SearchResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'mint.tulip.v1.Search', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Search(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def Pali(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mint.tulip.v1.Search/Pali',
            tulip__pb2.SearchRequest.SerializeToString,
            tulip__pb2.SearchResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
