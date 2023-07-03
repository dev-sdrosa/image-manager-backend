import { Injectable, InternalServerErrorException, Logger, LoggerService } from '@nestjs/common';

import slugify from 'slugify';
import { IMessage } from 'src/common/interfaces/message.interface';
import { v4 } from 'uuid';

@Injectable()
export class CommonService {
  private readonly loggerService: LoggerService;

  constructor() { 
    this.loggerService = new Logger(CommonService.name);
  }

  public formatName(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  public generatePointSlug(str: string): string {
    return slugify(str, { lower: true, replacement: '.', remove: /['_\.\-]/g });
  }

  public generateMessage(message: string): IMessage {
    return { id: v4(), message };
  }

  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}