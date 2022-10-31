import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ConfigService } from '@nestjs/config';

/**
 * This strategy is responsible for validating the API key sent as the header X-API-KEY as part of requests.
 * For using add the decorator before a controller method.
 * e.g.:
 * @UseGuards(AuthGuard('API_KEY_GUARD'))
 * @Post()
 * async create(@Body() createCatDto: CreateCatDto) {
 *   this.catsService.create(createCatDto);
 * }
 */
export const API_KEY_GUARD = 'API_KEY_GUARD';
@Injectable()
export class AuthHeaderApiKeyStrategy extends PassportStrategy(
    Strategy,
    API_KEY_GUARD
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
            console.log('AuthHeaderApiKeyStrategy will return done');
            done(null, true);
        } else {
            console.log('AuthHeaderApiKeyStrategy return UnauthorizedException');
            done(new UnauthorizedException('Unauthorized Exception.',
                'Your API_KEY is not valid.'), null);
        }
    };
}
