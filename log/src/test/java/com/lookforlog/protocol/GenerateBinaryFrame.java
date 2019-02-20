package com.lookforlog.protocol;

import com.lookforlog.protocol.codec.LogProtocolCodec;
import com.lookforlog.protocol.constants.Request;
import com.lookforlog.protocol.logp.LogP;
import com.lookforlog.protocol.logp.LogPFactory;
import com.lookforlog.protocol.util.PrintUtils;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;

import static com.lookforlog.protocol.codec.LogProtocolCodec.CHARSET;

public class GenerateBinaryFrame {
    public static void main(String[] args) throws Exception {
        LogP logP = LogPFactory.defaultInstance0()
                .setRequest(Request.INIT)
                .create();

        LogProtocolCodec codec = new LogProtocolCodec();
        byte[] head = codec.encodeHead(logP.getHead());
        ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
        buf.writeBytes(head);
        buf.writeCharSequence(logP.getBody(), CHARSET);
        byte[] frame = new byte[buf.readableBytes()];
        buf.readBytes(frame);
        System.out.println(PrintUtils.toString0(frame, " "));
        System.out.println(PrintUtils.toString(frame));
    }
}