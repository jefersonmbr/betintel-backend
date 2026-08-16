import { Controller, Get, HttpStatus, Param, Redirect } from '@nestjs/common';
import { AffiliateClicksService } from './affiliate-clicks.service';

@Controller()
export class AffiliateClicksController {
  constructor(
    private readonly affiliateClicksService: AffiliateClicksService,
  ) {}

  // O "Apostar agora" do frontend aponta pra cá (a partir da Fase 5) em vez
  // de linkar direto pro affiliateUrl - assim todo clique fica registrado
  // antes do redirect.
  @Get('go/:bookmakerId/:gameId')
  @Redirect()
  async goToBookmaker(
    @Param('bookmakerId') bookmakerId: string,
    @Param('gameId') gameId: string,
  ) {
    const url = await this.affiliateClicksService.recordClickAndGetUrl(
      bookmakerId,
      gameId,
    );
    return { url, statusCode: HttpStatus.FOUND };
  }

  @Get('affiliate-clicks/stats')
  getStats() {
    return this.affiliateClicksService.getStatsByBookmaker();
  }
}
