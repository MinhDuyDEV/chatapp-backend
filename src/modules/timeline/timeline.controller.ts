import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { TimelinePostDto } from './dto/timeline-post.dto';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get('following')
  async getTimelineFollowing(
    @AuthUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: TimelinePostDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.timelineService.getTimelineFollowing(user.id, page, limit);
  }

  @Get('explore')
  async getTimelineExplore(
    @AuthUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: TimelinePostDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.timelineService.getTimelineExplore(user.id, limit, page);
  }
}
