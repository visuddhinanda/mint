import logging

logger = logging.getLogger(__name__)


def handle_message(context, id, content_type, body):
    logger.info("TODO: --- using redis namespace(%s) ---", context[1])
