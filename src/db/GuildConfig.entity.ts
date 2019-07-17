import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class GuildConfig {

    // This corresponds do the guild's discord id
    @PrimaryColumn()
    id: string;

    @Column()
    prefix: string;
}
