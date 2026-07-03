import { Injectable, NotFoundException, BadRequestException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaClient) {}

  async processMessage(message: string, projectId: string, userId: string, history: any[]) {
    // ✅ Validate input
    if (!message || !message.trim()) {
      throw new BadRequestException('Message cannot be empty');
    }
    if (!projectId) {
      throw new BadRequestException('ProjectId is required');
    }
    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    // ✅ Check project exists and user has access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    // ✅ Check if user is the owner or has access
    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    try {
      // ✅ Save user message to database
      const userMessage = await this.prisma.message.create({
        data: {
          role: 'user',
          content: message.trim(),
          projectId,
          authorId: userId,
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
          authorId: userId, // System user ID or AI user
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

  async createProject(description: string, type: string, name: string, userId: string) {
    // ✅ Validate input
    if (!name || !name.trim()) {
      throw new BadRequestException('Project name is required');
    }
    if (!type || !type.trim()) {
      throw new BadRequestException('Project type is required');
    }
    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    try {
      const project = await this.prisma.project.create({
        data: {
          name: name.trim(),
          description: description ? description.trim() : null,
          type: type.trim(),
          status: 'active',
          ownerId: userId,
        },
      });

      this.logger.log(`Project created by user ${userId}: ${project.id}`);
      return project;
    } catch (error) {
      this.logger.error(`Error creating project: ${error.message}`, error.stack);
      throw new Error('Failed to create project');
    }
  }

  async modifyProject(projectId: string, instruction: string, userId: string) {
    // ✅ Validate input
    if (!projectId) {
      throw new BadRequestException('ProjectId is required');
    }
    if (!instruction || !instruction.trim()) {
      throw new BadRequestException('Instruction is required');
    }
    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    // ✅ Check project exists and user has access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to modify this project');
    }

    try {
      // ✅ Save modification instruction as a message
      const instructionMessage = await this.prisma.message.create({
        data: {
          role: 'user',
          content: instruction.trim(),
          projectId,
          authorId: userId,
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

  async getProjectWithMessages(projectId: string, userId: string) {
    if (!projectId) {
      throw new BadRequestException('ProjectId is required');
    }
    if (!userId) {
      throw new BadRequestException('UserId is required');
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

      // ✅ Check access
      if (project.ownerId !== userId) {
        throw new ForbiddenException('You do not have access to this project');
      }

      return project;
    } catch (error) {
      this.logger.error(`Error fetching project: ${error.message}`, error.stack);
      throw error;
    }
  }
}
