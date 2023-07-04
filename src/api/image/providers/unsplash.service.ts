import { Injectable } from '@nestjs/common';
import { PageUnsplashDto } from 'src/common/dto/page/page-options.dto';
import { HttpService } from '@nestjs/axios/dist';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class UnsplashService {
    cliend_id = process.env.UNSPLASH_CLIEND_ID;

    constructor(
        private readonly httpService: HttpService
    ) { }

    public async getImages(
        pageOptionsDto: PageUnsplashDto
    ) {
        const rp = await firstValueFrom(this.httpService.get('https://api.unsplash.com/search/photos', {
            params: {
                query: pageOptionsDto.query,
                per_page: pageOptionsDto.take,
                page: pageOptionsDto.page,
                client_id: this.cliend_id
            }
        }))

        return rp.data
    }

    async downloadExternalImage(downloadUrl: string) {
        console.log(downloadUrl)
        const ex = String(downloadUrl).match(/fm=([^&]*)/)[1];
        const filename = `temp.${ex}`;

        const { data } = await firstValueFrom(this.httpService
            .get(
                downloadUrl,
                {
                    responseType:"arraybuffer",
                    params: {
                        client_id: this.cliend_id
                    }
                }
            ))
       
        return { buffer: Buffer.from(data), filename: filename};
    }




}