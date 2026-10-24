import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GrahakService } from './grahak.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  RegisterAccountDto,
  CreateBillDto,
  KhataTransactionDto,
  AttendanceRecordDto,
  InventoryScanDto,
} from './dto/grahak.dto';

@ApiTags('Grahak B2B-B2C Engine')
@Controller('grahak')
export class GrahakController {
  constructor(private readonly grahakService: GrahakService) {}

  @Post('auth/otp')
  @ApiOperation({ summary: 'Send OTP for B2B Merchant or B2C Grahak Customer' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.grahakService.sendOtp(dto);
  }

  @Post('auth/verify')
  @ApiOperation({ summary: 'Verify 6-digit OTP and establish session' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.grahakService.verifyOtp(dto);
  }

  @Post('auth/register')
  @ApiOperation({ summary: 'Register new B2B Merchant Store or B2C Grahak profile' })
  register(@Body() dto: RegisterAccountDto) {
    return this.grahakService.registerAccount(dto);
  }

  @Get('stores')
  @ApiOperation({ summary: 'List B2B merchant stores for B2C consumer discovery' })
  getStores() {
    return this.grahakService.getStores();
  }

  @Get('stores/:id')
  @ApiOperation({ summary: 'Get B2B merchant store profile and UPI details' })
  getStoreById(@Param('id') id: string) {
    return this.grahakService.getStoreById(id);
  }

  @Get('catalog')
  @ApiOperation({ summary: 'Get store product catalog and live inventory' })
  getCatalog(@Query('storeId') storeId?: string) {
    return this.grahakService.getCatalog(storeId);
  }

  @Post('inventory/scan')
  @ApiOperation({ summary: 'Scan barcode or AI photo to detect product and check stock' })
  scanInventory(@Body() dto: InventoryScanDto) {
    return this.grahakService.scanInventory(dto);
  }

  @Get('khata/:phone')
  @ApiOperation({ summary: 'Get Customer Khata / Udhaar balance and transaction history' })
  getCustomerKhata(@Param('phone') phone: string, @Query('storeId') storeId?: string) {
    return this.grahakService.getCustomerKhata(phone, storeId);
  }

  @Post('khata/transaction')
  @ApiOperation({ summary: 'Record Udhaar (credit) or Jama (payment) in Khata ledger' })
  addKhataTransaction(@Body() dto: KhataTransactionDto) {
    return this.grahakService.addKhataTransaction(dto);
  }

  @Post('bills')
  @ApiOperation({ summary: 'Create digital bill, update inventory, and generate digital Parchi' })
  createBill(@Body() dto: CreateBillDto) {
    return this.grahakService.createBill(dto);
  }

  @Get('bills/:id')
  @ApiOperation({ summary: 'Get digital bill receipt (Parchi) by ID or bill number' })
  getBillById(@Param('id') id: string) {
    return this.grahakService.getBillById(id);
  }

  @Post('attendance')
  @ApiOperation({ summary: 'Record Geo-tagged staff attendance with photo and GPS location' })
  recordAttendance(@Body() dto: AttendanceRecordDto) {
    return this.grahakService.recordAttendance(dto);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'List today staff attendance for B2B merchant dashboard' })
  getAttendance(@Query('storeId') storeId?: string) {
    return this.grahakService.getAttendance(storeId);
  }

  @Get('i18n')
  @ApiOperation({ summary: 'Get supported Indian languages metadata and translations' })
  getI18n() {
    return {
      success: true,
      supportedLanguages: [
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', greeting: 'नमस्ते' },
        { code: 'en', name: 'English', nativeName: 'English', greeting: 'Welcome' },
        { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' },
        { code: 'mr', name: 'Marathi', nativeName: 'मराठी', greeting: 'नमस्कार' },
        { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', greeting: 'નમસ્તે' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', greeting: 'নমস্কার' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', greeting: 'வணக்கம்' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', greeting: 'నమస్కారం' },
        { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ' },
      ],
      defaultLanguage: 'hi',
    };
  }
}
