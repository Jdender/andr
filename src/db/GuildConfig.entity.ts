import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class GuildConfig {

    @PrimaryColumn()
    id: string;

    @Column()
    prefix: string;
}
