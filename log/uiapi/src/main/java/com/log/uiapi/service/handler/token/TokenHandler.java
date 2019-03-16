package com.log.uiapi.service.handler.token;

import com.log.uiapi.protocol.logp.LogP;
import com.log.uiapi.service.handler.BasicRequestHandler;
import com.log.uiapi.service.handler.HandlerConstants;
import com.log.uiapi.service.handler.RequestParam;
import io.netty.channel.ChannelHandlerContext;
import org.springframework.stereotype.Component;

/**
 * Token handler, record token info
 */
@Component
public class TokenHandler extends BasicRequestHandler<TokenRequest> {
    public TokenHandler() {
        super(TokenRequest.class);
    }

    @Override
    protected void handle(ChannelHandlerContext ctx, LogP msg, TokenRequest request) throws Exception {
        ctx.channel().attr(HandlerConstants.ATTR_TOKEN).set(request.getToken());
    }
}
class TokenRequest implements RequestParam {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}


