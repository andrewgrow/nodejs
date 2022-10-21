import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ConfigService } from '@nestjs/config';

/**
 * This strategy is responsible for validating the API key sent as the header X-API-KEY as part of requests.
 * For using add the decorator before a controller method.
 * e.g.:
 * @UseGuards(AuthGuard('api-key'))
 * @Post()
 * async create(@Body() createCatDto: CreateCatDto) {
 *   this.catsService.create(createCatDto);
 * }
 */
@Injectable()
export class AuthHeaderApiKeyStrategy extends PassportStrategy(
    Strategy,
    'api-key'
) {
    /* eslint require-await: "off" */
    constructor(private readonly configService: ConfigService) {
        super(
            {
                header: 'X-API-KEY', // <-- Guard will looking for this header.
                prefix: '',
            },
            true,
            async (incomingApiKey, done) => {
                return this.validate(incomingApiKey, done);
            }
        );
    }

    private readonly validate = (
        incomingApiKey: string,
        done: (error, done) => {}
    ): void => {
        // This API_KEY is hardcoded into the .env file.
        if (this.configService.get<string>('API_KEY') === incomingApiKey) {
            done(null, true);
        } else {
            done(new UnauthorizedException('Your ApiKey is not valid.'), null);
        }
    };
}
