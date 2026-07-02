```typescript
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() body: { message: string; projectId: string; history: any[] }) {
    return this.chatService.processMessage(body.message, body.projectId, body.history);
  }

  @Post('create-project')
  async createProject(@Body() body: { description: string; type: string; name: string }) {
    return this.chatService.createProject(body.description, body.type, body.name);
  }

  @Post('modify/:projectId')
  async modifyProject(@Param('projectId') projectId: string, @Body() body: { instruction: string }) {
    return this.chatService.modifyProject(projectId, body.instruction);
  }
}
```