# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\python\reasoning_stream_end\_10_mask_end.py
# Merge Date: 2026-05-07T19:26:54.835979
# ---

from helpers.extension import Extension


class MaskReasoningStreamEnd(Extension):
    async def execute(self, **kwargs):
        # Get agent and finalize the streaming filter
        agent = kwargs.get("agent")
        if not agent:
            return

        try:
            # Finalize the reasoning stream filter if it exists
            filter_key = "_reason_stream_filter"
            filter_instance = agent.get_data(filter_key)
            if filter_instance:
                tail = filter_instance.finalize()

                # Print any remaining masked content
                if tail:
                    from helpers.print_style import PrintStyle
                    PrintStyle().stream(tail)

                # Clean up the filter
                agent.set_data(filter_key, None)
        except Exception as e:
            # If masking fails, proceed without masking
            pass
