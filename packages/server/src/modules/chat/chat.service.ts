import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaClient) {}

  async processMessage(message: string, projectId: string, history: any[]) {
    // ✅ Validate input
    if (!message || !message.trim()) {
      throw new BadRequestException('Message cannot be empty');
    }
    if (!projectId) {
      throw new BadRequestException('ProjectId is required');
    }

    // ✅ Check project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    try {
      // ✅ Save user message to database
      const userMessage = await this.prisma.message.create({
        data: {
          role: 'user',
          content: message.trim(),
          projectId,
          metadata: { history: history || [] },
        },
      });

      // TODO: Integrate with Anthropic/OpenAI SDK here
      const aiResponse = `MEO AI response to: "${message}"`;

      // ✅ Save AI response to database
      const assistantMessage = await this.prisma.message.create({
        data: {
          role: 'assistant',
          content: aiResponse,
          projectId,
          metadata: { fromAI: true },
        },
      });

      return {
        id: assistantMessage.id,
        role: 'assistant',
        content: aiResponse,
        timestamp: assistantMessage.createdAt,
      };
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`, error.stack);
      throw new Error('Failed to process message');
    }
  }

  async createProject(description: string, type: string, name: string) {
    // ✅ Validate input
    if (!name || !name.trim()) {
      throw new BadRequestException('Project name is required');
    }
    if (!type || !type.trim()) {
      throw new BadRequestException('Project type is required');
    }

    try {
      const project = await this.prisma.project.create({
        data: {
          name: name.trim(),
          description: description ? description.trim() : null,
          type: type.trim(),
          status: 'active',
        },
      });

      this.logger.log(`Project created: ${project.id}`);
      return project;
    } catch (error) {
      this.logger.error(`Error creating project: ${error.message}`, error.stack);
      throw new Error('Failed to create project');
    }
  }

  async modifyProject(projectId: string, instruction: string) {
    // ✅ Validate input
    if (!projectId) {
      throw new BadRequestException('ProjectId is required');
    }
    if (!instruction || !instruction.trim()) {
      throw new BadRequestException('Instruction is required');
    }

    // ✅ Check project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    try {
      // ✅ Save modification instruction as a message
      const instructionMessage = await this.prisma.message.create({
        data: {
          role: 'user',
          content: instruction.trim(),
          projectId,
          metadata: { type: 'modification' },
        },
      });

      this.logger.log(`Modification instruction saved for project: ${projectId}`);

      // TODO: Implement actual AI-driven modification
      return {
        success: true,
        message: `Modification instruction saved for project ${projectId}`,
        messageId: instructionMessage.id,
      };
    } catch (error) {
      this.logger.error(`Error modifying project: ${error.message}`, error.stack);
      throw new Error('Failed to modify project');
    }
  }

  async getProjectWithMessages(projectId: string) {
    if (!projectId) {
      throw new BadRequestException('ProjectId is required');
    }

    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
          files: { orderBy: { createdAt: 'asc' } },
        },
      });

      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      return project;
    } catch (error) {
      this.logger.error(`Error fetching project: ${error.message}`, error.stack);
      throw error;
    }
  }
}
