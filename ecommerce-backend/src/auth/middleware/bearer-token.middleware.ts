import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

// 요청이 올떄, authorization 헤더를 까서 넘겨줘야됨
@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 헤더가 없는 경우 -> 그냥 다음으로 넘겨주기
    // 인증은 bearer 토큰을 기반으로 할거임
    try {
      const authorizationHeader = req.headers['authorization'];

      if (!authorizationHeader) {
        next();
        return;
      }

      // 헤더가 있으면 payload를 얻어내서 다음 흐름으로 던진다.
      const bearerToken = this.getPayloadFromBearerToken(authorizationHeader);

      const decodedPayload = this.jwtService.decode(bearerToken);

      if (
        decodedPayload.type !== 'access' &&
        decodedPayload.type !== 'refresh'
      ) {
        throw new UnauthorizedException(
          '유효한 양식의 access, refresh 토큰 중 어디에도 해당되지 않습니다'
        );
      }

      const decodingSecretKey =
        decodedPayload.type === 'access'
          ? this.configService.get<string>('ACCESS_TOKEN_SECRET')
          : this.configService.get<string>('REFRESH_TOKEN_SECRET');

      const userPayload = this.jwtService.verifyAsync(bearerToken, {
        secret: decodingSecretKey,
      });

      req.user = userPayload;
      next();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('인증 오류');
    }
  }

  getPayloadFromBearerToken(rawToken: string) {
    const tokenSplitList = rawToken.split(' ');

    if (tokenSplitList.length !== 2) {
      throw new BadRequestException(
        '잘못된 토큰 형식입니다. 토큰을 bearer 토큰의 형식으로 전송해주세요'
      );
    }

    const [authName, token] = tokenSplitList;

    if (authName.toLowerCase() !== 'bearer') {
      throw new BadRequestException(
        'authorization 헤더의 타입이 bearer가 아닙니다.'
      );
    }

    return token;
  }
}
