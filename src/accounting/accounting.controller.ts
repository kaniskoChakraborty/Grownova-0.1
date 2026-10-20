import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountDto, CreateAccountDto, CreateJournalDto, JournalDto, LedgerQuery, ListAccountsQuery, ListJournalsQuery, ReverseJournalDto, TrialBalanceQuery, UpdateAccountDto } from './dto/accounting.dto';
import { AccountingService } from './accounting.service';

type AuthedRequest = { user: { id: string; businessId: string } };

const BOOKS = [UserRole.OWNER, UserRole.ACCOUNTANT];

@ApiTags('Accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...BOOKS)
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accounting: AccountingService) {}

  @Get('accounts')
  @ApiOkResponse({ type: [AccountDto], description: 'Chart of accounts by code. The standard Indian chart is created on first use.' })
  findAccounts(@Req() req: AuthedRequest, @Query() query: ListAccountsQuery) {
    return this.accounting.findAccounts(req.user.businessId, query);
  }

  @Post('accounts')
  @ApiCreatedResponse({ type: AccountDto, description: 'Add an account; 409 if the code or name is taken' })
  createAccount(@Req() req: AuthedRequest, @Body() dto: CreateAccountDto) {
    return this.accounting.createAccount(req.user.businessId, dto);
  }

  @Patch('accounts/:id')
  @ApiOkResponse({ type: AccountDto, description: 'Rename or archive an account. Type and code never change, so history stays right.' })
  updateAccount(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accounting.updateAccount(req.user.businessId, id, dto);
  }

  @Post('journals')
  @ApiCreatedResponse({ type: JournalDto, description: 'Post a double-entry journal; 400 unless debits equal credits. Posted journals cannot be edited.' })
  createJournal(@Req() req: AuthedRequest, @Body() dto: CreateJournalDto) {
    return this.accounting.createJournal(req.user.businessId, dto, req.user.id);
  }

  @Get('journals')
  @ApiOkResponse({ type: [JournalDto], description: 'Latest 100 journals, newest date first' })
  findJournals(@Req() req: AuthedRequest, @Query() query: ListJournalsQuery) {
    return this.accounting.findJournals(req.user.businessId, query);
  }

  @Get('journals/:id')
  @ApiOkResponse({ type: JournalDto })
  findJournal(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.accounting.findJournal(req.user.businessId, id);
  }

  @Post('journals/:id/reverse')
  @ApiCreatedResponse({ type: JournalDto, description: 'Cancel a journal by posting its mirror image; the original stays untouched' })
  reverseJournal(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: ReverseJournalDto) {
    return this.accounting.reverseJournal(req.user.businessId, id, dto, req.user.id);
  }

  @Get('ledger/:accountId')
  @ApiOkResponse({ description: 'One account\'s postings with opening, running and closing balance (positive on its normal side). Defaults to this financial year.' })
  ledger(@Req() req: AuthedRequest, @Param('accountId') accountId: string, @Query() query: LedgerQuery) {
    return this.accounting.ledger(req.user.businessId, accountId, query);
  }

  @Get('trial-balance')
  @ApiOkResponse({ description: 'Net debit or credit of every account with postings, as of a day; balanced is true when the columns agree' })
  trialBalance(@Req() req: AuthedRequest, @Query() query: TrialBalanceQuery) {
    return this.accounting.trialBalance(req.user.businessId, query);
  }
}
