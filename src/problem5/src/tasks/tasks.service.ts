import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async list(
    filters: ListTasksDto,
  ): Promise<{ data: Task[]; total: number; limit: number; offset: number }> {
    const where: Prisma.TaskWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.q) where.title = { contains: filters.q, mode: 'insensitive' };

    if (filters.dueBefore || filters.dueAfter) {
      where.dueDate = {};
      if (filters.dueAfter) where.dueDate.gte = new Date(filters.dueAfter);
      if (filters.dueBefore) where.dueDate.lte = new Date(filters.dueBefore);
    }

    const limit = filters.limit ?? 20;
    const offset = filters.offset ?? 0;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, limit, offset };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id); // 404 if missing
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate:
          dto.dueDate === null
            ? null
            : dto.dueDate
              ? new Date(dto.dueDate)
              : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // 404 if missing
    await this.prisma.task.delete({ where: { id } });
  }
}
