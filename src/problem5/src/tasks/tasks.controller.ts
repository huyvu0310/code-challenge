import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks with optional filters & pagination' })
  list(@Query() filters: ListTasksDto) {
    return this.tasks.list(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasks.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a task' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasks.remove(id);
  }
}
