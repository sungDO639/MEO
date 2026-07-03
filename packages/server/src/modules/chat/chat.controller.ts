import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ModifyProjectDto } from './dtos/modify-project.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() body: SendMessageDto) {
    return this.chatService.processMessage(
      body.message,
      body.projectId,
      body.history,
    );
  }

  @Post('create-project')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() body: CreateProjectDto) {
    return this.chatService.createProject(
      body.description,
      body.type,
      body.name,
    );
  }

  @Post('modify/:projectId')
  @HttpCode(HttpStatus.OK)
  async modifyProject(
    @Param('projectId') projectId: string,
    @Body() body: ModifyProjectDto,
  ) {
    return this.chatService.modifyProject(projectId, body.instruction);
  }

  @Get('project/:projectId')
  @HttpCode(HttpStatus.OK)
  async getProject(@Param('projectId') projectId: string) {
    return this.chatService.getProjectWithMessages(projectId);
  }
}
