import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  BarcodeLookupDto, BatchDto, BatchTraceDto, CreateLocationDto, CreateProductDto, CreateVariantDto, ExpiringBatchDto,
  ExpiringBatchesQuery, ForecastLineDto, ForecastQuery, ListBatchesQuery, ListProductsQuery, LocationResponseDto, PeriodQuery,
  PeriodReportDto, ProductResponseDto, StockLedgerEntryDto, StockLevelDto, StockMovementDto, StockQuery, StockTransferDto,
  TransferResponseDto, UpdateLocationDto, UpdateProductDto, UpdateVariantDto, VariantStockDto,
} from './dto/inventory.dto';
import { InventoryService } from './inventory.service';

type AuthedRequest = { user: { id: string; businessId: string } };

const ALL = [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.OPS, UserRole.EMPLOYEE];
const STOCK = [UserRole.OWNER, UserRole.OPS];
const REPORTS = [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.OPS];

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Post('products')
  @Roles(...STOCK)
  @ApiCreatedResponse({ type: ProductResponseDto, description: 'Create a product with its variants. 409 if a SKU or barcode is already used.' })
  createProduct(@Req() req: AuthedRequest, @Body() dto: CreateProductDto) {
    return this.inventory.createProduct(req.user.businessId, dto);
  }

  @Get('products')
  @Roles(...ALL)
  @ApiOkResponse({ type: [ProductResponseDto], description: 'Active products by name. q searches name, SKU and exact barcode.' })
  findProducts(@Req() req: AuthedRequest, @Query() query: ListProductsQuery) {
    return this.inventory.findProducts(req.user.businessId, query);
  }

  @Get('products/:id')
  @Roles(...ALL)
  @ApiOkResponse({ type: ProductResponseDto })
  findProduct(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.inventory.findProduct(req.user.businessId, id);
  }

  @Patch('products/:id')
  @Roles(...STOCK)
  @ApiOkResponse({ type: ProductResponseDto, description: 'Edit a product. isActive: false archives it.' })
  updateProduct(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.inventory.updateProduct(req.user.businessId, id, dto);
  }

  @Post('products/:id/variants')
  @Roles(...STOCK)
  @ApiCreatedResponse({ type: ProductResponseDto, description: 'Add a variant. Returns the whole product.' })
  addVariant(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.inventory.addVariant(req.user.businessId, id, dto);
  }

  @Patch('variants/:id')
  @Roles(...STOCK)
  @ApiOkResponse({ type: ProductResponseDto, description: 'Edit a variant. isActive: false archives it. Returns the whole product.' })
  updateVariant(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.inventory.updateVariant(req.user.businessId, id, dto);
  }

  @Post('locations')
  @Roles(...STOCK)
  @ApiCreatedResponse({ type: LocationResponseDto, description: 'A shop, godown or warehouse. 409 if the name is taken.' })
  createLocation(@Req() req: AuthedRequest, @Body() dto: CreateLocationDto) {
    return this.inventory.createLocation(req.user.businessId, dto);
  }

  @Get('locations')
  @Roles(...ALL)
  @ApiOkResponse({ type: [LocationResponseDto], description: 'Active locations first' })
  findLocations(@Req() req: AuthedRequest) {
    return this.inventory.findLocations(req.user.businessId);
  }

  @Patch('locations/:id')
  @Roles(...STOCK)
  @ApiOkResponse({ type: LocationResponseDto, description: 'Rename, change address, or archive with isActive: false' })
  updateLocation(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.inventory.updateLocation(req.user.businessId, id, dto);
  }

  @Post('stock/movements')
  @Roles(...STOCK)
  @ApiCreatedResponse({
    type: [StockLedgerEntryDto],
    description: 'Stock in, stock out, or a physical count (ADJUST). 400 if it would take stock below 0. ' +
      'Returns the ledger rows written: usually one, more when an OUT spans several batches. ' +
      'Sends live inventory.low_stock when the variant drops to its threshold, and inventory.shrinkage when a count finds stock missing.',
  })
  recordMovement(@Req() req: AuthedRequest, @Body() dto: StockMovementDto) {
    return this.inventory.recordMovement(req.user.businessId, dto, req.user.id);
  }

  @Post('stock/transfers')
  @Roles(...STOCK)
  @ApiCreatedResponse({ type: TransferResponseDto, description: 'Move stock between two locations. All items move or none do (400 if any is short).' })
  transfer(@Req() req: AuthedRequest, @Body() dto: StockTransferDto) {
    return this.inventory.transfer(req.user.businessId, dto, req.user.id);
  }

  @Get('barcode/:code')
  @Roles(...ALL)
  @ApiOkResponse({ type: BarcodeLookupDto, description: 'Scanner lookup: the variant with this barcode and its stock at each location. 404 if none.' })
  findByBarcode(@Req() req: AuthedRequest, @Param('code') code: string) {
    return this.inventory.findByBarcode(req.user.businessId, code);
  }

  @Get('stock')
  @Roles(...ALL)
  @ApiOkResponse({ type: [StockLevelDto], description: 'Current stock per variant per location' })
  findStock(@Req() req: AuthedRequest, @Query() query: StockQuery) {
    return this.inventory.findStock(req.user.businessId, query);
  }

  @Get('batches')
  @Roles(...ALL)
  @ApiOkResponse({ type: [BatchDto], description: 'Batches, soonest expiry first, with where each has stock now' })
  findBatches(@Req() req: AuthedRequest, @Query() query: ListBatchesQuery) {
    return this.inventory.findBatches(req.user.businessId, query);
  }

  @Get('batches/expiring')
  @Roles(...ALL)
  @ApiOkResponse({ type: [ExpiringBatchDto], description: 'Batches with stock that expire within `days` (default 30), plus already expired ones' })
  expiringBatches(@Req() req: AuthedRequest, @Query() { days = 30 }: ExpiringBatchesQuery) {
    return this.inventory.expiringBatches(days, req.user.businessId);
  }

  @Get('batches/:id/trace')
  @Roles(...ALL)
  @ApiOkResponse({ type: BatchTraceDto, description: 'Batch traceability: every movement of the batch, oldest first, and where it sits now' })
  traceBatch(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.inventory.traceBatch(req.user.businessId, id);
  }

  @Get('stock/low')
  @Roles(...ALL)
  @ApiOkResponse({ type: [VariantStockDto], description: 'Variants whose total stock across active locations is at or below their lowStockThreshold' })
  lowStock(@Req() req: AuthedRequest) {
    return this.inventory.lowStock(req.user.businessId);
  }

  @Get('reports/cogs')
  @Roles(...REPORTS)
  @ApiOkResponse({ type: PeriodReportDto, description: 'Cost of goods sold: units sold (OUT) in the period at their recorded unit cost, per variant' })
  cogs(@Req() req: AuthedRequest, @Query() query: PeriodQuery) {
    return this.inventory.cogs(req.user.businessId, query);
  }

  @Get('reports/shrinkage')
  @Roles(...REPORTS)
  @ApiOkResponse({ type: PeriodReportDto, description: 'Stock that physical counts (ADJUST) found missing in the period, per variant and location, at cost' })
  shrinkage(@Req() req: AuthedRequest, @Query() query: PeriodQuery) {
    return this.inventory.shrinkage(req.user.businessId, query);
  }

  @Get('reports/forecast')
  @Roles(...REPORTS)
  @ApiOkResponse({ type: [ForecastLineDto], description: 'Demand forecast v1: average daily sales carried forward, with days of cover and a suggested reorder. Soonest to run out first.' })
  forecast(@Req() req: AuthedRequest, @Query() query: ForecastQuery) {
    return this.inventory.forecast(req.user.businessId, query);
  }

  @Get('stock/ledger')
  @Roles(...ALL)
  @ApiOkResponse({ type: [StockLedgerEntryDto], description: 'Stock history, newest first (latest 200)' })
  findLedger(@Req() req: AuthedRequest, @Query() query: StockQuery) {
    return this.inventory.findLedger(req.user.businessId, query);
  }
}
