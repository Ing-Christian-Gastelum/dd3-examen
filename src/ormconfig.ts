import { configService } from './config/config.service';

const connectionOptions = configService.getTypeOrmConfig();

export default connectionOptions;
