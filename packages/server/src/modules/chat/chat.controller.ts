import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ModifyProjectDto } from './dtos/modify-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() body: SendMessageDto, @Request() req: any) {
    return this.chatService.processMessage(
      body.message,
      body.projectId,
      req.user.id,
      body.history,
    );
  }

  @Post('create-project')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() body: CreateProjectDto, @Request() req: any) {
    return this.chatService.createProject(
      body.description,
      body.type,
      body.name,
      req.user.id,
    );
  }

  @Post('modify/:projectId')
  @HttpCode(HttpStatus.OK)
  async modifyProject(
    @Param('projectId') projectId: string,
    @Body() body: ModifyProjectDto,
    @Request() req: any,
  ) {
    return this.chatService.modifyProject(projectId, body.instruction, req.user.id);
  }

  @Get('project/:projectId')
  @HttpCode(HttpStatus.OK)
  async getProject(@Param('projectId') projectId: string, @Request() req: any) {
    return this.chatService.getProjectWithMessages(projectId, req.user.id);
  }
}
